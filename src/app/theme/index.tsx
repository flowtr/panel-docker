import "./theme.scss";
import { extendTheme } from "@chakra-ui/react";
import components from "./components";

export const theme = extendTheme({
    colors: {
        secondaryBackground: "#4d4d4d",
        background: "#121212",
    },
    styles: {
        global: {
            // styles for the `body`
            body: {
                bg: "#121212",
                color: "white",
                fontFamily: "Source Code Pro",
            },
            modal: {
                color: "white",
                fontFamily: "Source Code Pro",
            },
            a: {
                color: "teal.500",
                _hover: {
                    textDecoration: "underline",
                },
            },
        },
    },
});
