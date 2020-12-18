import * as React from "react";
import Modal from "./modal";
import * as classNames from "classnames";
import { SyntheticEvent } from "react";
import { Input } from "antd";
import { ObjectMapInput } from "./object-map-input";

export interface ObjectMapState {
    obj: Record<string, string>;
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
        };
    }

    onPropertyChange({ value, name }: { value: string; name: string }) {
        this.setState((prev) => ({
            obj: { ...prev.obj, [name]: value },
        }));
    }

    render() {
        return (
            <div className="col-sm-9">
                <ObjectMapInput
                    onChange={this.onPropertyChange.bind(this)}
                    id="imageName"
                    placeholder="e.g mongodb:latest"
                />
            </div>
        );
    }
}
