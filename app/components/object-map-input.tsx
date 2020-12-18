import * as React from "react";
import { createRef, StyleHTMLAttributes, SyntheticEvent } from "react";
import { Col, Input, Row } from "antd";

export interface ObjectMapInputProps {
    onChange: ({ name, value }: { name: string; value: string }) => unknown;
}

export class ObjectMapInput extends React.Component<
    Partial<StyleHTMLAttributes<HTMLInputElement>> & ObjectMapInputProps,
    Record<string, unknown>
> {
    valueRef: React.RefObject<Input>;

    constructor(
        props: Partial<StyleHTMLAttributes<HTMLInputElement>> &
            ObjectMapInputProps
    ) {
        super(props);
        this.valueRef = createRef();
    }

    onPropertyChange(e: SyntheticEvent<{ value: string }>) {
        const name = e.currentTarget.value;
        const value = this.valueRef.current.state.value;
        this.props.onChange({ name, value });
    }

    render() {
        return (
            <div>
                <Input
                    type="text"
                    className="form-control"
                    onChange={this.onPropertyChange.bind(this)}
                    style={{ width: "50%", display: "inline-flex" }}
                    placeholder={`${this.props.placeholder} name`}
                />
                <Input
                    type="text"
                    className="form-control"
                    style={{ width: "50%", display: "inline-flex" }}
                    ref={this.valueRef}
                    placeholder={`${this.props.placeholder} value`}
                />
            </div>
        );
    }
}
