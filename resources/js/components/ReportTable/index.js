import React, { Component } from "react";
import { Table } from "antd";
import axios from "axios";
import { map } from "lodash";
import styled from "styled-components";
import { saveAs } from "file-saver";

import LayoutContent from "../Core/LayoutContent";

const DivTitle = styled.div`
    font-size: 22px;
    text-align: left;
    padding: 10px 5px;
`;

class Barchart extends Component {
    state = { data: [], pagination: {}, loading: false };

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
            url: "/api/test_v1/report",
            method: "get",
            data: {
                results: 10
            },
            params: {
                ...params,
                type: toString(params?.role),
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

    transformData = data => {
        return map(data?.data, d => d);
    };

    downloadReport = id => {
        axios({
            url: "/api/test_v1/report/downloadPdf",
            method: "get",
            params: {
                id
            },
            type: "json",
            responseType: "blob"
        }).then(res => {
            if (res.status === 200) {
                const filename = `report_${id}.pdf`;
                saveAs(res?.data, filename, { autoBom: true });
            }
        });
    };

    render() {
        const { data, loading, pagination } = this.state;

        const columns = [
            {
                title: "ID",
                dataIndex: "id",
                sorter: true,
                width: "20%"
            },
            {
                title: "Type",
                dataIndex: "type",
                sorter: true,
                width: "40%"
            },
            {
                title: "Datetime",
                dataIndex: "datetime",
                width: "20%"
            },
            {
                title: "Action",
                render: report => (
                    <a
                        onClick={() => {
                            console.log({ report });
                            this.downloadReport(report?.id);
                        }}
                    >
                        Download
                    </a>
                ),
                width: "20%"
            }
        ];

        return (
            <>
                <LayoutContent>
                    <DivTitle>Reports</DivTitle>
                    <Table
                        columns={columns}
                        rowKey={record => {
                            return record.id;
                        }}
                        dataSource={this.transformData(data)}
                        pagination={pagination}
                        loading={loading}
                        onChange={this.handleTableChange}
                        scroll={{ x: 1500, y: 1000 }}
                    />
                </LayoutContent>
            </>
        );
    }
}
export default Barchart;
