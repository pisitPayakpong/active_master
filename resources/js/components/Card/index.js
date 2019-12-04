import React, { PureComponent } from "react";
import { Card, Col, Row } from "antd";
import { map } from "lodash";

import LayoutContent from "../Core/LayoutContent";

const CONFIG_CARD = [
    { span: 8, title: "Users", value: 200 },
    { span: 8, title: "Water", value: 10 },
    { span: 8, title: "H3", value: 30 }
];

class CardComponent extends PureComponent {
    render() {
        return (
            <LayoutContent minHeight="auto">
                <Row gutter={16}>
                    {map(CONFIG_CARD, (card, key) => (
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
