import React, { Component } from "react";
import { Button } from "antd";

import TableConfig from "../UserTable";
import FormUser from "../FormUser";

class UserContainer extends Component {
    state = {
        collapsed: false,
        step: "list" // list, form
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    handleSetStep = value => {
        this.setState({
            step: value
        });
    };

    render() {
        const { step } = this.state;
        return (
            <>
                {step === "list" && (
                    <>
                        <Button
                            type="primary"
                            style={{ marginBottom: 16 }}
                            onClick={() => this.handleSetStep("form")}
                        >
                            Create User
                        </Button>
                        <TableConfig />
                    </>
                )}
                {step === "form" && (
                    <FormUser handleSetStep={this.handleSetStep} />
                )}
            </>
        );
    }
}

export default UserContainer;
