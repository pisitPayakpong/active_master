import React, { Component } from "react";
import { Form, Input, Tooltip, Icon, Button, Select, Avatar } from "antd";
import axios from "axios";
import { map } from "lodash";

import Layout from "../Core/LayoutContent";
import { openNotification, getOptionRole } from "../Core/utils";
import Selector from "../Core/Selector";
import UploadImage from "../Core/UploadImage";

class RegistrationForm extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        province: "",
        imgUrl: this.props?.data?.image
    };

    componentDidUpdate(prevProps) {
        if (prevProps?.data?.image !== this.props?.data?.image) {
            this.setState({
                imgUrl: this.props?.data?.image
            });
        }
    }

    handleSubmit = e => {
        const { mode } = this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (mode === "create") {
                    this.handleCreareUser(values);
                }

                if (mode === "edit") {
                    this.handleUpdateUser(values);
                }
                // console.log("Received values of form: ", values);
            }
        });
    };

    handleCreareUser = value => {
        const { handleSetStep } = this.props;
        // post
        axios({
            url: `/api/test_v1/user`,
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
            url: `/api/test_v1/user/${data?.id}`,
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

    handleUpload = data => {
        // post
        return axios({
            url: `/api/test_v1/image`,
            method: "post",
            data: data,
            type: "json"
        })
            .then(res => {
                this.setState({
                    imgUrl: res?.data?.data?.url
                });

                this.props.form.setFieldsValue({
                    image: res?.data?.data?.url
                });
            })
            .catch(e => {
                openNotification(false, e?.response?.statusText);
            });
    };

    handleSetProvince = province => {
        this.setState({
            province: province
        });
    };

    renderOption = () => {
        return map(getOptionRole(), (role, key) => {
            return (
                <Option value={role?.value} key={key}>
                    {role?.text}
                </Option>
            );
        });
    };

    renderSelectRole = () => {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        return (
            <Form.Item label="Role">
                {getFieldDecorator("role", {
                    initialValue: data?.role,
                    rules: [
                        {
                            required: true,
                            message: "Please select your Role!"
                        }
                    ]
                })(
                    <Select placeholder="Select a option and change input text above">
                        {this.renderOption()}
                    </Select>
                )}
            </Form.Item>
        );
    };

    renderSelectProvince = provinces => {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;

        return (
            <Form.Item label="Province">
                {getFieldDecorator("province", {
                    initialValue: parseInt(data?.province),
                    rules: [
                        {
                            required: true,
                            message: "Please select your Province!"
                        }
                    ]
                })(
                    <Selector
                        data={provinces?.data}
                        width="100%"
                        renderTitle={false}
                        onChange={this.handleSetProvince}
                    />
                )}
            </Form.Item>
        );
    };

    renderFormPassword = () => {
        const { getFieldDecorator } = this.props.form;
        const { mode } = this.props;
        return (
            <>
                {mode === "create" && (
                    <>
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
                            })(
                                <Input.Password
                                    onBlur={this.handleConfirmBlur}
                                />
                            )}
                        </Form.Item>
                    </>
                )}
            </>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { handleSetStep, mode, data, provinces } = this.props;
        const { imgUrl } = this.state;

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
                                Avatar&nbsp;
                                <Tooltip title="What do you want others to call you?">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                    >
                        {getFieldDecorator("image", {
                            initialValue: data?.image
                        })(
                            <UploadImage
                                onUpload={this.handleUpload}
                                folder="user"
                                imageUrl={imgUrl}
                            />
                        )}
                    </Form.Item>
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
                    <Form.Item label="E-mail">
                        {getFieldDecorator("email", {
                            initialValue: data?.email,
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

                    {this.renderFormPassword()}

                    <Form.Item
                        label={
                            <span>
                                Address&nbsp;
                                <Tooltip title="What do you want others to call you?">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                    >
                        {getFieldDecorator("address", {
                            initialValue: data?.name,
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your Address!",
                                    whitespace: true
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    {this.renderSelectProvince(provinces)}
                    <Form.Item
                        label={
                            <span>
                                Tel&nbsp;
                                <Tooltip title="What do you want others to call you?">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                    >
                        {getFieldDecorator("tel", {
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
                    {this.renderSelectRole()}
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
