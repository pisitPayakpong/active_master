import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import { map } from "lodash";

const { SubMenu } = Menu;
const { Sider } = Layout;

const MENU_CONFIG = [
    {
        key: "Mangement",
        title: "Mangement",
        subMenu: [
            { key: "dashboard", title: "Dashboard", path: "/dashboard" },
            { key: "user", title: "User", path: "/user" },
            { key: "water", title: "water", path: "/water" }
        ]
    }
];

class NavBar extends Component {
    state = {
        collapsed: false,
        current: "",
        openKeys: []
    };

    componentDidMount() {
        let pathname = window.location.pathname;
        const current = pathname.substring(1).replace("/", "_");
        let openKeys = ["0"];

        this.setState({ current, openKeys });
    }

    onOpenChange = openKeys => {
        this.setState({
            openKeys
        });
    };

    renderMenuItem = subMenu => {
        return map(subMenu, (menu, key) => {
            return (
                <Menu.Item key={menu.key}>
                    <a href={menu.path}>{menu.title}</a>
                </Menu.Item>
            );
        });
    };

    renderSubMenu = subMenus => {
        return map(subMenus, (subMenu, key) => {
            return (
                <SubMenu
                    key={key}
                    title={
                        <span>
                            <Icon type="user" />
                            {subMenu.title}
                        </span>
                    }
                >
                    {this.renderMenuItem(subMenu.subMenu)}
                </SubMenu>
            );
        });
    };

    render() {
        const { current, openKeys } = this.state;
        return (
            <div>
                <Sider width={200} style={{ background: "#fff" }}>
                    <Menu
                        mode="inline"
                        openKeys={openKeys}
                        selectedKeys={[current]}
                        onOpenChange={this.onOpenChange}
                        style={{ height: "100%", borderRight: 0 }}
                    >
                        {this.renderSubMenu(MENU_CONFIG)}
                    </Menu>
                </Sider>
            </div>
        );
    }
}

export default NavBar;
