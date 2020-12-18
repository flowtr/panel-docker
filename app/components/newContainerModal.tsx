import * as React from "react";
import Modal from "./modal";
import * as classNames from "classnames";
import { SyntheticEvent } from "react";
import { Input, Col } from "antd";

interface ModalProperties {
    modalRef: React.Ref<Modal>;
    onRunImage?: (name: string) => void;
}

interface ModalState {
    imageName: string;
    isValid: boolean;
}

export class NewContainerDialog extends React.Component<
    ModalProperties,
    ModalState
> {
    constructor(props: ModalProperties) {
        super(props);

        this.state = {
            imageName: "",
            isValid: false,
        };
    }

    onImageNameChange(e: SyntheticEvent<{ value: string }>) {
        const name = e.currentTarget.value;

        this.setState({
            imageName: name,
            isValid: name.length > 0,
        });
    }

    runImage() {
        if (this.state.isValid && this.props.onRunImage)
            this.props.onRunImage(this.state.imageName);

        return this.state.isValid;
    }

    render() {
        const inputClass = classNames({
            "form-group": true,
            "has-error": !this.state.isValid,
        });

        return (
            <Modal
                buttonText="Run"
                title="Create a new container"
                ref={this.props.modalRef}
                onButtonClicked={this.runImage.bind(this)}
            >
                <form>
                    <div className={inputClass}>
                        <Col flex={"auto"}>
                            {" "}
                            <label
                                htmlFor="imageName"
                                className="control-label"
                            >
                                Image name
                            </label>
                        </Col>
                        <Col flex={"auto"}>
                            <Input
                                type="text"
                                className="form-control"
                                onChange={this.onImageNameChange.bind(this)}
                                id="imageName"
                                placeholder="e.g mongodb:latest"
                            />
                        </Col>
                    </div>
                </form>
            </Modal>
        );
    }
}
