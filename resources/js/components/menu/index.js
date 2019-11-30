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
            { key: "user", title: "User", path: "/user" },
            { key: "water", title: "water", path: "/water" }
        ]
    }
];

class NavBar extends Component {
    state = {
        collapsed: false
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    renderMenuItem = subMenu => {
        return map(subMenu, (menu, key) => {
            return <Menu.Item key={key}>{menu.title}</Menu.Item>;
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
        return (
            <div>
                <Sider width={200} style={{ background: "#fff" }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        defaultOpenKeys={["sub1"]}
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
