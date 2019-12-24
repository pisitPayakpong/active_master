import React, { Component } from "react";
import { Button } from "antd";
import axios from "axios";

import TableConfig from "../MachineTable";
import FormMachine from "../FormMachine";
import Layout from "../Core/LayoutContent";

import { openNotification } from "../Core/utils";

class Machine extends Component {
    state = {
        collapsed: false,
        step: "list", // list, form,
        data: [],
        options: []
    };

    componentDidMount() {
        this.fetchOptionType();
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

    render() {
        const { step, data, options } = this.state;

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
                                Create Machine
                            </Button>
                        </Layout>
                        <TableConfig
                            handleSetStep={this.handleSetStep}
                            handleFetchValue={this.handleFetchValue}
                            handleDelete={this.handleDelete}
                        />
                    </>
                )}
                {step === "formCreate" && (
                    <FormMachine
                        handleSetStep={this.handleSetStep}
                        mode="create"
                        options={options}
                    />
                )}
                {step === "formEdit" && (
                    <FormMachine
                        handleSetStep={this.handleSetStep}
                        mode="edit"
                        options={options}
                        {...data}
                    />
                )}
            </>
        );
    }
}

export default Machine;
