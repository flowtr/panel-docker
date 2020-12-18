import * as React from "react";
import { Container } from "./containerListItem";
import { ContainerList } from "./containerList";
import * as _ from "lodash";
import * as io from "socket.io-client";
import { NewContainerDialog } from "./newContainerModal";
import { DialogTrigger } from "./dialogTrigger";
import Modal from "./modal";
import { createRef } from "react";
import { Button } from "antd";

const socket = io.connect();

class AppState {
    containers?: Container[];
    stoppedContainers?: Container[];
}

export class AppComponent extends React.Component<
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
            const partitioned = _.partition(
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

    onRunImage(name: string, env: Record<string, string>) {
        socket.emit("image.run", { name, env });
    }

    render() {
        return (
            <div className="container">
                <h1 className="page-header">Docker Dashboard</h1>
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
