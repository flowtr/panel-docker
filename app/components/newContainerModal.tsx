import * as React from "react";
import Modal from "./modal";
import * as classNames from "classnames";
import { createRef, SyntheticEvent } from "react";
import { Input, Row } from "antd";
import { ObjectMap } from "./object-map";
import { KeyValDef } from "./key-value-editor";

interface ModalProperties {
    modalRef: React.Ref<Modal>;
    onRunImage?: (name: string, env: KeyValDef) => void;
}

interface ModalState {
    imageName: string;
    isValid: boolean;
}

export class NewContainerDialog extends React.Component<
    ModalProperties,
    ModalState
> {
    private envMapRef: React.RefObject<ObjectMap>;

    constructor(props: ModalProperties) {
        super(props);

        this.state = {
            imageName: "",
            isValid: false,
        };
        this.envMapRef = createRef();
    }

    onImageNameChange(e: SyntheticEvent<{ value: string }>) {
        const name = e.currentTarget.value;

        this.setState({
            imageName: name,
            isValid: name.length > 0,
        });
    }

    runImage() {
        console.debug(this.envMapRef.current.state.keyValues);
        if (this.state.isValid && this.props.onRunImage)
            this.props.onRunImage(
                this.state.imageName,
                this.envMapRef.current.state.keyValues ?? {}
            );

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
                        <Row>
                            {" "}
                            <label
                                htmlFor="imageName"
                                className="control-label"
                            >
                                Image name
                            </label>
                        </Row>
                        <Row>
                            <Input
                                type="text"
                                className="form-control"
                                onChange={this.onImageNameChange.bind(this)}
                                id="imageName"
                                placeholder="e.g mongodb:latest"
                            />
                        </Row>
                        <label
                            className="control-label"
                            style={{ marginTop: "15px" }}
                        >
                            Environment variables
                        </label>
                        <ObjectMap key="env-map" ref={this.envMapRef} />
                    </div>
                </form>
            </Modal>
        );
    }
}
