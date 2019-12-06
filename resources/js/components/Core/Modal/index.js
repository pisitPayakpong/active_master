import React, { Component } from "react";
import { Modal, Button } from "antd";

class App extends Component {
    state = { visible: false };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = e => {
        this.setState({
            visible: false
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    render() {
        const { title = "Basic Modal", renderContents } = this.props;

        const contents = renderContents ? renderContents() : "contents";

        return (
            <>
                <Button type="primary" onClick={this.showModal}>
                    Show
                </Button>
                <Modal
                    title={title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {contents}
                </Modal>
            </>
        );
    }
}

export default App;
