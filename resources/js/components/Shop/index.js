import React, { Component } from "react";
import { Button } from "antd";
import axios from "axios";

import ShopTable from "../ShopTable";
import FormShop from "../FormShop";
import Layout from "../Core/LayoutContent";

import { openNotification } from "../Core/utils";

const ADMIN = "admin";

class ShopContainer extends Component {
    state = {
        collapsed: false,
        step: "list", // list, form,
        dataSource: {
            shop: ""
        },
        userOptions: []
    };

    componentDidMount() {
        this.fetchOptionUsers();
    }

    fetchOptionUsers = () => {
        axios({
            url: `/api/test_v1/user/as_options`,
            method: "get",

            type: "json"
        }).then(data => {
            this.setState({
                loading: false,
                userOptions: data?.data?.data
            });
        });
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

    handleFetchValue = userId => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/shop/${userId}`,
            method: "get",
            data: {
                results: 10
            },
            type: "json"
        }).then(data => {
            this.setState({
                loading: false,
                dataSource: { shop: data?.data }
            });
        });
    };

    handleDelete = userId => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/shop/${userId}`,
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

    render() {
        const { role } = this.props;
        const {
            step,
            dataSource: { shop },
            userOptions
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
                            {role === ADMIN && (
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        this.handleSetStep("formCreate")
                                    }
                                >
                                    Create Shop
                                </Button>
                            )}
                        </Layout>
                        <ShopTable
                            handleSetStep={this.handleSetStep}
                            handleFetchValue={this.handleFetchValue}
                            handleDelete={this.handleDelete}
                        />
                    </>
                )}
                {step === "formCreate" && (
                    <FormShop
                        // currentUser={currentUser}
                        userOptions={userOptions}
                        handleSetStep={this.handleSetStep}
                        mode="create"
                        role={role}
                    />
                )}
                {step === "formEdit" && (
                    <FormShop
                        // currentUser={currentUser}
                        userOptions={userOptions}
                        handleSetStep={this.handleSetStep}
                        mode="edit"
                        data={shop?.data}
                        role={role}
                    />
                )}
            </>
        );
    }
}

export default ShopContainer;
