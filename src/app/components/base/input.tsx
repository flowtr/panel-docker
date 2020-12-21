import { Input, InputProps } from "@chakra-ui/react";
import React from "react";

export interface BasicInputState {
    value: string;
}

export class BasicInput extends React.Component<InputProps, BasicInputState> {
    render() {
        return (
            <Input
                type="text"
                className="form-control"
                style={{ width: "50%", display: "inline-flex" }}
                value={this.state.value}
                onChange={(e) => {
                    this.setState({ value: e.target.value });
                }}
            />
        );
    }
}
