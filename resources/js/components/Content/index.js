import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import User from "../User/UserContainer";
import Dashboard from "../Dashboard";
import Shop from "../Shop";
import Machine from "../Machine";
import GlassTable from "../GlassTable";
import ReportTable from "../ReportTable";
import Profile from "../Profile";

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
        return (
            <Router>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/user">
                    <User />
                </Route>
                <Route path="/shop">
                    <Shop {...this.props} />
                </Route>
                <Route path="/machine">
                    <Machine />
                </Route>
                <Route path="/glass">
                    <GlassTable />
                </Route>
                <Route path="/report">
                    <ReportTable title="Report Glass" />
                </Route>
                <Route path="/profile/:id" component={Profile} />
                {/* <Route path="/water">Water</Route> */}
            </Router>
        );
    }
}

export default ContentRoute;
