import React from "react";
import classNames from "classnames";
import * as io from "socket.io-client";
import { Button, Card, message } from "antd";
import { prompt } from "./prompt";
import Modal from "./modal";

const socket = io.connect();

export interface Container {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
}

export class ContainerListItem extends React.Component<
    Container,
    Record<string, unknown>
> {
   private removeModalRef: React.RefObject<Modal>;

   constructor(props:Container) {
       super();
   }

    onActionButtonClick() {
        const evt = this.isRunning() ? "container.stop" : "container.start";
        socket.emit(evt, { id: this.props.id });
    }

    onRemoveBtnClicked() {
        const evt = "container.rm";
        socket.emit(evt, { id: this.props.id });
    }

    isRunning() {
        return this.props.state === "running";
    }

    render() {
        const panelClass = this.isRunning() ? "success" : "default";
        const classes = classNames("panel", `panel-${panelClass}`);
        const buttonText = this.isRunning() ? "Stop" : "Start";

        return (
            <div className="col-sm-3">
                <Card className={classes} title={this.props.name}>
                    <div className="panel-body">
                        Status: {this.props.status}
                        <br />
                        Image: {this.props.image}
                    </div>
                    <div className="panel-footer">
                        <Button
                            type={"primary"}
                            onClick={this.onActionButtonClick.bind(this)}
                            className="btn btn-default"
                        >
                            {buttonText}
                        </Button>
                        <Button
                            type={"primary"}
                            danger={true}
                            onClick={this.onRemoveBtnClicked.bind(this)}
                            className="btn btn-default"
                        >
                            Remove
                        </Button>
                    </div>
                </Card>
                <Modal
                    buttonText="Remove"
                    title="Are you sure you want to remove this container?"
                    ref={this.props.removeModalRef}
                    onButtonClicked={this.removeContainer.bind(this)}
                >
            </div>
        );
    }
}
