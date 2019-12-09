import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, PageHeader, Input} from 'antd';

const { Search } = Input;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


export default class Main extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    render() {
        return (
            <div>
                <PageHeader
                    style={{
                    border: '1px solid rgb(235, 237, 240)',
                    }}
                    title="Tweets Trend"
                    backIcon="false"
                    subTitle="This is a subtitle"
                    extra={
                        <Search
                            placeholder="input search text"
                            onSearch={value => console.log(value)}
                            style={{ width: 500 }}
                        />
                    }
                />
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider theme="light" collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <div className="logo" />
                        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1">
                                <Icon type="pie-chart" />
                                <span>Statistics</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="desktop" />
                                <span>Word Cloud</span>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Icon type="desktop" />
                                <span>Tweets</span>
                            </Menu.Item>
                            <SubMenu
                                key="sub1"
                                title={
                                    <span>
                                        <Icon type="user" />
                                        <span>Visualization</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="4">v1</Menu.Item>
                                <Menu.Item key="5">v2</Menu.Item>
                                <Menu.Item key="6">v3</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }} />
                        <Content style={{ margin: '0 16px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ padding: 24, background: '#FFF', minHeight: 360 }}>Bill is a cat.</div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>COMP 484 - Artificial Intelligence: Team 1522</Footer>
                    </Layout>
                </Layout>
            </div>
            
        );
    }
}