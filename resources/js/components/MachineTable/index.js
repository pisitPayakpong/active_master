import React, { Component } from "react";
import { Table, Avatar, Button } from "antd";
import axios from "axios";
import { map, toString, last } from "lodash";
import styled from "styled-components";
import moment from "moment";

import LayoutContent from "../Core/LayoutContent";
import UploadFile from "../Core/UploadFile";
import Modal from "../Core/Modal";
import SimpleMap from "../Map/SimpleMap";
import { confirmModal } from "../Core/ModalConfirm";
import { openNotification } from "../Core/utils";

const DivTitle = styled.div`
    font-size: 22px;
    text-align: left;
    padding: 10px 5px;
`;

const StyledButton = styled(Button)`
    margin-right: 5px;
`;

const VISITOR = "visitor";
const ADMIN = "admin";

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
            limit: pagination.pageSize,
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

    updateExpire = id => {
        axios({
            url: `/api/test_v1/machine/${id}/expire`,
            method: "put",
            type: "json"
        })
            .then(data => {})
            .catch(e => {
                openNotification(false, e?.response?.statusText);
            });
    };

    getColumnUploadFile = () => {
        const uploadBillconfig = {
            title: "Upload Bill",
            render: row => {
                return (
                    <Modal
                        textButton="Upload"
                        width="850px"
                        renderContents={() => (
                            <UploadFile
                                url="/api/test_v1/machine/bill"
                                params={{ machine_id: row?.id }}
                            />
                        )}
                    />
                );
            },
            width: "10%"
        };
        return uploadBillconfig;
    };

    extendMachine = record => {
        const { expire_date } = record;
        const currentDate = moment();
        let disabled = !moment(expire_date, "YYYY-MM-DD HH:mm:ss").isSame(
            currentDate
        );

        if (!expire_date) {
            disabled = false;
        }
        return disabled ? (
            <StyledButton type="primary" disabled={disabled}>
                Extend
            </StyledButton>
        ) : (
            <StyledButton
                onClick={() => {
                    confirmModal({
                        title: "Do you have Extend Machine ?",
                        callbackOk: () => {
                            // ajax
                            this.updateExpire(record?.id);
                            this.fetchData();
                        }
                    });
                }}
                style={{
                    backgroundColor: "#0b8235",
                    color: "white"
                }}
                disabled={disabled}
            >
                Extend
            </StyledButton>
        );
    };

    renderPathDownloadFile = () => {
        const pathFile = {
            title: "Bill",
            render: record => {
                const file = last(record?.bills);
                return (
                    <a target="_blank" href={`${file?.path}`} disabled={!file}>
                        Download
                    </a>
                );
            },
            width: "10%"
        };
        return pathFile;
    };

    render() {
        const {
            handleSetStep,
            handleFetchValue,
            handleDelete,
            currentUser: { role }
        } = this.props;
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
                width: "20%"
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
                width: "5%"
            },
            role === VISITOR ? this.getColumnUploadFile() : {},
            {
                title: "Action",
                width: "30%",
                render: (value, record) => {
                    return (
                        <>
                            {role === ADMIN && this.extendMachine(record)}
                            <StyledButton
                                onClick={() => {
                                    handleSetStep("formEdit");
                                    handleFetchValue(record?.id);
                                }}
                                style={{ marginRight: 5 }}
                            >
                                Edit
                            </StyledButton>
                            <StyledButton
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
                            </StyledButton>
                        </>
                    );
                }
            },
            role === ADMIN ? this.renderPathDownloadFile() : {}
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
