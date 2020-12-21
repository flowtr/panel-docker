import React from "react";
import { BaseModal } from "./base/modal";
import classNames from "classnames";
import { createRef, SyntheticEvent } from "react";
import { ObjectMap } from "./object-map";
import { KeyValDef } from "../../common/types";
import { Flex, Input } from "@chakra-ui/react";

interface ModalProperties {
    modalRef: React.Ref<BaseModal>;
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
            <BaseModal
                buttonText="Run"
                title="Create a new container"
                width={300}
                height={200}
                ref={this.props.modalRef}
                onButtonClicked={this.runImage.bind(this)}
            >
                <form>
                    <div className={inputClass}>
                        <Flex>
                            {" "}
                            <label
                                htmlFor="deploymentName"
                                className="control-label"
                            >
                                Deployment name
                            </label>
                        </Flex>
                        <Flex>
                            <Input
                                type="text"
                                className="form-control"
                                onChange={this.onNameChange.bind(this)}
                                id="deploymentName"
                                placeholder="e.g my_deployment"
                            />
                        </Flex>
                        <Flex>
                            {" "}
                            <label
                                htmlFor="imageName"
                                className="control-label"
                            >
                                Image name
                            </label>
                        </Flex>
                        <Flex>
                            <Input
                                type="text"
                                className="form-control"
                                onChange={this.onImageNameChange.bind(this)}
                                id="imageName"
                                placeholder="e.g mongodb:latest"
                            />
                        </Flex>
                        <label
                            className="control-label"
                            style={{ marginTop: "15px" }}
                        >
                            Environment variables
                        </label>
                        <ObjectMap id="env-map" ref={this.envMapRef} />
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
            </BaseModal>
        );
    }
}
