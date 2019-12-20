import React, { Component } from "react";
import { Button } from "antd";

import TableConfig from "../UserTable";
import FormUser from "../FormUser";
import Layout from "../Core/LayoutContent";

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
                        <Layout
                            minHeight="50px"
                            padding="15px 50px"
                            textAlign="right"
                        >
                            <Button
                                type="primary"
                                onClick={() => this.handleSetStep("form")}
                            >
                                Create User
                            </Button>
                        </Layout>
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
