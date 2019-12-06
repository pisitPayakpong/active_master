import React, { Component } from "react";
import { Layout, Breadcrumb } from "antd";
import Cookies from "js-cookie";

import Header from "../Header";
import Menu from "../Menu";
import ContentRoute from "../Content";
import FormLogin from "../FormLogin";

class NavBar extends Component {
    state = {
        collapsed: false,
        jwt_token: Cookies.get("JWT_TOKEN")
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    render() {
        if (!this.state.jwt_token) {
            window.location = "/logout";
        }

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
