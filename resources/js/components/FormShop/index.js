import React, { Component } from "react";
import { Form, Input, Tooltip, Icon, Button, Select, InputNumber } from "antd";
import axios from "axios";
import { map, toString } from "lodash";

import Layout from "../Core/LayoutContent";
import { openNotification } from "../Core/utils";

const ADMIN = "admin";

class RegistrationForm extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: []
    };

    handleSubmit = e => {
        const { mode } = this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const newValue = {
                    ...values,
                    users: toString(values?.users)
                };

                if (mode === "create") {
                    this.handleCreareUser(newValue);
                }

                if (mode === "edit") {
                    this.handleUpdateUser(newValue);
                }
                // console.log("Received values of form: ", values);
            }
        });
    };

    handleCreareUser = value => {
        const { handleSetStep } = this.props;
        // post
        axios({
            url: `/api/test_v1/shop`,
            method: "post",
            data: {
                ...value
            },
            type: "json"
        })
            .then(data => {
                openNotification();
                handleSetStep("list");
            })
            .catch(e => {
                openNotification(false, e?.response?.statusText);
            });
    };

    handleUpdateUser = value => {
        const { handleSetStep, data } = this.props;
        // put
        axios({
            url: `/api/test_v1/shop/${data?.id}`,
            method: "put",
            data: {
                ...value
            },
            type: "json"
        })
            .then(data => {
                openNotification();
                handleSetStep("list");
            })
            .catch(e => {
                openNotification(false, e?.response?.statusText);
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

    handleSelectChange = value => {
        this.props.form.setFieldsValue({
            note: `Hi, ${value === "male" ? "man" : "lady"}!`
        });
    };

    renderOption = data => {
        return map(data, (d, key) => {
            return (
                <Option value={d?.value} key={key}>
                    {d?.text}
                </Option>
            );
        });
    };

    renderSelectUsers = () => {
        const { getFieldDecorator } = this.props.form;
        const { userOptions, currentUser, data } = this.props;

        return (
            currentUser?.role === ADMIN && (
                <Form.Item label="User">
                    {getFieldDecorator("users", {
                        initialValue: data?.userIds,
                        rules: [
                            {
                                required: true,
                                message: "Please select your Users!"
                            }
                        ]
                    })(
                        <Select
                            mode="multiple"
                            placeholder="Select a option and change input text above"
                        >
                            {this.renderOption(userOptions)}
                        </Select>
                    )}
                </Form.Item>
            )
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { handleSetStep, mode, data } = this.props;

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
                {mode === "create" ? "Register" : "Edit"}
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
                            initialValue: data?.name,
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your name!",
                                    whitespace: true
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label={<span>lat&nbsp;</span>}>
                        {getFieldDecorator("lat", {
                            initialValue: data?.lat,
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your lat!"
                                }
                            ]
                        })(
                            <InputNumber
                                min={0}
                                step={0.1}
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={<span>lng&nbsp;</span>}>
                        {getFieldDecorator("lng", {
                            initialValue: data?.lng,
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your lng!"
                                }
                            ]
                        })(
                            <InputNumber
                                min={0}
                                step={0.1}
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                    {this.renderSelectUsers()}
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
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
