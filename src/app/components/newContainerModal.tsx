import React from "react";
import Modal from "./modal";
import classNames from "classnames";
import { createRef, SyntheticEvent } from "react";
import { Input, Row } from "antd";
import { ObjectMap } from "./object-map";
import { KeyValDef } from "./key-value-editor";

interface ModalProperties {
    modalRef: React.Ref<Modal>;
    onRunImage?: (
        name: string,
        image: string,
        env: KeyValDef,
        ports: KeyValDef,
        volumes: KeyValDef
    ) => void;
}

interface ModalState {
    imageName: string;
    name: string;
    isValid: boolean;
}

export class NewContainerDialog extends React.Component<
    ModalProperties,
    ModalState
> {
    private envMapRef: React.RefObject<ObjectMap>;
    private portMapRef: React.RefObject<ObjectMap>;
    private volMapRef: React.RefObject<ObjectMap>;

    constructor(props: ModalProperties) {
        super(props);

        this.state = {
            imageName: "",
            name: "",
            isValid: false,
        };
        this.envMapRef = createRef();
        this.volMapRef = createRef();
        this.portMapRef = createRef();
    }

    onImageNameChange(e: SyntheticEvent<{ value: string }>) {
        const name = e.currentTarget.value;

        this.setState({
            imageName: name,
            isValid: name.length > 0,
        });
    }

    onNameChange(e: SyntheticEvent<{ value: string }>) {
        const name = e.currentTarget.value;

        this.setState({
            name: name,
            isValid: name.length > 0,
        });
    }

    runImage() {
        console.debug(this.envMapRef.current.state.keyValues);
        if (this.state.isValid && this.props.onRunImage)
            this.props.onRunImage(
                this.state.name,
                this.state.imageName,
                this.envMapRef.current.state.keyValues ?? {},
                this.portMapRef.current.state.keyValues ?? {},
                this.volMapRef.current.state.keyValues ?? {}
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
                                htmlFor="deploymentName"
                                className="control-label"
                            >
                                Deployment name
                            </label>
                        </Row>
                        <Row>
                            <Input
                                type="text"
                                className="form-control"
                                onChange={this.onNameChange.bind(this)}
                                id="deploymentName"
                                placeholder="e.g my_deployment"
                            />
                        </Row>
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
                        <ObjectMap id="env-map" ref={this.portMapRef} />
                        <label
                            className="control-label"
                            style={{ marginTop: "15px" }}
                        >
                            Exposed ports
                        </label>
                        <ObjectMap id="port-map" ref={this.portMapRef} />
                        <label
                            className="control-label"
                            style={{ marginTop: "15px" }}
                        >
                            Volume mappings
                        </label>
                        <ObjectMap id="volume-map" ref={this.volMapRef} />
                    </div>
                </form>
            </Modal>
        );
    }
}
