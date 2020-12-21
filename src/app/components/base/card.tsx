import React, { StyleHTMLAttributes } from "react";
import { Card, CardProps, Heading } from "rebass/styled-components";

export const ThemedCard = (
    props: {
        title: string;
    } & CardProps &
        StyleHTMLAttributes<HTMLDivElement>
) => (
    <Card bg={"#444444"} {...props}>
        <Heading fontSize={[5, 6, 7]}>{props.title}</Heading>
        <div className={"card-body"}>{props.children}</div>
    </Card>
);
