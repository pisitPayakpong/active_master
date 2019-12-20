import React, { Component } from "react";
import { Table } from "antd";
import axios from "axios";
import { map, filter, toString } from "lodash";

import LayoutContent from "../Core/LayoutContent";
import Modal from "../Core/Modal";
import SimpleMap from "../Map/SimpleMap";

const optionRole = [
    { text: "Super Admin", value: "super_admin" },
    { text: "Admin", value: "admin" },
    { text: "Vistor", value: "visitor" }
];

const transfromRole = key => {
    return filter(optionRole, role => {
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
                width: "40%"
            },
            // {
            //     title: "lat",
            //     dataIndex: "lat",
            //     filters: optionRole,
            //     width: "20%",
            //     render: value => {
            //         return transfromRole(value)?.text;
            //     }
            // },
            // {
            //     title: "lng",
            //     dataIndex: "lng",
            //     filters: optionRole,
            //     width: "20%",
            //     render: value => {
            //         return transfromRole(value)?.text;
            //     }
            // },
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
                width: "40%"
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
