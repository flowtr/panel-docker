import React, { Component, ReactNode } from "react";
import { Box, Button, Heading } from "@chakra-ui/react";
import { Rnd } from "react-rnd";
import { ThemedCard } from "./card";
import { XCircle } from "react-feather";

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
    width: number;
    height: number;
    title: string;
    buttonText?: ReactNode;
    onToggle?: () => boolean;
    onButtonClicked: () => void;
};

export interface ModalState {
    width: number;
    height: number;
    x: number;
    y: number;
    visible: boolean;
}

export class BaseModal extends Component<ModalProps, ModalState> {
    constructor(props: ModalProps) {
        super(props);
        console.log(this.props);
        this.state = {
            width: this.props.width,
            height: this.props.height,
            x: 0,
            y: 0,
            visible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal(): void {
        if (this.props.onToggle && this.props.onToggle() === false) return;
        this.setState((prev) => ({ visible: !prev.visible }));
    }

    render() {
        return (
            <Rnd
                size={{
                    width: this.state.width,
                    height: this.state.height,
                }}
                position={{
                    x: this.state.x,
                    y: this.state.y,
                }}
                onDragStop={(_, d) => {
                    this.setState({ x: d.x, y: d.y });
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                    this.setState({
                        width: parseFloat(ref.style.width),
                        height: parseFloat(ref.style.height),
                        ...position,
                    });
                }}
                style={{ display: this.state.visible ? "flex" : "none" }}
                cancel={"input, textarea, button"}
            >
                <Box
                    bg={"background"}
                    width={this.state.width}
                    height={this.state.height}
                >
                    <ThemedCard
                        border={"10px solid grey"}
                        className={"modal-card"}
                        cardTitle={
                            <Box bg="background" style={{ display: "inline" }}>
                                <Heading p={10} as={"h2"} bg={"background"}>
                                    {this.props.title}
                                </Heading>
                                <Button
                                    colorScheme={"blue"}
                                    onClick={() => this.toggleModal()}
                                    style={{ float: "right" }}
                                >
                                    <XCircle />
                                </Button>
                            </Box>
                        }
                        bg={"secondaryBackground"}
                    >
                        {this.props.children}
                        {this.props.buttonText &&
                        typeof this.props.buttonText === "string" ? (
                            <Button
                                colorScheme={"blue"}
                                onClick={() => this.props.onButtonClicked()}
                                style={{ float: "right" }}
                            >
                                {this.props.buttonText}
                            </Button>
                        ) : (
                            this.props.buttonText
                        )}
                    </ThemedCard>
                </Box>
            </Rnd>
        );
    }
}
