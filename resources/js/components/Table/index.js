import React, { Component } from "react";
import { Table } from "antd";
import axios from "axios";
import { map, toString } from "lodash";

import LayoutContent from "../Core/LayoutContent";

const columns = [
    {
        title: "id",
        dataIndex: "id",
        sorter: true
    },
    {
        title: "Name",
        dataIndex: "name",
        sorter: true,
        render: name => name,
        width: "40%"
    },
    {
        title: "Role",
        dataIndex: "role",
        filters: [
            { text: "Super Admin", value: "super_admin" },
            { text: "Admin", value: "admin" },
            { text: "Vistor", value: "vistor" }
        ],
        width: "40%"
    }
];

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
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters
        });
    };

    fetchData = (params = {}) => {
        this.setState({ loading: true });
        axios({
            url: "http://blog.test/api/test_v1/user",
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
        const { data, loading, pagination } = this.state;

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
