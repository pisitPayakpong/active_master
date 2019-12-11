import React, { Component } from "react";
import TableConfig from "../Table";
import CardComponent from "../Card";

class DashboardContainer extends Component {
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

export default DashboardContainer;
