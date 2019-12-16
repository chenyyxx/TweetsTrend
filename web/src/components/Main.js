import React from 'react';
import { Comment, Menu, Avatar, Statistic, Row, Col, Layout, Breadcrumb, Icon, PageHeader, Input, Typography } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import WordCloud from "react-d3-cloud";
import Gauge from './Gauge';


// This is for word cloud
// Test Word Cloud Data
const wordCloudData = [
    { text: "Hey", value: 1000 },
    { text: "lol", value: 200 },
    { text: "first", value: 800 },
    { text: "cool", value: 1000000 },
    { text: "duck", value: 10 }
];

const fontSizeMapper = word => Math.log2(word.value) * 5;
// const rotate = word => word.value % 360;

// This is for chart
// Test Data
const data = [
    { genre: 'Sports', sold: 275, income: 2300 },
    { genre: 'Strategy', sold: 115, income: 667 },
    { genre: 'Action', sold: 120, income: 982 },
    { genre: 'Shooter', sold: 350, income: 5271 },
    { genre: 'Other', sold: 150, income: 3710 }
];
// 定义度量
const cols = {
    sold: { alias: '销售量' },
    genre: { alias: '游戏种类' }
};


// This is for Layout
const { Search } = Input;
const { Content, Footer, Sider } = Layout;




export default class Main extends React.Component {
    render() {
        return (
            <div>
                <PageHeader
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    title="Tweets Trend"
                    backIcon="false"
                    subTitle="Help you find the public sentiments towards an event"
                    extra={
                        <Search
                            placeholder="input search text"
                            onSearch={value => console.log(value)}
                            style={{ width: 500 }}
                        />
                    }
                />
                <Layout style={{ minHeight: '100vh' }}>
                    <Layout>
                        <Content style={{ margin: '0 16px' }}>
                            <br />
                            <Layout>
                                <Sider width="200" theme="light">
                                    <div className="logo" />
                                    <Typography>List of Trending Categories</Typography>
                                    <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">

                                    </Menu>
                                </Sider>
                                <Content style={{ padding: 24, background: '#FFF', minHeight: 360 }}>
                                    <Breadcrumb style={{ margin: '16px 0' }}>
                                        <Breadcrumb.Item>
                                            <Typography.Text strong>Dashboard</Typography.Text>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item>
                                            <Typography.Text strong>Category</Typography.Text>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item>
                                            <Typography.Text strong>Sport</Typography.Text>
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                    <div>
                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <br/>
                                                <br/>
                                                <div className="Score">
                                                    <Row gutter={16}>
                                                        <Col span={12}>
                                                            <Statistic title="Category" value={"Sport"} />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Statistic
                                                                title="Score"
                                                                valueStyle={{ color: '#F5222D' }}
                                                                value={-0.38}
                                                                prefix={<Icon type="arrow-down" />}
                                                                precision={2}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Gauge/>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="Tweets">
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={12}>
                                                            <Comment
                                                                author={<a>Han Solo</a>}
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>
                                                                        We supply a series of design principles, practical patterns and high quality design
                                                                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                                                                        and efficiently.
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Comment
                                                                author={<a>Han Solo</a>}
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>
                                                                        We supply a series of design principles, practical patterns and high quality design
                                                                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                                                                        and efficiently.
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={[16, 16]}>

                                                        <Col span={12}>
                                                            <Comment
                                                                author={<a>Han Solo</a>}
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>
                                                                        We supply a series of design principles, practical patterns and high quality design
                                                                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                                                                        and efficiently.
                                                                        </p>
                                                                }
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Comment
                                                                author={<a>Han Solo</a>}
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>
                                                                        We supply a series of design principles, practical patterns and high quality design
                                                                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                                                                        and efficiently.
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={12}>
                                                            <Comment
                                                                author={<a>Han Solo</a>}
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>
                                                                        We supply a series of design principles, practical patterns and high quality design
                                                                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                                                                        and efficiently.
                                                                        </p>
                                                                }
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Comment
                                                                author={<a>Han Solo</a>}
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>
                                                                        We supply a series of design principles, practical patterns and high quality design
                                                                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                                                                        and efficiently.
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <div className="StatsGrah">
                                                    <Chart width={600} height={400} data={data} scale={cols}>
                                                        <Axis name="genre" title />
                                                        <Axis name="sold" title />
                                                        <Legend position="top" dy={-20} />
                                                        <Tooltip />
                                                        <Geom type="interval" position="genre*sold" color="genre" />
                                                    </Chart>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="WordCloud">
                                                    <WordCloud data={wordCloudData} fontSizeMapper={fontSizeMapper} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Content>
                            </Layout>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>COMP 484 - Artificial Intelligence: Team 1522</Footer>
                    </Layout>
                </Layout>
            </div>

        );
    }
}