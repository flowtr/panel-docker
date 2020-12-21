import React from "react";
import { StyleHTMLAttributes } from "react";
import {
    ChakraProvider,
    Heading,
    Box,
    Flex,
    Link,
    Stack,
} from "@chakra-ui/react";

import { theme } from "../theme";

export const App = (props: StyleHTMLAttributes<HTMLDivElement>) => {
    return (
        <ChakraProvider theme={theme}>
            <div className={"layout"}>
                <Stack
                    direction="row"
                    px={25}
                    spacing={5}
                    className={"header"}
                    alignItems="center"
                    color="white"
                    bg="secondaryBackground"
                    style={{
                        height: "120px",
                        marginBottom: "25px",
                    }}
                >
                    <Heading className="page-title">Docker Dashboard</Heading>
                    <Box mx="auto" />
                    <Link variant="nav" href={"/panel"}>
                        Admin Dashboard
                    </Link>
                    <Link variant="nav" href={"/"}>
                        View Site
                    </Link>
                </Stack>
                <Flex className="content" p={"0 50px"}>
                    {props.children}
                </Flex>
            </div>
        </ChakraProvider>
    );
};
