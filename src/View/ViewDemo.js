import React from "react";
import map from "lodash/map";
import { WidthProvider, Responsive } from "react-grid-layout";
import '../BoardComponent/styles.css';
import './ViewDemo.css';
import PieCharts from "../Components/PieCharts";
import BarCharts from '../Components/BarCharts';
import LineCharts from "../Components/LineCharts";
import { DEFAULT_LG, DEFAULT_ROW_HEIGHT, TITLE_HEIGHT } from "../DefaultConfig";
import { fetchRequest } from "../Utils/request";
import { optimizeRes } from "../Utils/responseUtils";
import { getDefaultData } from "../Utils/ComponentDefaultData";

const ResponsiveReactGridLayout = WidthProvider(Responsive);


/**
 * ViewDemo.js
 * 显示器
 * @author nissen
 * @version 2019.11.29
 * @description
 */
export default class ViewDemo extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: DEFAULT_LG, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: DEFAULT_ROW_HEIGHT,
  };

  mainRef = React.createRef();

  intervalList = [];

  childRefMap = {};

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      globalConfig: {},
    };
  }

  componentDidMount() {
    const { pathname } = window.location;
    const data = JSON.parse(localStorage.getItem('BoardComponent'));
    console.log(`data`, data)
    if (pathname === data.menuUrl) {
      const { componentList } = data;
      this.lxList(componentList);
      this.setState({ globalConfig: data })
    }
  }

  componentWillUnmount() {
    this.intervalList.forEach(interval => window.clearInterval(interval));
  }

  // 增加定时器轮询数据和固定数据渲染
  lxList = (list = []) => {
    list.forEach(async data => {
      if (data.dataConfig) {
        const { dataUrl, isRefresh, refreshInterval } = data.dataConfig || {};
        if (dataUrl && dataUrl !== '') {
          if (isRefresh) {
            const interval = setInterval(() =>
                fetchRequest(dataUrl).then(res => {
                  const result = optimizeRes(data.type, res || {}, data.option || getDefaultData(data.type));
                  this.setState({
                    items: list.map(
                      ele => ele.i === data.i ? { ...ele, option: { ...ele.option || {}, ...result } } : ele
                    ),
                  });
                  this.childRefMap[data.i].rerender({
                    height: `calc(100% - ${TITLE_HEIGHT}px)`,
                    width: '100%',
                  });
                }),
              refreshInterval * 1000);
            this.intervalList.push(interval);
          }
          const res = await fetchRequest(dataUrl);
          const result = optimizeRes(data.type, res || {}, data.option || getDefaultData(data.type));
          this.setState({
            items: list.map(
              ele => ele.i === data.type ? { ...ele, option: { ...ele.option || {}, ...result } } : ele
            ),
          });
        }
      } else {
        this.setState(({ items }) => ({ items: [...items, data] }));
      }
    });
  };

  createElement = (el, index) => {
    console.log(`el`, el)
    return (
      <div
        key={el.i}
        data-grid={el}
        style={{ backgroundColor: 'rgb(33, 33, 36)' }}
      >
        <div className="title">
          {el.areaTitle}
        </div>
        {this.getComponent(el.type, el.i, el.option)}
      </div>
    );
  };

  // 根据画布组件数据，记录画布内组件的 ref，便于绘制操作
  changeRefList = (ref, key, type) => {
    if (ref !== null && !Object.keys(this[type]).includes(ref)) {
      Object.assign(this[type], { [key]: ref });
    }
  };

  // 获取组件 todo：后期剥离
  getComponent = (type, key, option) => {
    switch (type) {
      case 'bar-chart':
        return <BarCharts ref={ref => (this.changeRefList(ref, key, 'childRefMap'))} option={option} />;
      case 'pie-chart':
        return <PieCharts ref={ref => (this.changeRefList(ref, key, 'childRefMap'))} option={option} />;
      case 'line-chart':
        return <LineCharts ref={ref => (this.changeRefList(ref, key, 'childRefMap'))} option={option} />;
      default:
        return <BarCharts ref={ref => (this.changeRefList(ref, key, 'childRefMap'))} option={option} />;
    }
  };

  render() {
    const { globalConfig: { height, width, backgroundColor }, items } = this.state;
    console.log(`items`, items)
    return (
      <div ref={this.mainRef} style={{ height, width, backgroundColor }}>
        <ResponsiveReactGridLayout
          isDraggable={false}
          isResizable={false}
          {...this.props}
        >
          {map(this.state.items, (el, index) => this.createElement(el, index))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
