import React from "react";
import { ContainerListItem } from "./containerListItem";
import { ContainerData } from "../../common/types";
import { Stack } from "@chakra-ui/react";

export class ContainerListProps {
    containers: ContainerData[];
    title?: string;
}

export class ContainerList extends React.Component<
    ContainerListProps,
    Record<string, unknown>
> {
    render() {
        return (
            <Stack direction="column">
                <h3>{this.props.title}</h3>
                <p>
                    {this.props.containers.length == 0
                        ? "No containers to show"
                        : ""}
                </p>
                <Stack direction="row">
                    {this.props.containers.map((c) => (
                        <ContainerListItem key={c.name} {...c} />
                    ))}
                </Stack>
            </Stack>
        );
    }
}
