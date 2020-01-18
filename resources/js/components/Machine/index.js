import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Row, Col } from "antd";
import axios from "axios";

import TableConfig from "../MachineTable";
import FormMachine from "../FormMachine";
import Layout from "../Core/LayoutContent";
import SelectorOption from "../Core/Selector";

import { openNotification } from "../Core/utils";
import { fetchCurrentUser } from "../User/duck/user";

const ADMIN = "admin";

class Machine extends Component {
    state = {
        collapsed: false,
        step: "list", // list, form,
        data: [],
        options: [],
        shops: [],
        shopId: null
    };

    componentDidMount() {
        const { fetchCurrentUser } = this.props;
        this.fetchOptionType();
        this.handleFetchShops();
        fetchCurrentUser();
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

    fetchOptionType = () => {
        axios({
            url: "/api/test_v1/machine/as_options",
            method: "get",
            data: {
                results: 10
            },
            type: "json"
        }).then(data => {
            this.setState({
                loading: false,
                options: data?.data
            });
        });
    };

    handleFetchValue = id => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/machine/${id}`,
            method: "get",
            data: {
                results: 10
            },
            type: "json"
        }).then(data => {
            this.setState({
                loading: false,
                data: data?.data
            });
        });
    };

    handleDelete = id => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/machine/${id}`,
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

    handleFetchShops = () => {
        axios({
            url: "/api/test_v1/shop/as_options",
            method: "get",
            data: {
                results: 10
            },
            type: "json"
        }).then(data => {
            this.setState({
                loading: false,
                shops: data?.data
            });
        });
    };

    handleSetShopId = shopId => {
        this.setState({
            shopId: shopId
        });
    };

    render() {
        const {
            user: { currentUser }
        } = this.props;
        const { step, data, options, shops, shopId } = this.state;

        return (
            <>
                {step === "list" && (
                    <>
                        <Layout minHeight="50px" padding="15px 30px">
                            <Row>
                                <Col span={16} style={{ textAlign: "left" }}>
                                    <SelectorOption
                                        value={shopId}
                                        data={shops?.data}
                                        onChange={this.handleSetShopId}
                                    />
                                </Col>
                                <Col span={8} style={{ textAlign: "right" }}>
                                    {currentUser?.role === ADMIN && (
                                        <Button
                                            type="primary"
                                            onClick={() =>
                                                this.handleSetStep("formCreate")
                                            }
                                        >
                                            Create Machine
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Layout>
                        {shopId && (
                            <TableConfig
                                currentUser={currentUser}
                                shopId={shopId}
                                handleSetStep={this.handleSetStep}
                                handleFetchValue={this.handleFetchValue}
                                handleDelete={this.handleDelete}
                            />
                        )}
                    </>
                )}
                {step === "formCreate" && (
                    <FormMachine
                        handleSetStep={this.handleSetStep}
                        mode="create"
                        options={options}
                        shops={shops}
                        shopId={shopId}
                    />
                )}
                {step === "formEdit" && (
                    <FormMachine
                        handleSetStep={this.handleSetStep}
                        mode="edit"
                        options={options}
                        shops={shops}
                        shopId={shopId}
                        {...data}
                    />
                )}
            </>
        );
    }
}

const mapStateToProps = ({ user }) => {
    return { user };
};

export default connect(mapStateToProps, { fetchCurrentUser })(Machine);
