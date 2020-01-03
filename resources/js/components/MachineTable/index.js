import React, { Component } from "react";
import { Table, Avatar, Button } from "antd";
import axios from "axios";
import { map, toString } from "lodash";
import styled from "styled-components";

import LayoutContent from "../Core/LayoutContent";
import Modal from "../Core/Modal";
import SimpleMap from "../Map/SimpleMap";
import { confirmModal } from "../Core/ModalConfirm";

const DivTitle = styled.div`
    font-size: 22px;
    text-align: left;
    padding: 10px 5px;
`;

class App extends Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        options: {}
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps?.shopId !== this.props.shopId) {
            this.fetchData();
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });

        const typeFilter = toString(filters?.type);

        this.fetchData({
            results: pagination.pageSize,
            page: pagination.current,
            sort: `${this.getSymbolOrder(sorter.order)}${sorter.field}`,
            type: typeFilter
        });
    };

    getSymbolOrder = sortOrder => {
        return sortOrder === "ascend" ? "-" : "";
    };

    fetchOption = () => {
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

    fetchData = (params = {}) => {
        const { shopId } = this.props;
        this.setState({ loading: true });
        axios({
            url: "/api/test_v1/machine",
            method: "get",
            data: {
                results: 10
            },
            params: {
                ...params,
                shopId: shopId,
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
        this.fetchOption();
    };

    renderImage = src => {
        let url;
        if (src !== "") {
            url = `http://43.229.149.50/machine/${src}`;
        } else {
            url = `http://unilife.co.th/~unilife/upload_images/upload_images/blank.jpg`;
        }

        return <Avatar shape="square" size={64} src={url} />;
    };

    transformData = data => {
        return map(data?.data, d => d);
    };

    renderStatus = status => {
        return (
            <Button
                type="primary"
                icon="poweroff"
                size="large"
                style={{
                    width: "100%",
                    backgroundColor: this.getColor(status),
                    border: "0px"
                }}
            >
                {status}
            </Button>
        );
    };

    getColor = status => {
        if (status === "READY") {
            return "#28a745";
        }

        if (status === "OFF") {
            return "#ff4d4f";
        }

        return;
    };

    render() {
        const { handleSetStep, handleFetchValue, handleDelete } = this.props;
        const { data, loading, pagination, options } = this.state;

        const columns = [
            {
                title: "Station",
                dataIndex: "tag",
                render: image => this.renderImage(image),
                width: "5%"
            },
            {
                title: "Serial Number",
                dataIndex: "sn",
                sorter: true,
                width: "15%"
            },
            {
                title: "Type",
                dataIndex: "type",
                filters: options?.data,
                width: "10%"
            },
            {
                title: "Machine ID",
                dataIndex: "machineId",
                sorter: true,
                width: "20%"
            },
            {
                title: "Status",
                dataIndex: "status",
                sorter: true,
                render: status => this.renderStatus(status),
                width: "10%"
            },
            {
                title: "Date Time",
                dataIndex: "dateTime",
                sorter: true,
                width: "10%"
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
                width: "10%"
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
                                    confirmModal({
                                        title: "Do you have delete item ?",
                                        callbackOk: () => {
                                            handleDelete(record?.id);
                                            this.fetchData();
                                        }
                                    });
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
                <DivTitle>Machine</DivTitle>
                <Table
                    columns={columns}
                    rowKey={record => {
                        return record.id;
                    }}
                    dataSource={this.transformData(data)}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.handleTableChange}
                    scroll={{ x: 1000, y: 1000 }}
                />
            </LayoutContent>
        );
    }
}

export default App;
