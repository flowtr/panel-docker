import React, { ReactNode, StyleHTMLAttributes } from "react";
import {
    Box,
    BoxProps,
    Heading,
    Stack,
    StackDirection,
} from "@chakra-ui/react";

export const ThemedCard = (
    props: {
        cardTitle?: ReactNode;
        spacing?: string | number;
        direction?: StackDirection;
    } & BoxProps &
        StyleHTMLAttributes<HTMLDivElement>
) => (
    <Stack
        bg={"background"}
        spacing={props.spacing ? props.spacing : 4}
        direction={props.direction ?? "column"}
        {...props}
    >
        {typeof props.cardTitle === "string" ? (
            props.cardTitle
        ) : (
            <Heading bg={"background"}>{props.cardTitle}</Heading>
        )}
        <Box className={"card-body"} bg={"background"} p={5}>
            {props.children}
        </Box>
    </Stack>
);
