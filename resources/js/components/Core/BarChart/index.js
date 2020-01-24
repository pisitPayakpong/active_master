import React, { Component } from "react";
import axios from "axios";
import { Card, Button } from "antd";
import { map } from "lodash";
import moment from "moment";

import GlassList from "../GlassTable";
import EchartComponent from "../Core/EchartsComponent";

class Barchart extends Component {
    state = { data: [], loading: false };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.setState({ loading: true });
        axios({
            url: "/api/test_v1/glass",
            method: "get",
            type: "json"
        }).then(res => {
            this.setState({
                loading: false,
                data: res?.data?.data
            });
        });
    };

    transformData = data => {
        return map(data, d => {
            const datetime = moment(d?.date, "YYYY-MM-DD hh:mm:ss").format(
                "YYYY-MM-DD hh:mm:ss"
            );

            return [datetime, d?.h2_usage];
        });
    };

    render() {
        const { title = "title" } = this.props;
        const { data } = this.state;

        const option = {
            tooltip: {
                show: true
            },
            xAxis: {
                type: "time",
                axisLabel: {
                    show: true
                }
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    data: this.transformData(data),
                    type: "line",
                    lineStyle: { type: "dash", color: "#FF4F65" }
                }
            ]
        };

        return (
            <>
                <Card
                    title={title}
                    bordered={true}
                    style={{ height: "50%", marginBottom: "20px" }}
                >
                    <EchartComponent option={option} />
                </Card>
                <GlassList />
            </>
        );
    }
}
export default Barchart;
