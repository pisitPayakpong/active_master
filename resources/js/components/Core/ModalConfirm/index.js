import { Modal } from "antd";

const { confirm } = Modal;

export const confirmModal = ({
    title = "Successs",
    content = null,
    callbackOk,
    callbackCancel
}) => {
    confirm({
        title,
        content,
        onOk() {
            callbackOk && callbackOk();
        },
        onCancel() {
            callbackCancel && callbackCancel();
        }
    });
};

export const successModal = ({ title, content, href }) =>
    Modal.success({
        title,
        content,
        onOk: () => {
            window.location.href = href;
        }
    });
