import React from 'react';
import { Legend, Chart, Axis, Coord, Geom, Guide, Shape } from 'bizcharts';

const { Html, Arc } = Guide;

// 下面的代码会被作为 cdn script 注入 注释勿删
// CDN START
// use props to put data in


const lineWidth = 15;


// 自定义Shape 部分
Shape.registerShape('point', 'pointer', {
  drawShape(cfg, group) {
    let point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint(point);
    const center = this.parsePoint({ // 获取极坐标系下画布中心点
      x: 0,
      y: 0,
    });
    // 绘制指针
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 2.5,
        lineCap: 'round',
      },
    });
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 12,
        stroke: cfg.color,
        lineWidth: 2.5,
        fill: '#fff',
      },
    });
  },
});

const color = ['#F5222D', '#FFBF00', '#55cb72'];
const cols = {
  value: {
    min: -1,
    max: 1,
    tickInterval: 0.2,
    nice: true,
  },
};

export default class Gauge extends React.Component {

  render() {
    const val = this.props.score;
    const data = [
      { value: this.props.score },
    ];
    return (
      <Chart height={375} data={data} scale={cols} padding={[0, 0, 50, 0]} forceFit>
        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75} />
        <Legend position="right" dy={-20}/>
        <Axis
          name="value"
          zIndex={2}
          line={null}
          label={{
            offset: -20,
            textStyle: {
              fontSize: 18,
              fill: '#CBCBCB',
              textAlign: 'center',
              textBaseline: 'middle',
            },
          }}
          tickLine={{
            length: -24,
            stroke: '#fff',
            strokeOpacity: 1,
          }}
        />
        <Axis name="1" visible={false} />
        <Guide>
          <Arc
            zIndex={1}
            start={[-1, 0.965]}
            end={[-0.05, 0.965]}
            style={{ // 底灰色
              stroke: color[0],
              lineWidth,
            }}
          />
          <Arc
            zIndex={1}
            start={[-0.05, 0.965]}
            end={[0.05, 0.965]}
            style={{ // 底灰色
              stroke: color[1],
              lineWidth,
            }}
          />
          <Arc
            zIndex={1}
            start={[0.05, 0.965]}
            end={[1, 0.965]}
            style={{ // 底灰色
              stroke: color[2],
              lineWidth,
            }}
          />
          <Html
            position={['50%', '95%']}
            html={() => (`<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.75em; color: rgba(0,0,0,0.43);margin: 0;">Score</p><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">${parseFloat(val).toFixed(2)}</p></div>`)}
          />
        </Guide>
        <Geom
          type="point"
          position="value*1"
          shape="pointer"
          color="#1890FF"
          active={false}
          style={{ stroke: '#fff', lineWidth: 1 }}
        />
      </Chart>
    );
  }
}