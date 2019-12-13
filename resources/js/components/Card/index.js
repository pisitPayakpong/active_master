import React, { PureComponent } from "react";
import { Card, Col, Row } from "antd";
import { map, filter } from "lodash";
import axios from "axios";

import LayoutContent from "../Core/LayoutContent";

const CONFIG_CARD = [
    { span: 6, key: "glass", title: "Total Glass", value: null },
    { span: 6, key: "o3", title: "Total O3 Usage", value: null },
    { span: 6, key: "h2", title: "Total H2 Usage", value: null },
    { span: 6, key: "price", title: "Total Revenue", value: null }
];

class CardComponent extends PureComponent {
    state = {
        data: []
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = (params = {}) => {
        this.setState({ loading: true });
        axios({
            url: "/api/test_v1/glass/total_usage",
            method: "get",
            data: {
                results: 10
            },
            type: "json"
        }).then(data => {
            this.setState({
                data: data?.data
            });
        });
    };

    transformData = data => {
        return map(CONFIG_CARD, config => {
            const dataFilter = filter(data?.data, (d, key) => {
                return key === config.key;
            });
            return {
                ...config,
                value: dataFilter
            };
        });
    };

    render() {
        const { data } = this.state;
        const newConfigs = this.transformData(data);

        return (
            <LayoutContent minHeight="auto">
                <Row gutter={16}>
                    {map(newConfigs, (card, key) => (
                        <Col span={card?.span} key={key}>
                            <Card
                                title={card?.title}
                                bordered={true}
                                style={{ height: "100%" }}
                            >
                                {card?.value}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </LayoutContent>
        );
    }
}

export default CardComponent;
