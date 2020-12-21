import React from "react";
import { Container } from "../components/containerListItem";
import { ContainerList } from "../components/containerList";
import { partition } from "lodash";
import * as io from "socket.io-client";
import { NewContainerDialog } from "../components/newContainerModal";
import { DialogTrigger } from "../components/dialogTrigger";
import Modal from "../components/modal";
import { createRef } from "react";
import { Button } from "antd";
import { KeyValDef } from "../components/key-value-editor";

const socket = io.connect();

class AppState {
    containers?: Container[];
    stoppedContainers?: Container[];
}

export class HomePage extends React.Component<
    Record<string, unknown>,
    AppState
> {
    private newContainerModal: React.RefObject<Modal>;

    constructor(props: Record<string, unknown>) {
        super(props);
        this.state = {
            containers: [],
            stoppedContainers: [],
        };
        this.newContainerModal = createRef();

        socket.on("containers.list", (containers: Record<string, unknown>) => {
            const partitioned = partition(
                containers,
                (c: Record<string, unknown>) => c.State == "running"
            );

            this.setState({
                containers: partitioned[0].map(this.mapContainer),
                stoppedContainers: partitioned[1].map(this.mapContainer),
            });
        });

        socket.on(
            "image.error",
            (args: { message: { json: { message: string } } }) => {
                alert(args.message.json.message);
            }
        );
    }

    mapContainer(container: Record<string, unknown>): Container {
        return {
            id: container.Id as string,
            name: (container.Names as string[])
                .map((n: string) => n.substr(1))
                .join(", "),
            state: container.State as string,
            status: `${container.State} (${container.Status})`,
            image: container.Image as string,
        };
    }

    componentDidMount() {
        socket.emit("containers.list");
    }

    onRunImage(
        name: string,
        image: string,
        env: KeyValDef,
        ports: KeyValDef,
        volumes: KeyValDef
    ) {
        socket.emit("image.run", { name, image, env, ports, volumes });
    }

    render() {
        return (
            <div className="">
                <DialogTrigger
                    modal={this.newContainerModal.current}
                    buttonText="New container"
                />

                <ContainerList
                    title="Running"
                    containers={this.state.containers}
                />
                <ContainerList
                    title="Stopped containers"
                    containers={this.state.stoppedContainers}
                />
                <NewContainerDialog
                    modalRef={this.newContainerModal}
                    onRunImage={this.onRunImage.bind(this)}
                />
            </div>
        );
    }
}
