import React from "react";
import { Button } from "@chakra-ui/react";
import { BaseModal } from "./base/modal";

export interface DialogTriggerProperties {
    modal: BaseModal;
    buttonText: string;
}

export class DialogTrigger extends React.Component<
    DialogTriggerProperties,
    Record<string, unknown>
> {
    render() {
        return (
            <Button
                colorScheme={"blue"}
                style={{ marginBottom: "15px" }}
                onClick={this.props.modal && this.props.modal.toggleModal}
            >
                {this.props.buttonText}
            </Button>
        );
    }
}
