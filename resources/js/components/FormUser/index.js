import React, { Component } from "react";
import { Form, Input, Tooltip, Icon, Button } from "antd";

import Layout from "../Core/LayoutContent";

class RegistrationForm extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: []
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log({ values });
            if (!err) {
                console.log("Received values of form: ", values);
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { handleSetStep } = this.props;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 16
                }
            }
        };

        return (
            <Layout style={{ padding: "100px 500px" }}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item
                        label={
                            <span>
                                Name&nbsp;
                                <Tooltip title="What do you want others to call you?">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your name!",
                                    whitespace: true
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="E-mail">
                        {getFieldDecorator("email", {
                            rules: [
                                {
                                    type: "email",
                                    message: "The input is not valid E-mail!"
                                },
                                {
                                    required: true,
                                    message: "Please input your E-mail!"
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Password" hasFeedback>
                        {getFieldDecorator("password", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your password!"
                                },
                                {
                                    validator: this.validateToNextPassword
                                }
                            ]
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="Confirm Password" hasFeedback>
                        {getFieldDecorator("confirm", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please confirm your password!"
                                },
                                {
                                    validator: this.compareToFirstPassword
                                }
                            ]
                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                        <Button
                            onClick={() => {
                                handleSetStep("list");
                            }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Layout>
        );
    }
}

const WrappedRegistrationForm = Form.create({ name: "register" })(
    RegistrationForm
);

export default WrappedRegistrationForm;
