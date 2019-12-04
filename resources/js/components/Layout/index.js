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
        isLogin: Cookies.get("login")
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    handleLogin = () => {
        Cookies.set("login", true);
        this.setState({
            isLogin: true
        });
    };

    handleLogout = () => {
        Cookies.set("login", false);
        this.setState({
            isLogin: false
        });
    };

    render() {
        const { isLogin } = this.state;
        return !isLogin ? (
            <FormLogin handleLogin={this.handleLogin} />
        ) : (
            <div>
                <Layout>
                    <Header handleLogout={this.handleLogout} />
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
