import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import axios from "axios";

import ShopTable from "../ShopTable";
import FormShop from "../FormShop";
import Layout from "../Core/LayoutContent";

import { openNotification } from "../Core/utils";
import { fetchCurrentUser, fetchOptionUsers } from "../User/duck/user";

const ADMIN = "admin";

class ShopContainer extends Component {
    state = {
        collapsed: false,
        step: "list", // list, form,
        dataSource: {
            shop: ""
        }
    };

    componentDidMount() {
        const { fetchCurrentUser, fetchOptionUsers } = this.props;
        fetchCurrentUser();
        fetchOptionUsers();
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
            user: { currentUser, userOptions }
        } = this.props;
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
                            {currentUser?.role === ADMIN && (
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
                        currentUser={currentUser}
                        userOptions={userOptions}
                        handleSetStep={this.handleSetStep}
                        mode="create"
                    />
                )}
                {step === "formEdit" && (
                    <FormShop
                        currentUser={currentUser}
                        userOptions={userOptions}
                        handleSetStep={this.handleSetStep}
                        mode="edit"
                        data={shop?.data}
                    />
                )}
            </>
        );
    }
}

const mapStateToProps = ({ user }) => {
    return { user };
};

export default connect(mapStateToProps, { fetchCurrentUser, fetchOptionUsers })(
    ShopContainer
);
