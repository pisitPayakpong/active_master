import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

class EchartsComponent extends Component {
    render() {
        const { option } = this.props;
        const defaultOption = {
            xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: "line"
                }
            ]
        };

        return <ReactEcharts option={option || defaultOption} />;
    }
}
export default EchartsComponent;
