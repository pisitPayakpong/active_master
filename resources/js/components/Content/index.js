import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import User from "../User/UserContainer";
import Dashboard from "../Dashboard";

class ContentRoute extends Component {
    state = {
        collapsed: false,
        isLogin: false
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    render() {
        const { isLogin } = this.state;
        return (
            <Router>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/user">
                    <User />
                </Route>
                <Route path="/water">Water</Route>
            </Router>
        );
    }
}

export default ContentRoute;
