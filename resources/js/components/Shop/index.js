import React, { Component } from "react";
import { Button } from "antd";
import axios from "axios";

import ShopTable from "../ShopTable";
import FormShop from "../FormShop";
import Layout from "../Core/LayoutContent";

import { openNotification } from "../Core/utils";

class ShopContainer extends Component {
    state = {
        collapsed: false,
        step: "list", // list, form,
        dataSource: {
            shop: ""
        }
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
        const {
            step,
            dataSource: { shop }
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
                                Create Shop
                            </Button>
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
                        handleSetStep={this.handleSetStep}
                        mode="create"
                    />
                )}
                {step === "formEdit" && (
                    <FormShop
                        handleSetStep={this.handleSetStep}
                        mode="edit"
                        data={shop?.data}
                    />
                )}
            </>
        );
    }
}

export default ShopContainer;
