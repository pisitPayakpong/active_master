import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "antd";

import TableConfig from "../Table";

const { Content } = Layout;

class ContentRoute extends Component {
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
            <Router>
                <Content
                    style={{
                        background: "#fff",
                        padding: 24,
                        margin: 0,
                        minHeight: 280
                    }}
                >
                    <Route path="/user">
                        Table User
                        <TableConfig />
                    </Route>
                    <Route path="/water">Water</Route>
                </Content>
            </Router>
        );
    }
}

export default ContentRoute;
