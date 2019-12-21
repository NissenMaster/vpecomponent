import React, { PureComponent } from 'react';
import { TITLE_HEIGHT } from "../DefaultConfig";
import { setOption } from "../Utils/utils";
import { defaultBarOption } from "../Utils/ComponentDefaultData";

const echarts = require('echarts');

/**
 * BarCharts.js
 * 柱状图通用组件
 * @author nissen
 * @version 2019.11.28
 * @description
 */
export default class BarCharts extends PureComponent {
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
    setOption(this.props.option, chart, defaultBarOption);
    chart && chart.resize();
  };

  rerender = ({ height = `calc(100% - ${TITLE_HEIGHT}px)`, width = '100%' }) => {
    this.setState(() => {
      return { height, width }
    }, () => {
      this.resize(this.chart);
    });
  };

  drawChart = () => {
    this.chart.showLoading({
      text: '正在努力加载数据…',
    });
    this.chart.hideLoading();
    setOption(this.props.option, this.chart, defaultBarOption);
  };

  render() {
    const { height, width } = this.state;

    return <div ref={this.chartRef} style={{ height, width }} />;
  }
}
