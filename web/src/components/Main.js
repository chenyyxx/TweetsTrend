import React from 'react';
import { Tag, Button, List, Card, Comment, Menu, Avatar, Statistic, Row, Col, Layout, Breadcrumb, Icon, PageHeader, Input, Typography } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import WordCloud from "react-d3-cloud";
import Gauge from './Gauge';


// TODO: fix layout in other screen size
// TODO: make the search bar functionable
// TODO: change the test data to real data by fetching it from backend
const TredningList = [
    {
        rank: 1,
        title: '#Trump',
    },
    {
        rank: 2,
        title: '#Concert',
    },
    {
        rank: 3,
        title: '#VoteNow',
    },
    {
        rank: 4,
        title: '#Final',
    },
    {
        rank: 5,
        title: '#Christmas',
    },
    {
        rank: 6,
        title: '#BlackFriday',
    },
    {
        rank: 7,
        title: '#CardiB',
    },
    {
        rank: 8,
        title: '#CNN',
    },
    {
        rank: 9,
        title: '#Election',
    },
    {
        rank: 10,
        title: '#ChainSmoker',
    },
];
// This is for word cloud
// Test Word Cloud Data
const wordCloudData = [
    { text: "the", value: 1689 },
    { text: "to", value: 1446 },
    { text: "Trump", value: 771 },
    { text: "of", value: 718 },
    { text: "a", value: 675 },
    { text: "and", value: 541 },
    { text: "is", value: 509 },
    { text: "in", value: 472 },
    { text: "for", value: 389 },
    { text: "be", value: 271 },
    { text: "on", value: 271 },
    { text: "that", value: 268 },
    { text: "The", value: 254 },
    { text: "%", value: 244 },
    { text: "he", value: 233 },
    { text: "will", value: 200 },
    { text: "you", value: 190 },
    { text: "-", value: 187 },
    { text: "are", value: 187 },

];

const fontSizeMapper = word => Math.log2(word.value) * 5;
// const rotate = word => word.value % 360;


// 定义度量
const cols = {
    value: { alias: 'Count' },
    text: { alias: 'Word' }
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
                                    <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                                        <div style={{ minHeight: '120vh' }}>
                                            <List 
                                                size="small"
                                                header={<Typography.Text strong style={{paddingLeft: '20px'}}>Trending Events</Typography.Text>}
                                                footer={<div></div>}
                                                dataSource={TredningList}
                                                renderItem={item => 
                                                <List.Item>
                                                    <Button type='link'>
                                                        {item.rank+". "}
                                                        {item.title}
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
                                            <Typography.Text strong>Trump</Typography.Text>
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                    <div>
                                        <Row gutter={[8, 8]} type='flex'>
                                            <Col span={12}>
                                                <Card className="Score" title="Sentiment Score" style={{height:'615px', justify: 'center', align: 'center'}}>
                                                    <Row gutter={16} >
                                                        <Col span={12} type='flex'type='flex' align='center'>
                                                            <Statistic title="Event" value={"Trump"} valueStyle={{fontSize: '36px'}} />
                                                        </Col>
                                                        <Col span={12} type='flex' align='center'>
                                                            <Statistic
                                                                title="Score"
                                                                valueStyle={{ color: '#F5222D', fontSize: '36px' }}
                                                                value={-0.48}
                                                                prefix={<Icon type="arrow-down" />}
                                                                precision={2}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <div style={{paddingLeft: '100px'}}>
                                                        <Gauge />
                                                    </div>
                                                    <Row type='flex' justify='center' align='center'>
                                                        <Col span={8} justify='center' align='center'>
                                                            <Tag
                                                                color= '#F5222D'
                                                            >Negative</Tag>
                                                        </Col>
                                                        <Col span={8} justify='center' align='center'>
                                                            <Tag
                                                                color= '#FFBF00'
                                                            >Netural</Tag>
                                                        </Col>
                                                        <Col span={8} justify='center' align='center'>
                                                            <Tag
                                                                color= '#55cb72'
                                                            >Postive</Tag>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card className="Tweets" title="Example Tweets">
                                                    <Row gutter={[16, 16]} type="flex">
                                                        <Col span={12}>
                                                            <Comment
                                                                
                                                                avatar={
                                                                    <Avatar
                                                                        icon="user"
                                                                    />
                                                                }
                                                                content={
                                                                    <p>BREAKING: The House Judiciary Cmte just released their 658-page impeachment report, to accompany the articles of impeachment against Trump for abuse of power and obstruction of justice. The best sentence in the report: “President Trump should be impeached and removed from office”</p>
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
                                                                    <p>
                                                                        Dem senator: I'm "gravely concerned" about what Trump might do before election if acquitted http://hill.cm/5dHJtQR
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
                                                                    <p>
                                                                        CNN's Jake Tapper grills Rand Paul on whether he really believes Trump is against corruption
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
                                                                    <p>
                                                                        Trump says he ‘wouldn’t mind’ long impeachment process, calls House-passed articles a ‘sham’ https://rt.com/usa/475856-trump-wouldnt-mind-impeachment-sham/
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
                                                                    <span>
                                                                        TRUMP'S.SUBHASH NIRANKARI CHANDER'S PEOPLE'S DON'TLIKE DECEPTIONS WANNA ACTLIKE MYFRIEND WON'TTAKE JOB'SFROM MEE CAUSE STUPID TRUMP'S NOTLIKE WORKING4GOD SOWICKER YOU ARE&RUSSIAN DUMBASS YOU ARE.EITHER WORK4GOD GET OUTBEFORE PISSMEE😄
                                                                    </span>
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
                                                                    <p>
                                                                        Trump Lashed Out at Fox News for Reporting on the Reality of Impeachment—Again
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
                                                <Card className="StatsGrah" title="Word Count">
                                                    <Chart width={750} height={400} data={wordCloudData} scale={cols}>
                                                        <Axis name="text" title />
                                                        <Axis name="value" title />
                                                        <Legend position="bottom" offsetY={-window.innerHeight / 2 +430} offsetX={0}/>
                                                        <Tooltip />
                                                        <Geom type="interval" position="text*value" color="text" />
                                                    </Chart>
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card className="WordCloud" title="Word Cloud">
                                                    <WordCloud 
                                                        data={wordCloudData} 
                                                        fontSizeMapper={fontSizeMapper}
                                                        height={400}
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