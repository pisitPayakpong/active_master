import React, { Component } from "react";
import { Upload, Icon, message } from "antd";
import { includes } from "lodash";

class UploadImage extends Component {
    state = {
        imageUrl: this.props?.imageUrl,
        loading: false
    };

    componentDidUpdate(prevProps) {
        if (prevProps?.imageUrl !== this.props?.imageUrl) {
            this.setState({
                imageUrl: this.props?.imageUrl
            });
        }
    }

    beforeUpload = file => {
        const typeImages = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/jpg"
        ];

        if (!includes(typeImages, file.type)) {
            message.error("You can only upload JPG/PNG file!");
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }

        return false;
    };

    handleUpload = ({ file }) => {
        // Get this url from response in real world.

        const formData = new FormData();
        const { folder } = this.props;

        formData.append("file", file);
        folder && formData.append("folder", folder);

        this.setState({
            uploading: true
        });

        this.props.onUpload(formData).finally(() => {
            this.setState({
                uploading: false
            });
        });
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? "loading" : "plus"} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;

        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={this.beforeUpload}
                onChange={this.handleUpload}
                showUploadList={false}
            >
                {imageUrl ? (
                    <img
                        src={`${window.location.origin}/${imageUrl}`}
                        alt="avatar"
                        style={{ width: "100%" }}
                    />
                ) : (
                    uploadButton
                )}
            </Upload>
        );
    }
}

export default UploadImage;
