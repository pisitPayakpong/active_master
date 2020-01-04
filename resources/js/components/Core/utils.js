import React from "react";
import { notification, Icon } from "antd";

export const openNotification = (status = true, description = "Success") => {
    notification.open({
        message: "Status",
        description: status ? "Success" : description,
        icon: (
            <Icon
                type={status ? "smile" : "exclamation"}
                style={{ color: status ? "#0b8235" : "red" }}
            />
        )
    });
};

export const getOptionRole = () => {
    return [
        // { text: "Super Admin", value: "super_admin" },
        { text: "Admin", value: "admin" },
        { text: "Vistor", value: "visitor" }
    ];
};

export const getOptionStatus = () => {
    return [
        // { text: "Super Admin", value: "super_admin" },
        { text: "READY", value: "READY" },
        { text: "LOGIN", value: "LOGIN" },
        { text: "OFF", value: "OFF" }
    ];
};
