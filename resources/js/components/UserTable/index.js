import React, { Component } from "react";
import { Table, Button, Avatar } from "antd";
import axios from "axios";
import { map, filter, toString } from "lodash";

import LayoutContent from "../Core/LayoutContent";
import { getOptionRole } from "../Core/utils";

const transfromRole = key => {
    return filter(getOptionRole(), role => {
        return role?.value === key;
    })[0];
};

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
            limit: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters
        });
    };

    fetchData = (params = {}) => {
        this.setState({ loading: true });
        axios({
            url: "/api/test_v1/user",
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

            const { current_page, total } = data?.data?.meta?.pagination;

            pagination.total = 200;
            this.setState({
                loading: false,
                data: data?.data,
                pagination: {
                    current: current_page,
                    total: total,
                    showSizeChanger: true
                }
            });
        });
    };

    transformData = data => {
        return map(data?.data, d => d);
    };

    render() {
        const { data, loading, pagination } = this.state;
        const { handleSetStep, handleFetchUser, handleDeleteUser } = this.props;

        const columns = [
            {
                title: "id",
                dataIndex: "id",
                sorter: true
            },
            {
                title: "Image",
                dataIndex: "image",
                render: image => {
                    return (
                        <Avatar
                            shape="square"
                            src={`${window.location.origin}/${image}`}
                            size={70}
                        />
                    );
                }
            },
            {
                title: "Name",
                dataIndex: "name",
                sorter: true,
                render: name => name,
                width: "20%"
            },
            {
                title: "Email Or Username",
                dataIndex: "email",
                sorter: true,
                render: name => name,
                width: "20%"
            },
            {
                title: "Role",
                dataIndex: "role",
                filters: getOptionRole(),
                width: "10%",
                render: value => {
                    return transfromRole(value)?.text;
                }
            },
            {
                title: "Action",
                width: "10%",
                render: (value, record) => {
                    return (
                        <>
                            <Button
                                onClick={() => {
                                    handleSetStep("formEdit");
                                    handleFetchUser(record?.id);
                                }}
                                style={{ marginRight: 5 }}
                            >
                                Edit
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    handleSetStep("formChangePassword");
                                    handleFetchUser(record?.id);
                                }}
                                style={{ marginRight: 5 }}
                            >
                                Change Password
                            </Button>
                            <Button
                                onClick={() => {
                                    handleDeleteUser(record?.id);
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
                    scroll={{ x: 1500 }}
                />
            </LayoutContent>
        );
    }
}

export default App;
