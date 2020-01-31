import React, { Component } from "react";
import { Button, Row, Col, Menu, Icon, Avatar, Badge } from "antd";
import styled from "styled-components";
import FormUser from "../FormUser";

const StyledColLeft = styled(Col)`
    text-align: left;
`;

const StyledColRight = styled(Col)`
    text-align: right;
`;

const StyledAvatar = styled(Avatar)`
    margin-right: 10px;
    cursor: pointer;
`;

class App extends Component {
    render() {
        const { toggleCollapsed, collapsed } = this.props;

        return (
            <Menu
                // theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["2"]}
                style={{
                    lineHeight: "64px",
                    padding: "0px 20px"
                }}
            >
                <Row>
                    <StyledColLeft xs={12}>
                        <Button
                            type="primary"
                            onClick={() => {
                                toggleCollapsed();
                            }}
                            style={{ marginBottom: 16 }}
                        >
                            <Icon
                                type={collapsed ? "menu-unfold" : "menu-fold"}
                            />
                        </Button>
                    </StyledColLeft>
                    <StyledColRight xs={12}>
                        <span>
                            <Badge>
                                <StyledAvatar
                                    shape="square"
                                    icon="user"
                                    onClick={() => {
                                        const { userId } = this.props;
                                        window.location.href = `/profile/${userId}`;
                                    }}
                                />
                            </Badge>
                        </span>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            <a href="/logout">Logout</a>
                        </Button>
                    </StyledColRight>
                </Row>
            </Menu>
        );
    }
}

export default App;
