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
            <Menu
                // theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["2"]}
                style={{
                    lineHeight: "64px",
                    textAlign: "right",
                    padding: "0px 20px"
                }}
            >
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                >
                    <a href="/logout">Logout</a>
                </Button>
            </Menu>
        );
    }
}

export default App;
