import React, { Component } from "react";
import { Table, Avatar } from "antd";
import axios from "axios";
import { map, toString } from "lodash";
import styled from "styled-components";

import LayoutContent from "../Core/LayoutContent";
import Modal from "../Core/Modal";

const DivTitle = styled.div`
    font-size: 22px;
    text-align: left;
    padding: 10px 5px;
`;

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
            // sortOrder: sorter.order,
            ...filters
        });
    };

    getSymbolOrder = sortOrder => {
        return sortOrder === "ascend" ? "-" : "";
    };

    fetchData = (params = {}) => {
        this.setState({ loading: true });
        axios({
            url: "/api/test_v1/glass",
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
                    total: total,
                    showSizeChanger: true   
                }
            });
        });
    };

    // addDefaultSrc(ev) {
    //     // ev.target.src = "http://43.229.149.50/h2o/images/customer.png";
    // }

    renderImage = src => {
        let url;

        if (src !== "") {
            url = `http://43.229.149.50/h2o/images/${src}`;
        } else {
            url = `http://43.229.149.50/h2o/images/customer.png`;
        }

        return (
            <Avatar
                shape="square"
                size={64}
                src={url}
                // onError={this.addDefaultSrc}
            />
        );
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
                sorter: true
            },
            {
                title: "sn",
                dataIndex: "sn",
                sorter: true
            },
            {
                title: "image",
                dataIndex: "image",
                render: image => this.renderImage(image)
            },
            {
                title: "user",
                dataIndex: "user",
                sorter: true
            },
            {
                title: "date",
                dataIndex: "date",
                sorter: true
            },
            {
                title: "o3 usage",
                dataIndex: "o3_usage",
                sorter: true
            },
            {
                title: "h2 usage",
                dataIndex: "h2_usage",
                sorter: true
            },
            {
                title: "price",
                dataIndex: "price",
                sorter: true
            },
            {
                title: "Action",
                render: () => <Modal />
            }
        ];

        return (
            <LayoutContent>
                <DivTitle>Glass</DivTitle>
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
