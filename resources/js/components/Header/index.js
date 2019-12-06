import React, { Component } from "react";
import { Button, Layout, Menu } from "antd";
import axios from "axios";

const { Header } = Layout;

class App extends Component {
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
            <Header className="header">
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["2"]}
                    style={{ lineHeight: "64px" }}
                >
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        <a href="/logout">Logout</a>
                    </Button>
                </Menu>
            </Header>
        );
    }
}

export default App;
