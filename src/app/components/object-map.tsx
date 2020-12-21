import React from "react";
import { Flex } from "@chakra-ui/react";
import { KeyValueEditor } from "./key-value-editor";
import { KeyValDef } from "../../common/types";

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
            <Flex className={"object-map-input"}>
                <KeyValueEditor
                    handleChange={this.handleChange.bind(this)}
                    keyValues={this.state.keyValues}
                    locale="en-US"
                />
            </Flex>
        );
    }
}
