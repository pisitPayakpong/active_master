import React, { Component } from "react";
import { Layout } from "antd";

const { Content } = Layout;

class App extends Component {
    render() {
        const { minHeight = 280, padding = 24, textAlign = "" } = this.props;
        return (
            <Content
                style={{
                    background: "#fff",
                    padding,
                    margin: 0,
                    minHeight,
                    marginBottom: "20px",
                    textAlign
                }}
            >
                {this.props.children}
            </Content>
        );
    }
}

export default App;
