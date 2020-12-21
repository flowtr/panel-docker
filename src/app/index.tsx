import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/app";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { HomePage } from "./pages/home";

ReactDOM.render(
    <App>
        <Router basename={"panel"}>
            <Route path="/" component={HomePage} />
        </Router>
    </App>,
    document.getElementById("app")
);
