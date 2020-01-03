import React, { Component } from "react";
import { Layout, Menu, Icon, Avatar } from "antd";
import { map, filter, includes } from "lodash";
import styled from "styled-components";

const { SubMenu } = Menu;
const { Sider } = Layout;

const DivLogo = styled.div`
    background-color: "#001529";
    padding: 20px;
`;

const MENU_CONFIG = [
    {
        key: "Mangement",
        title: "Mangement",
        subMenu: [
            { key: "dashboard", title: "Dashboard", path: "/dashboard" },
            { key: "user", title: "User", path: "/user" },
            { key: "shop", title: "Shop", path: "/shop" },
            { key: "machine", title: "Machine", path: "/machine" },
            { key: "glass", title: "Glass", path: "/glass" }
            // { key: "water", title: "water", path: "/water" }
        ]
    }
];

class NavBar extends Component {
    state = {
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

    // onCollapse = collapsed => {
    //     console.log(collapsed);
    //     this.setState({ collapsed });
    // };

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

    authMenu = configs => {
        const authMenus = JSON.parse(
            document.getElementById("initial-state").innerHTML
        );

        return map(configs, config => {
            const subMenu = filter(config.subMenu, menu => {
                return includes(authMenus?.render_menu, menu.key);
            });

            return {
                ...config,
                subMenu
            };
        });
    };

    render() {
        const { collapsed, toggleCollapsed } = this.props;
        const { current, openKeys } = this.state;
        const menuConfig = this.authMenu(MENU_CONFIG);

        return (
            <div>
                <Sider
                    // collapsible
                    collapsed={collapsed}
                    onCollapse={toggleCollapsed}
                    width={200}
                    style={{ background: "#fff", height: "100%" }}
                    breakpoint="md"
                    collapsedWidth="0"
                    zeroWidthTriggerStyle={{ display: "none" }}
                >
                    <DivLogo
                        style={{ backgroundColor: "#001529", padding: 20 }}
                    >
                        <Avatar shape="square" size={64} icon="user" />
                    </DivLogo>
                    <Menu
                        theme="dark"
                        mode="inline"
                        openKeys={openKeys}
                        selectedKeys={[current]}
                        onOpenChange={this.onOpenChange}
                        style={{ height: "100%", borderRight: 0 }}
                    >
                        {this.renderSubMenu(menuConfig)}
                    </Menu>
                </Sider>
            </div>
        );
    }
}

export default NavBar;
