// Modules
import * as React from "react";
import { ChangeEvent, SyntheticEvent } from "react";
import { Button, Input } from "antd";
import { MinusCircle, Plus } from "react-feather";
import KeyValueMsg from "../translations/key-value.msg";

export const isValidKeyChar = (c: string) => /^[a-zA-Z0-9-_]+$/.test(c);

/**
 * Map component where you can assiociate keys with texts or files.
 *
 * KeyValueEditor uses [WebStorage](#webstorage)'s properties
 * which are accessible at the root component of your service.
 *
 * Taken from https://github.com/amalto/platform6-ui-components
 * Licensed Under MIT License
 */
export interface KeyValDef {
    [key: string]: {
        contentType: string;
        contentBytes: string;
    };
}

export interface KeyValStoreDef {
    [idx: string]: {
        key: string;
        contentType: string;
        contentBytes: string;
    };
}

export interface KeyValueEditorProps
    extends React.ClassAttributes<KeyValueEditor> {
    /** Handle values changes. More details on [KeyValDef](#keyvaldef). */
    handleChange: (keyValues: KeyValDef) => void;
    /** Current keyValues data. */
    keyValues: KeyValDef;
    /**
     * Language to use on the component. e.g: <span className='quote'>en-US</span>.
     * Locales available at [Locale](#locale).
     * Accessible via [WebStorage](#webstorage).
     */
    locale: string;
    /** Whether or not the editor is active. */
    readonly?: boolean;

    /** Hide props from documentation */

    /** @ignore */
    children?: React.ReactNode;
    /** @ignore */
    key?: React.ReactText;
    /** @ignore */
    ref?: React.Ref<KeyValueEditor>;
}

export interface KeyValueEditorState {
    wordings?: { [key: string]: string };
}

export class KeyValueEditor extends React.Component<
    KeyValueEditorProps,
    KeyValueEditorState
> {
    constructor(props: KeyValueEditorProps) {
        super(props);
    }

    render() {
        const { readonly } = this.props;

        const keyValueStore = this.getKeyValueStore(this.props.keyValues);

        const inputs = Object.keys(keyValueStore).map((idx) => {
            const keyVal = keyValueStore[idx];

            return (
                <div className="row" key={idx}>
                    {!readonly ? (
                        <div
                            className="form-group col-xs-2 text-center"
                            style={{ paddingRight: 0 }}
                        >
                            <MinusCircle
                                className="danger-color control-align click-pointer"
                                data-key={keyVal.key}
                                onClick={this.removeKeyValue}
                            />
                        </div>
                    ) : null}

                    <div className="form-group col-xs-5">
                        {
                            <Input
                                type="text"
                                className="form-control"
                                value={keyVal.key}
                                disabled={readonly}
                                onChange={this.handleKeyChange}
                                data-idx={idx}
                                placeholder={KeyValueMsg.messages().key}
                            />
                        }
                    </div>

                    <div className="form-group col-xs-5">
                        <Input.TextArea
                            className="form-control"
                            value={keyVal.contentBytes}
                            disabled={readonly}
                            onChange={this.handleValueChange}
                            data-key={keyVal.key}
                            placeholder={KeyValueMsg.messages().value}
                        />
                    </div>
                </div>
            );
        });

        return (
            <div>
                {inputs}

                {!readonly ? (
                    <div>
                        <Button
                            type="primary"
                            onClick={this.addKeyValue.bind(this)}
                            data-toggle="tooltip"
                            data-original-title={KeyValueMsg.messages().add}
                        >
                            <Plus />
                        </Button>
                    </div>
                ) : null}
            </div>
        );
    }

    private addKeyValue = (file?: boolean) => {
        const keyValueStore = this.getKeyValueStore(this.props.keyValues);

        const idx = Object.keys(keyValueStore).length;

        keyValueStore[(idx + 1).toString()] = {
            key: "",
            contentType:
                file === true ? "application/octet-stream" : "text/plain",
            contentBytes: "",
        };

        this.props.handleChange(this.getKeyValuesObject(keyValueStore));
    };

    private removeKeyValue = (event: SyntheticEvent<SVGElement>) => {
        const keyValuesUpdate: KeyValDef = JSON.parse(
            JSON.stringify(this.props.keyValues)
        );
        const key: string = event.currentTarget.getAttribute("data-key");

        delete keyValuesUpdate[key];

        this.props.handleChange(keyValuesUpdate);
    };

    private handleKeyChange = (event: SyntheticEvent<HTMLInputElement>) => {
        if (
            isValidKeyChar(event.currentTarget.value) ||
            !event.currentTarget.value
        ) {
            const idx = event.currentTarget.getAttribute("data-idx");
            const keyValueStore = this.getKeyValueStore(this.props.keyValues);

            keyValueStore[idx] = {
                key: event.currentTarget.value,
                contentType: keyValueStore[idx].contentType,
                contentBytes: keyValueStore[idx].contentBytes,
            };

            this.props.handleChange(this.getKeyValuesObject(keyValueStore));
        }
    };

    private handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const keyValuesUpdate: KeyValDef = JSON.parse(
            JSON.stringify(this.props.keyValues)
        );
        const key: string = event.currentTarget.getAttribute("data-key");

        keyValuesUpdate[key].contentBytes = event.target.value;

        this.props.handleChange(keyValuesUpdate);
    };

    private getKeyValueStore = (keyValues: KeyValDef): KeyValStoreDef => {
        const kvStore = {} as KeyValStoreDef;
        let i = 0;

        for (const key in keyValues) {
            i++;
            if (!keyValues.hasOwnProperty(key)) continue;
            kvStore[i] = {
                key: key,
                contentType: keyValues[key].contentType,
                contentBytes: keyValues[key].contentBytes,
            };
        }

        return kvStore;
    };

    private getKeyValuesObject = (keyValueStore: KeyValStoreDef): KeyValDef => {
        const keyValues = {} as KeyValDef;

        for (const idx in keyValueStore) {
            if (!keyValueStore.hasOwnProperty(idx)) continue;
            const keyVal = keyValueStore[idx];

            keyValues[keyVal.key] = {
                contentType: keyVal.contentType,
                contentBytes: keyVal.contentBytes,
            };
        }

        return keyValues;
    };
}
