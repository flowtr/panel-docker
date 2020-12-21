import React from "react";
import Modal from "./modal";
import * as classNames from "classnames";
import { Button, Col, Input, Row } from "antd";
import { ObjectMapInput } from "./object-map-input";
import { XCircle, PlusCircle } from "react-feather";
import { KeyValDef, KeyValueEditor } from "./key-value-editor";

export interface ObjectMapState {
    keyValues: KeyValDef;
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
            keyValues: {},
            inputs: [],
        };
    }

    handleChange(keyValues: KeyValDef) {
        this.setState({ keyValues });
    }

    render() {
        return (
            <Row className={"object-map-input"}>
                <KeyValueEditor
                    handleChange={this.handleChange.bind(this)}
                    keyValues={this.state.keyValues}
                    locale="en-US"
                />
            </Row>
        );
    }
}
