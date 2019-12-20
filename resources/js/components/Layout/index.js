import React, { Component } from "react";
import { Layout, Breadcrumb } from "antd";
import Cookies from "js-cookie";
import axios from "axios";

import Header from "../Header";
import Menu from "./../Menu";
import ContentRoute from "../Content";
// import FormLogin from "../FormLogin";

const { Content } = Layout;

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
        const { collapsed } = this.state;
        if (!this.state.jwt_token) {
            window.location = "/logout";
        }

        axios.defaults.headers.common.Authorization = `Bearer ${Cookies.get(
            "JWT_TOKEN"
        )}`;

        return (
            <div style={{ height: "100%" }}>
                <Layout style={{ height: "-webkit-fill-available" }}>
                    <Menu
                        collapsed={collapsed}
                        toggleCollapsed={this.toggleCollapsed}
                    />
                    <Layout>
                        <Header
                            collapsed={collapsed}
                            toggleCollapsed={this.toggleCollapsed}
                        />
                        <Content style={{ padding: "0 24px 24px" }}>
                            <Breadcrumb style={{ margin: "16px 0" }}>
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                <Breadcrumb.Item>List</Breadcrumb.Item>
                                <Breadcrumb.Item>App</Breadcrumb.Item>
                            </Breadcrumb>
                            <ContentRoute />
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default NavBar;
