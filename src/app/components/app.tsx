import React from "react";
import { Layout, Menu } from "antd";
import Title from "antd/lib/typography/Title";
import { StyleHTMLAttributes } from "react";

export const App = (props: StyleHTMLAttributes<HTMLDivElement>) => (
    <Layout className={"layout"}>
        <Layout.Header>
            <Title
                className="page-title"
                style={{ float: "left", width: " 25%" }}
            >
                Docker Dashboard
            </Title>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1">Home</Menu.Item>
            </Menu>
        </Layout.Header>
        <Layout.Content style={{ padding: "0 50px" }}>
            {props.children}
        </Layout.Content>
    </Layout>
);
