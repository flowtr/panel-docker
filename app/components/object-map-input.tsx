import * as React from "react";
import { StyleHTMLAttributes, SyntheticEvent } from "react";
import { Input } from "antd";

export interface ObjectMapInputProps {
    onChange: ({ name, value }: { name: string; value: string }) => unknown;
}

export class ObjectMapInput extends React.Component<
    Partial<StyleHTMLAttributes<HTMLInputElement>> & ObjectMapInputProps,
    Record<string, unknown>
> {
    private valueRef: React.RefObject<Input>;

    onPropertyChange(e: SyntheticEvent<{ value: string }>) {
        const name = e.currentTarget.value;
        const value = this.valueRef.current.input.value;
        this.props.onChange({ name, value });
    }

    render() {
        return (
            <Input
                type="text"
                className="form-control"
                onChange={this.onPropertyChange.bind(this)}
                placeholder={this.props.placeholder}
            />
        );
    }
}
