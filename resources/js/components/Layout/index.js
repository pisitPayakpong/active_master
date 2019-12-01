import React, { Component } from "react";
import { Layout, Breadcrumb } from "antd";

import Header from "../Header";
import Menu from "../Menu";
import ContentRoute from "../Content";

const { Content } = Layout;

class NavBar extends Component {
    state = {
        collapsed: false
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    render() {
        return (
            <div>
                <Layout>
                    <Header />
                    <Layout>
                        <Menu />
                        <Layout style={{ padding: "0 24px 24px" }}>
                            <Breadcrumb style={{ margin: "16px 0" }}>
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                <Breadcrumb.Item>List</Breadcrumb.Item>
                                <Breadcrumb.Item>App</Breadcrumb.Item>
                            </Breadcrumb>
                            <ContentRoute />
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default NavBar;
