import React, { PureComponent } from 'react';
import { TITLE_HEIGHT } from "../DefaultConfig";
import { setOption } from "../Utils/utils";
import { defaultPieOption } from "../Utils/ComponentDefaultData";

const echarts = require('echarts');

/**
 * PieCharts.js
 * 饼图通用组件
 * @author nissen
 * @version 2019.11.27
 * @description
 */
export default class PieCharts extends PureComponent {
  chartRef = React.createRef();

  chart = {};

  state = {
    height: `calc(100% - ${TITLE_HEIGHT}px)`,
    width: '100%',
  };

  componentDidMount() {
    this.chart = echarts.init(this.chartRef.current);
    this.drawChart();
    window.addEventListener('resize', () => this.resize(this.chart));
  }

  resize = chart => {
    setOption(this.props.option, chart, defaultPieOption);
    chart && chart.resize();
  };

  // 区域大小自适应重绘 charts 方法
  rerender = ({ height = `calc(100% - ${TITLE_HEIGHT}px)`, width = '100%' }) => {
    this.setState(() => {
      return { height, width }
    }, () => {
      this.resize(this.chart);
    });
  };

  drawChart = () => {
    this.chart.showLoading({ text: '正在努力加载数据…' });
    this.chart.hideLoading();
    setOption(this.props.option, this.chart, defaultPieOption);
  };

  render() {
    const { height, width } = this.state;

    return <div ref={this.chartRef} style={{ height, width }} />;
  }
}
