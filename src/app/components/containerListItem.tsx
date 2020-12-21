import React from "react";
import classNames from "classnames";
import * as io from "socket.io-client";
import { Button, Stack, Heading } from "@chakra-ui/react";
import { BaseModal } from "./base/modal";
import { ContainerData } from "../../common/types";
import { ThemedCard } from "./base/card";

const socket = io.connect("localhost:3000");

export class ContainerListItem extends React.Component<
    ContainerData,
    Record<string, unknown>
> {
    private removeModalRef: React.RefObject<BaseModal>;

    constructor(props: ContainerData) {
        super(props);
        this.removeModalRef = React.createRef();
    }

    onActionButtonClick() {
        const evt = this.isRunning() ? "container.stop" : "container.start";
        socket.emit(evt, { id: this.props.id });
    }

    /**
     * Prompts the user before removing the container
     */
    onRemoveBtnClicked() {
        this.removeModalRef.current.toggleModal();
    }

    removeContainer() {
        const evt = "container.rm";
        socket.emit(evt, { id: this.props.id });
    }

    isRunning() {
        return this.props.state === "running";
    }

    render() {
        const panelClass = this.isRunning() ? "success" : "default";
        const classes = classNames("panel", `panel-${panelClass}`);
        const buttonText = this.isRunning() ? "Stop" : "Start";

        return (
            <div>
                <ThemedCard
                    className={classes}
                    cardTitle={
                        <Heading px={10} pt={10} as={"h2"} bg={"background"}>
                            {this.props.name}
                        </Heading>
                    }
                >
                    <div className="panel-body">
                        Status: {this.props.status}
                        <br />
                        Image: {this.props.image}
                    </div>
                    <Stack direction="row" bg="secondaryBackground">
                        <Button
                            colorScheme={"blue"}
                            onClick={this.onActionButtonClick.bind(this)}
                            className="btn btn-default"
                        >
                            {buttonText}
                        </Button>
                        <Button
                            colorScheme={"red"}
                            onClick={this.onRemoveBtnClicked.bind(this)}
                            className="btn btn-default"
                        >
                            Remove
                        </Button>
                    </Stack>
                </ThemedCard>
                <BaseModal
                    buttonText="Remove"
                    title="Are you sure you want to remove this container?"
                    ref={this.removeModalRef}
                    style={{ zIndex: 99 }}
                    width={250}
                    height={200}
                    onButtonClicked={this.removeContainer.bind(this)}
                />
            </div>
        );
    }
}
