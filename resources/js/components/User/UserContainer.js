import React, { Component } from "react";

import TableConfig from "../Table";

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
                <TableConfig />
            </>
        );
    }
}

export default UserContainer;
