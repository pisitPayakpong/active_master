import React, { Component } from "react";
import { Button } from "antd";
import axios from "axios";

import TableConfig from "../UserTable";
import FormUser from "../FormUser";
import Layout from "../Core/LayoutContent";
import FormChangePassword from "../FormChangePassword";

import { openNotification } from "../Core/utils";

class UserContainer extends Component {
    state = {
        collapsed: false,
        step: "list", // list, form,
        dataSource: {
            user: "",
            provinces: []
        }
    };

    componentDidMount() {
        this.handleFetchProvinces();
    }

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

    handleFetchUser = userId => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/user/${userId}`,
            method: "get",
            data: {
                results: 10
            },
            type: "json"
        }).then(data => {
            this.setState({
                loading: false,
                dataSource: { ...this.state.dataSource, user: data?.data }
            });
        });
    };

    handleDeleteUser = userId => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/user/${userId}`,
            method: "delete",
            type: "json"
        })
            .then(data => {
                openNotification();
                this.setState({
                    loading: false
                });
            })
            .catch(e => {
                openNotification(false, e?.response?.statusText);
            });
    };

    handleFetchProvinces = () => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/province/as_options`,
            method: "get",
            type: "json"
        }).then(data => {
            this.setState({
                loading: false,
                dataSource: { ...this.state.dataSource, provinces: data?.data }
            });
        });
    };

    render() {
        const {
            step,
            dataSource: { user, provinces }
        } = this.state;

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
                                onClick={() => this.handleSetStep("formCreate")}
                            >
                                Create User
                            </Button>
                        </Layout>
                        <TableConfig
                            handleSetStep={this.handleSetStep}
                            handleFetchUser={this.handleFetchUser}
                            handleDeleteUser={this.handleDeleteUser}
                        />
                    </>
                )}
                {step === "formCreate" && (
                    <FormUser
                        handleSetStep={this.handleSetStep}
                        mode="create"
                        provinces={provinces}
                    />
                )}
                {step === "formEdit" && (
                    <FormUser
                        handleSetStep={this.handleSetStep}
                        mode="edit"
                        data={user?.data}
                        provinces={provinces}
                    />
                )}
                {step === "formChangePassword" && (
                    <FormChangePassword
                        handleSetStep={this.handleSetStep}
                        data={user?.data}
                    />
                )}
            </>
        );
    }
}

export default UserContainer;
