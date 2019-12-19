import React from 'react';
import { Tag, Button, List, Card, Comment, Menu, Avatar, Statistic, Row, Col, Layout, Breadcrumb, Icon, PageHeader, Typography } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import WordCloud from "react-d3-cloud";
import Gauge from './Gauge';
import SearchBar from './SearchBar';
import { DEFAULT_CATEGORY_INFO, DEFAULT_WORD_CLOUD, DEFAULT_TWEETS } from "../constants";

const axios = require('axios').default;

const fontSizeMapper = word => Math.log2(word.value) * 5;
// const rotate = word => word.value % 360;


// 定义度量
const cols = {
    value: { alias: 'Count' },
    text: { alias: 'Word' }
};


// This is for Layout
const { Content, Footer, Sider } = Layout;




export default class Main extends React.Component {

    state = {
        allCategory: [],
        categoryInfo: {},
        wordCloudData: [],
        exampleTweets: [{},{},{},{},{},{}],
    }

    componentDidMount() {
        this.loadCategoryInfo(this.state.categoryInfo.categoryName);
    }

    handleSelectCategory = (categoryName) => {
        this.loadCategoryInfo(categoryName);
    };


    loadCategoryInfo = async (categoryName) => {
        let categoryInfo = {};
        const allCategory = await axios.get("http://localhost:8080/category/getAll?page=0%size=20&sort=count,desc");
        console.log(allCategory.data.content[0].categoryName)
        if(categoryName==null){
            categoryInfo = await axios.get("http://localhost:8080/getCategory/" + allCategory.data.content[0].categoryName);
        } else{
            categoryInfo = await axios.get("http://localhost:8080/getCategory/" + categoryName);
        }

        const wordCloudData = await axios.get("http://localhost:8080/category/" + categoryInfo.data.id + "/getAllWords")
        const exampleTweets = await axios.get("http://localhost:8080/category/" + categoryInfo.data.id + "/getAllTweets")
        // console.log(categoryInfo.data);
        this.setState(
            {
                allCategory: allCategory.data.content.map(category => ({
                    name:category.categoryName
                })),
                categoryInfo: {
                    categorId: categoryInfo.data.id,
                    categoryName: categoryInfo.data.categoryName,
                    score: categoryInfo.data.score,
                    count: categoryInfo.data.count
                },
                wordCloudData: wordCloudData.data.map(word => ({
                    text: word.word,
                    value: word.count
                })),
                exampleTweets: exampleTweets.data.map(tweet => ({
                    content:tweet.content
                }))
            }
        );
        // console.log(this.state)
    }

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
                        // Use the SearchBar.js Component to replace this
                        <SearchBar handleSelectCategory={this.handleSelectCategory} />
                    }
                />
                <Layout style={{ minHeight: '100vh' }}>
                    <Layout>
                        <Content style={{ margin: '0 16px' }}>
                            <br />
                            <Layout>
                                <Sider width="200" theme="light">
                                    <div className="logo" />
                                    <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                                        <div style={{ minHeight: '120vh' }}>
                                            <List
                                                size="small"
                                                header={<Typography.Text strong style={{ paddingLeft: '20px' }}>Trending Events</Typography.Text>}
                                                footer={<div></div>}
                                                dataSource={this.state.allCategory}
                                                renderItem={item =>
                                                    <List.Item>
                                                        <Button type="link" onClick={(event) => this.handleSelectCategory(item.name)}>
                                                            {item.name}
                                                        </Button>
                                                    </List.Item>}
                                            />
                                        </div>
                                    </Menu>
                                </Sider>
                                <Content style={{ padding: 24, background: '#FFF', minHeight: 360 }}>
                                    <Breadcrumb style={{ margin: '16px 0' }}>
                                        <Breadcrumb.Item>
                                            <Typography.Text strong>Dashboard</Typography.Text>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item>
                                            <Typography.Text strong>Event</Typography.Text>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item>
                                            <Typography.Text strong>{this.state.categoryInfo.categoryName}</Typography.Text>
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                    <div>
                                        <Row gutter={[8, 8]} type='flex'>
                                            <Col span={12}>
                                                <Card className="Score" title="Sentiment Score" style={{ height: '615px'}}>
                                                    <Row gutter={16} >
                                                        <Col span={12} type='flex' align='center'>
                                                            <Statistic title="Event" value={this.state.categoryInfo.categoryName} valueStyle={{ fontSize: '36px' }} />
                                                        </Col>
                                                        <Col span={12} type='flex' align='center'>
                                                            {this.state.categoryInfo.score < -0.05 && <Statistic
                                                                title="Score"
                                                                valueStyle={{ color: '#F5222D', fontSize: '36px' }}
                                                                value={parseFloat(this.state.categoryInfo.score).toFixed(2)}
                                                                prefix={<Icon type="arrow-down" />}
                                                                precision={2}
                                                            />}
                                                            {this.state.categoryInfo.score >= -0.05 && this.state.categoryInfo.score <= 0.05 && <Statistic
                                                                title="Score"
                                                                valueStyle={{ color: '#FFBF00', fontSize: '36px' }}
                                                                value={parseFloat(this.state.categoryInfo.score).toFixed(2)}
                                                                prefix={<Icon type="-minus" />}
                                                                precision={2}
                                                            />}
                                                            {this.state.categoryInfo.score > 0.05 && <Statistic
                                                                title="Score"
                                                                valueStyle={{ color: '#55cb72', fontSize: '36px' }}
                                                                value={parseFloat(this.state.categoryInfo.score).toFixed(2)}
                                                                prefix={<Icon type="arrow-up" />}
                                                                precision={2}
                                                            />}
                                                        </Col>
                                                    </Row>
                                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                        <Gauge score={this.state.categoryInfo.score} />
                                                    </div>
                                                    <Row type='flex' justify='center' >
                                                        <Col span={8} justify='center' align='center'>
                                                            <Tag
                                                                color='#F5222D'
                                                            >Negative</Tag>
                                                        </Col>
                                                        <Col span={8} justify='center' align='center'>
                                                            <Tag
                                                                color='#FFBF00'
                                                            >Netural</Tag>
                                                        </Col>
                                                        <Col span={8} justify='center' align='center'>
                                                            <Tag
                                                                color='#55cb72'
                                                            >Postive</Tag>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card className="Tweets" title="Example Tweets" style={{ height: '615px', overflowY:'scroll' }}>
                                                    <Row gutter={[16, 16]} type="flex">
                                                        <Col span={12}>
                                                            <Comment

                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                //TODO: Get from server -> Tweets table. content
                                                                content={
                                                                    <p>{this.state.exampleTweets[0].content}
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                        <Col span={12} >
                                                            <Comment
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>{this.state.exampleTweets[1].content}
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={[16, 16]} type="flex">
                                                        <Col span={12}>
                                                            <Comment
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>{this.state.exampleTweets[2].content}
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Comment

                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>{this.state.exampleTweets[3].content}
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={[16, 16]} type="flex">
                                                        <Col span={12}>
                                                            <Comment

                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>{this.state.exampleTweets[4].content}
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Comment

                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>{this.state.exampleTweets[5].content}
                                                                    </p>
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <Card className="StatsGraph" title="Word Count" style={{ height: '615px'}}>
                                                    <Chart width={750} height={500} data={this.state.wordCloudData} scale={cols} padding={[10, 30, 160, 70]} forceFit>
                                                        <Axis name="text" title />
                                                        <Axis name="value" title />
                                                        <Legend position="bottom" offsetY={-window.innerHeight / 2 + 430} offsetX={0} />
                                                        <Tooltip />
                                                        <Geom type="interval" position="text*value" color="text" />
                                                    </Chart>
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card className="WordCloud" title="Word Cloud" style={{ height: '615px',resize:'vertical', overflow: 'auto'}}>
                                                    <WordCloud
                                                        data={this.state.wordCloudData}
                                                        fontSizeMapper={fontSizeMapper}
                                                        height={500}
                                                        style={{}}
                                                    />
                                                </Card>
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
