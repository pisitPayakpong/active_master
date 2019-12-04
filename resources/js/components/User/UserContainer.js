import React, { Component } from "react";
import { Layout } from "antd";

import TableConfig from "../Table";
import CardComponent from "../Card";

const { Content } = Layout;

class UserContainer extends Component {
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
            <>
                <CardComponent />
                <TableConfig />
            </>
        );
    }
}

export default UserContainer;
