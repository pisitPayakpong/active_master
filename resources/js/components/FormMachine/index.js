import React, { Component } from "react";
import { Form, Input, Tooltip, Icon, Button, Select, InputNumber } from "antd";
import axios from "axios";
import { map, find } from "lodash";

import Layout from "../Core/LayoutContent";
import { openNotification, getOptionStatus } from "../Core/utils";

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
                if (mode === "create") {
                    this.handleCreare(values);
                }

                if (mode === "edit") {
                    this.handleUpdate(values);
                }
                // console.log("Received values of form: ", values);
            }
        });
    };

    handleCreare = value => {
        const { handleSetStep } = this.props;
        // post
        axios({
            url: `/api/test_v1/machine`,
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

    handleUpdate = value => {
        const { handleSetStep, data } = this.props;
        // put
        axios({
            url: `/api/test_v1/machine/${data?.id}`,
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

    renderOption = options => {
        return map(options, (option, key) => {
            return (
                <Option value={option?.value} key={key}>
                    {option?.text}
                </Option>
            );
        });
    };

    renderSelectStatus = () => {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        return (
            <Form.Item label="Status">
                {getFieldDecorator("status", {
                    initialValue: data?.status,
                    rules: [
                        {
                            required: true,
                            message: "Please select your Status!"
                        }
                    ]
                })(
                    <Select placeholder="Select a option and change input text above">
                        {this.renderOption(getOptionStatus())}
                    </Select>
                )}
            </Form.Item>
        );
    };

    renderSelectType = () => {
        const { getFieldDecorator } = this.props.form;
        const { data, options } = this.props;

        return (
            <Form.Item label="Type">
                {getFieldDecorator("type", {
                    initialValue: data?.type,
                    rules: [
                        {
                            required: true,
                            message: "Please select your Type!"
                        }
                    ]
                })(
                    <Select placeholder="Select a option and change input text above">
                        {this.renderOption(options?.data)}
                    </Select>
                )}
            </Form.Item>
        );
    };

    renderSelectShop = () => {
        const { getFieldDecorator } = this.props.form;
        const { data, shops, shopId } = this.props;

        const defaultShop = find(shops?.data, shop => {
            return shop.value == shopId;
        });

        return (
            <Form.Item label="Shop">
                {getFieldDecorator("shopId", {
                    initialValue: defaultShop?.value,
                    rules: [
                        {
                            required: true,
                            message: "Please select your Shop!"
                        }
                    ]
                })(
                    <Select placeholder="Select a option and change input text above">
                        {this.renderOption(shops?.data)}
                    </Select>
                )}
            </Form.Item>
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
                    {this.renderSelectShop()}
                    <Form.Item label={<span>Serial Number&nbsp;</span>}>
                        {getFieldDecorator("sn", {
                            initialValue: data?.sn,
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your serial number!"
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                MachineID&nbsp;
                                <Tooltip title="What do you want others to call you?">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                    >
                        {getFieldDecorator("machineID", {
                            initialValue: data?.machineID,
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your machineID!",
                                    whitespace: true
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>

                    {this.renderSelectStatus()}
                    {this.renderSelectType()}

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
