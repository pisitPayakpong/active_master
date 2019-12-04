import React, { Component } from "react";
import { Layout } from "antd";

const { Content } = Layout;

class App extends Component {
    render() {
        const { minHeight = 280 } = this.props;
        return (
            <Content
                style={{
                    background: "#fff",
                    padding: 24,
                    margin: 0,
                    minHeight,
                    marginBottom: "20px"
                }}
            >
                {this.props.children}
            </Content>
        );
    }
}

export default App;
