import * as React from "react";
import Modal from "./modal";
import * as classNames from "classnames";
import { SyntheticEvent } from "react";
import { Button, Col, Input, Row } from "antd";
import { ObjectMapInput } from "./object-map-input";
import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

export interface ObjectMapState {
    obj: Record<string, string>;
    inputs: string[];
}

/**
 * Used for environment variable input
 */
export class ObjectMap extends React.Component<
    Record<string, unknown>,
    ObjectMapState
> {
    constructor(props: Record<string, unknown>) {
        super(props);

        this.state = {
            obj: {},
            inputs: ["input-0"],
        };
    }

    onPropertyChange({ value, name }: { value: string; name: string }) {
        this.setState((prev) => ({
            obj: { ...prev.obj, [name]: value },
        }));
    }

    render() {
        return (
            <div>
                {Object.values(this.state.inputs).map((input) => (
                    <Row className={"object-map-input"} key={input} id={input}>
                        <ObjectMapInput
                            onChange={this.onPropertyChange.bind(this)}
                            placeholder={"Environment variable"}
                        />
                        <Button
                            onClick={() => this.clear()}
                            style={{ display: "inline-flex" }}
                        >
                            <CloseCircleOutlined />
                        </Button>
                    </Row>
                ))}
                <Button
                    style={{ marginTop: "15px" }}
                    onClick={() => this.appendInput()}
                >
                    <PlusCircleOutlined />
                </Button>
            </div>
        );
    }

    appendInput() {
        const newInput = `input-${Object.keys(this.state.obj).length}`;
        this.setState((prevState) => ({
            inputs: prevState.inputs.concat([newInput]),
        }));
    }

    private clear() {
        this.setState((prevState) => ({
            inputs: [],
            obj: {},
        }));
        this.forceUpdate(() => null);
    }
}
