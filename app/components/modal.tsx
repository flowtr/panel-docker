import * as React from "react";
import { Button, Modal as AntdModal, Space } from "antd";
import Draggable from "react-draggable";

export interface ModalProperties {
    title: string;
    buttonText?: string;
    onButtonClicked?: () => boolean | undefined;
}

export interface ModalState {
    visible: boolean;
    disabled: boolean;
}

export default class Modal extends React.Component<
    ModalProperties,
    ModalState
> {
    constructor(props: ModalProperties) {
        super(props);
        this.state = {
            visible: false,
            disabled: false,
        };
    }

    toggleModal = () => {
        this.setState((prev) => ({
            visible: !prev.visible,
        }));
    };

    onPrimaryButtonClick() {
        if (this.props.onButtonClicked)
            if (this.props.onButtonClicked() !== false) this.toggleModal();
    }

    render() {
        return (
            <AntdModal
                visible={this.state.visible}
                centered={true}
                bodyStyle={{ width: "100%", height: "300px" }}
                title={
                    <div
                        style={{
                            width: "100%",
                            cursor: "move",
                        }}
                        onMouseOver={() => {
                            if (this.state.disabled)
                                this.setState({
                                    disabled: false,
                                });
                        }}
                        onMouseOut={() => {
                            this.setState({
                                disabled: true,
                            });
                        }}
                    >
                        {this.props.title}
                    </div>
                }
                closable={true}
                onCancel={this.toggleModal}
                modalRender={(modal) => (
                    <Draggable disabled={this.state.disabled}>
                        {modal}
                    </Draggable>
                )}
                footer={[
                    <Button
                        type="primary"
                        onClick={this.onPrimaryButtonClick.bind(this)}
                        className="btn btn-primary"
                    >
                        {this.props.buttonText || "Ok"}
                    </Button>,
                ]}
            >
                {this.props.children}
            </AntdModal>
        );
    }
}
