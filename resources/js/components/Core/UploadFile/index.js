import React, { PureComponent } from "react";
import { Upload, message, Button, Icon } from "antd";
import Cookies from "js-cookie";

class UploadFile extends PureComponent {
    render() {
        const { url, folder, params = {} } = this.props;

        let props = {
            name: "file",
            headers: {
                authorization: `Bearer ${Cookies.get("JWT_TOKEN")}`
            },
            onChange(info) {
                if (info.file.status !== "uploading") {
                    // console.log(info.file, info.fileList);
                }
                if (info.file.status === "done") {
                    message.success(
                        `${info.file.name} file uploaded successfully`
                    );
                } else if (info.file.status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
            data: file => {
                return { folder: folder || "bills", ...params };
            }
        };

        props = {
            action: url || `/api/test_v1/file`,
            ...props
        };

        return (
            <Upload {...props}>
                <Button>
                    <Icon type="upload" /> Click to Upload
                </Button>
            </Upload>
        );
    }
}

export default UploadFile;
