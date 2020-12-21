import React from "react";
import { ContainerList } from "../components/containerList";
import { partition } from "lodash";
import * as io from "socket.io-client";
import { NewContainerDialog } from "../components/newContainerModal";
import { DialogTrigger } from "../components/dialogTrigger";
import { BaseModal } from "../components/base/modal";
import { createRef } from "react";
import { ContainerData, KeyValDef } from "../../common/types";
import { ContainerInfo } from "dockerode";
import { createStandaloneToast } from "@chakra-ui/react";

const socket = io.connect("localhost:3000");

class AppState {
    containers?: ContainerData[];
    stoppedContainers?: ContainerData[];
}

export class HomePage extends React.Component<
    Record<string, unknown>,
    AppState
> {
    private newContainerModal: React.RefObject<BaseModal>;

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
        const toast = createStandaloneToast();

        socket.on("error.image", (args: { message: unknown }) => {
            // alert(args.message.json.message);
            toast({
                title: "An Error Ocurred",
                description: JSON.stringify(args.message),
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        });
        socket.on("error.refresh", (args: { message: unknown }) => {
            toast({
                title: "An Error Ocurred",
                description: JSON.stringify(args.message),
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        });
    }

    mapContainer(container: ContainerInfo): ContainerData {
        // TODO: volumes and environment variables
        return {
            id: container.Id as string,
            name: (container.Names as string[])
                .map((n: string) => n.substr(1))
                .join(", "),
            state: container.State as string,
            status: `${container.State} (${container.Status})`,
            image: container.Image as string,
            env: {},
            ports: {},
            volumes: {},
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
