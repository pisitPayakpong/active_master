import { notification } from "antd";

export default () => next => action => {
    const { type, meta, payload } = action;

    //check authorization
    if (payload?.response?.status === 401) {
        window.location.href = "blog";
    }

    if (type.includes("_FULFILLED")) {
        if (meta && meta.msgSuccess) {
            notification.success({
                message: meta?.msgSuccessTitle || "Success",
                description: meta?.msgSuccess,
                duration: 5,
                className: "notification-success"
            });
        }
    } else if (type.includes("_REJECTED")) {
        const { error } = payload?.response?.data || {};

        notification.error({
            message: meta?.msgFailureTitle || "Something went wrong",
            description:
                error?.message ||
                meta?.msgFailure ||
                "Unexpected error. Please contact admin",
            duration: 5,
            className: "notification-error"
        });
    }

    return next(action);
};
