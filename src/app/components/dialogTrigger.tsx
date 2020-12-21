import React from "react";
import { Button } from "antd";
import Modal from "./modal";

export interface DialogTriggerProperties {
    modal: Modal;
    buttonText: string;
}

export class DialogTrigger extends React.Component<
    DialogTriggerProperties,
    Record<string, unknown>
> {
    render() {
        return (
            <Button
                type={"primary"}
                style={{ marginBottom: "15px" }}
                onClick={this.props.modal && this.props.modal.toggleModal}
            >
                {this.props.buttonText}
            </Button>
        );
    }
}
