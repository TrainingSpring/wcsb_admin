import * as React from "react"
import {Avatar, Menu, PageHeader,message} from "antd";
import {withRouter} from "react-router-dom";
import tools from "../plugin/tools"
import "./index.less"
import {
    HeartOutlined,
    ShopOutlined,
    DatabaseOutlined,
    LogoutOutlined,
    LeftOutlined
} from "@ant-design/icons";


class Main extends React.Component<any, any> {
    state = {
        collapsed: false,
        selectedKeys:["0"],
        menus: [
            {
                text: "客户数据",
                icon: <DatabaseOutlined/>,
                path:"/"
            },
            {
                text: "客户体验",
                icon: <HeartOutlined/>,
                path:"/experience"
            },
            {
                text: "临街商铺",
                icon: <ShopOutlined/>,
                path:"/shop"
            }
        ],
        title: "客户数据"
    };
    componentDidMount() {
        let path = this.props.history.location.pathname;
        this.state.menus.forEach((item,index)=>{
            if (item.path === path) this.setState({
                selectedKeys:[index+""]
            })
        })
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    onSelectMenu = (info: any) => {
        console.log(info);
        let {key} = info;
        let item: any = this.state.menus[key];
        this.setState({
            title: item.text,
            selectedKeys:[key]
        })
        console.log(this.state,"state");
        this.props.history.replace(item.path);

    };
    onExit = ()=>{
        tools.setCookie("key","");
        message.success("已成功退出")
        this.props.history.replace("/login");
    }
    Header() {
        return (
            <div className={"userInfo"}>
                <div className="logout"  onClick={this.onExit}><LogoutOutlined /> <span>退出</span></div>
                {/*<div className="username">123456</div>*/}
                {/*<div className="logo"><Avatar src="https://joeschmoe.io/api/v1/random"/></div>*/}
            </div>
        )
    }

    render() {
        let path = this.props.history.location.pathname;
        return (
            <div id={'Main'}>
                <div className="topInfo">
                    <PageHeader title={"后台管理系统"} subTitle={this.state.title} className={'pageHeader'} ghost={false} backIcon={false}  extra={this.Header()} />
                </div>
                <div className="body">
                    <div style={{maxWidth: 256, height: '100%'}}>
                        {/*<Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>*/}
                        {/*    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}*/}
                        {/*</Button>*/}
                        <Menu
                            defaultSelectedKeys={["0"]}
                            mode="inline"
                            theme="dark"
                            style={{height: "100%"}}
                            onClick={this.onSelectMenu}
                            selectedKeys={this.state.selectedKeys}
                            inlineCollapsed={this.state.collapsed}
                        >
                            {
                                this.state.menus.map((item, index) => {
                                    return <Menu.Item key={index} icon={item.icon}>
                                        {item.text}
                                    </Menu.Item>
                                })
                            }


                        </Menu>
                    </div>
                    <div id="Content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(Main);
