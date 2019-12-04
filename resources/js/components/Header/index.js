import React, { Component } from "react";
import { Button, Layout, Menu } from "antd";

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
        const { handleLogout } = this.props;
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
                    <Menu.Item key="3">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            onClick={() => {
                                handleLogout(true);
                            }}
                        >
                            Logout
                        </Button>
                    </Menu.Item>
                </Menu>
            </Header>
        );
    }
}

export default App;
