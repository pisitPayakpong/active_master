import React, { Component } from "react";
import { Table, Button, Layout } from "antd";
import axios from "axios";
import { map, filter, toString } from "lodash";

import LayoutContent from "../Core/LayoutContent";
import Modal from "../Core/Modal";
import SimpleMap from "../Map/SimpleMap";

class App extends Component {
    state = {
        data: [],
        pagination: {},
        loading: false
    };

    componentDidMount() {
        this.fetchData();
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });

        this.fetchData({
            results: pagination.pageSize,
            page: pagination.current,
            sort: `${this.getSymbolOrder(sorter.order)}${sorter.field}`,
            ...filters
        });
    };

    getSymbolOrder = sortOrder => {
        return sortOrder === "ascend" ? "-" : "";
    };

    fetchData = (params = {}) => {
        this.setState({ loading: true });
        axios({
            url: "/api/test_v1/shop",
            method: "get",
            data: {
                results: 10
            },
            params: {
                ...params,
                role: toString(params?.role),
                sortOrder: params?.sortOrder === "ascend" ? "asc" : "desc"
            },
            type: "json"
        }).then(data => {
            const pagination = { ...this.state.pagination };
            // Read total count from server
            // pagination.total = data.totalCount;

            const { current_page, total } = data?.data?.meta?.pagination;

            pagination.total = 200;
            this.setState({
                loading: false,
                data: data?.data,
                pagination: {
                    current: current_page,
                    total: total
                }
            });
        });
    };

    transformData = data => {
        return map(data?.data, d => d);
    };

    render() {
        const { handleSetStep, handleFetchValue, handleDelete } = this.props;
        const { data, loading, pagination } = this.state;

        const columns = [
            {
                title: "id",
                dataIndex: "id",
                sorter: true,
                width: "10%"
            },
            {
                title: "Name",
                dataIndex: "name",
                sorter: true,
                render: name => name,
                width: "20%"
            },
            {
                title: "Manager",
                dataIndex: "user_name",
                width: "20%",
                sorter: true
            },
            {
                title: "Map",
                render: row => {
                    return (
                        <Modal
                            width="850px"
                            renderContents={() => <SimpleMap data={row} />}
                        />
                    );
                },
                width: "20%"
            },
            {
                title: "Action",
                width: "20%",
                render: (value, record) => {
                    return (
                        <>
                            <Button
                                onClick={() => {
                                    handleSetStep("formEdit");
                                    handleFetchValue(record?.id);
                                }}
                                style={{ marginRight: 5 }}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => {
                                    handleDelete(record?.id);
                                    this.fetchData();
                                }}
                                style={{
                                    backgroundColor: "#ff4d4f",
                                    color: "white"
                                }}
                            >
                                Delete
                            </Button>
                        </>
                    );
                }
            }
        ];

        return (
            <LayoutContent>
                <Table
                    columns={columns}
                    rowKey={record => {
                        return record.id;
                    }}
                    dataSource={this.transformData(data)}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.handleTableChange}
                />
            </LayoutContent>
        );
    }
}

export default App;
