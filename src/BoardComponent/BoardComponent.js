import React from "react";
import map from "lodash/map";
import keyBy from 'lodash/keyBy';
import reject from 'lodash/reject';
import { Icon, message, Slider, Input, Tabs } from 'antd';
import { WidthProvider, Responsive } from "react-grid-layout";
import './styles.css';
import './BoardComponent.css';
import PieCharts from "../Components/PieCharts";
import BarCharts from '../Components/BarCharts';
import LineCharts from "../Components/LineCharts";
import {
  ACTION_MENUS,
  CELL_HEIGHT,
  CELL_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_LG, DEFAULT_PRO,
  DEFAULT_ROW_HEIGHT, DEFAULT_WIDTH,
  TITLE_HEIGHT
} from "../DefaultConfig";
import { TitleTag, TooltipIcon, getOptionFormData, destructuring, mergeToItems } from "../Utils/utils";
import PopoverIcon from "./PopoverIcon";
import DataSourceForm from "./DataSourceForm";
import { optimizeRes } from "../Utils/responseUtils";
import { getDefaultData, bossOption } from "../Utils/ComponentDefaultData";
import PageGlobalForm from "./PageGlobalForm";
import TableComponent from "../Components/TableComponent/TableComponent";
import ShareModal from './ShareModal'
import BarForm, { defaultOption } from "../From/components/BarForm";

const { TabPane } = Tabs;
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// 默认百分比
const defaultPercent = 74;

const pageDefaultConfig = {
  lg: DEFAULT_LG, // 栅格数
  rowHeight: DEFAULT_ROW_HEIGHT, // 栅格高度
  componentList: [], // 组件列表
  menuUrl: '/demo', // 菜单路径
  bgUrl: '', // 看板背景图
  backgroundColor: '#161719', // 看板背景颜色
  height: 1080,
  width: 1920,
};

/**
 * BoardComponent.js
 *
 * @author nissen
 * @version 2019.11.26
 * @description
 */
export default class BoardComponent extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: DEFAULT_LG, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: DEFAULT_ROW_HEIGHT,
  };
  // 数据源配置数据
  dataSourceConfig = {};
  // 缓存页面渲染组件的 ref 数组
  childRefMap = {};
  // 缓存组件所在区域的 ref 数组（为了精确内部组件的重绘）
  boardRefMap = {};

  constructor(props) {
    super(props);
    this.state = {
      items: [], // 画布组件，包含组件布局信息等
      pageConfig: pageDefaultConfig, // 画布数据
      hbWidth: DEFAULT_HEIGHT * (defaultPercent / 100), // 画布宽度 todo：暂时没启用
      hbHeight: DEFAULT_HEIGHT * DEFAULT_PRO * (defaultPercent / 100), // 画布高度 todo：暂时没启用
      percent: defaultPercent, // 画布缩放比例，默认 74%
      selectedComponent: [], // 已选组件信息，用于左侧操作栏
      currentType: '', // 正在操作的组件类型(用于对应右侧表单结构)
      currentIndex: 'globalForm', // 正在操作的组件 key 值
      formOption: getOptionFormData(bossOption),
      shareModal: false,
    };
  }

  // 存储画布布局数据
  handleSaveData = () => {
    const { items = [], layout = [], pageConfig } = this.state;
    if (items.length === 0) {
      return message.warning('请先对画布进行编辑，在进行数据保存！');
    }
    const layoutMap = keyBy(layout, 'i');
    const resultList = items.map(ele => ({
      ...ele,
      ...layoutMap[ele.i],
      dataConfig: this.dataSourceConfig[ele.i],
    }));
    localStorage.setItem('BoardComponent', JSON.stringify({ ...pageConfig, componentList: resultList }));
    return message.success('数据保存成功！');
  };

  // 打开组件内的预览页面
  handleToReview = () => window.open('/demo');

  // 渲染组件元素
  createElement = (el, index) => {
    return (
      <div
        key={el.i}
        data-grid={el}
        ref={ref => (this.changeRefList(ref, el.i, 'boardRefMap'))}
        style={{ backgroundColor: 'rgb(33, 33, 36)' }}
      >
        <div className="title">
          {el.areaTitle}
          <Icon onClick={() => this.onRemoveItem(el.i)} className="close" type="close" />
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

  // 根据类型选择渲染对应的组件， todo：后期考虑剥离出去
  getComponent = (type, key, option) => {
    switch (type) {
      case 'bar-chart':
        return <BarCharts option={option} ref={ref => (this.changeRefList(ref, key, 'childRefMap'))} />;
      case 'pie-chart':
        return <PieCharts option={option} ref={ref => (this.changeRefList(ref, key, 'childRefMap'))} />;
      case 'line-chart':
        return <LineCharts option={option} ref={ref => (this.changeRefList(ref, key, 'childRefMap'))} />;
      case 'input':
        return <Input defaultValue="434343" />;
      case 'table':
        return <TableComponent />;
      default:
        return <BarCharts ref={ref => (this.changeRefList(ref, key, 'childRefMap'))} />;
    }
  };

  // 点击菜单时，在页面新加一层组件
  handleMenuClick = (type, title) => {
    this.setState(({ items = [], selectedComponent }) => {
      // 稍作处理：将最后一位的 i 即 key 值自增1 给下一位用，避免删除后重复
      const data = items[items.length - 1] || { i: 0 };
      return {
        items: [
          ...items,
          {
            i: String(Number(data.i || 0) + 1),
            x: (items.length * CELL_WIDTH) % (this.state.cols || DEFAULT_LG),
            y: Infinity,
            w: CELL_WIDTH,
            h: CELL_HEIGHT,
            type,
            // todo： 临时增加
            areaTitle: bossOption.areaTitle,
            option: getDefaultData(type), // 图标配置项
            dataConfig: {},
          },
        ],
        selectedComponent: [...selectedComponent, { key: String(Number(data.i || 0) + 1), title, type }],
        currentType: type,
        currentIndex: String(items.length),
      }
    });
  };

  // 布局变更调用
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  };

  // 布局变更调用
  onLayoutChange = layout => {
    this.setState(state => {
      return {
        ...state,
        layout: layout,
      }
    });
  };

  // 移除一个元素组件
  onRemoveItem = i => {
    delete this.dataSourceConfig[i];
    delete this.childRefMap[i];
    delete this.boardRefMap[i];
    this.setState(({ selectedComponent, items }) => ({
      items: reject(items, { i: i }),
      selectedComponent: reject(selectedComponent, { key: String(i) }),
    }));
  };

  // 尺寸变更，同步更新组件视图
  onResize = (a, b) => {
    const currentData = keyBy(a, 'i')[b.i] || {};
    const currentGrid = this.boardRefMap[currentData.i];
    const { rerender } = this.childRefMap[currentData.i] || {};
    rerender && rerender({
      height: currentGrid.offsetHeight - TITLE_HEIGHT,
      width: currentGrid.offsetWidth,
    });
  };

  // 当尺寸变更结束时，调动一次重绘
  onResizeStop = (a, b) => this.onResize(a, b);

  // 当滑块和上下图标发生变化是，进行显示比例更新和图表重绘
  handleSliderChange = value => {
    this.setState({
      percent: value < 51 ? 51 : value,
    }, () => {
      // 遍历重绘图表
      Object.entries(this.childRefMap).forEach(([key, value]) => {
        const { offsetHeight, offsetWidth } = this.boardRefMap[key];
        value && value.rerender && value.rerender({
          height: offsetHeight - TITLE_HEIGHT,
          width: offsetWidth,
        });
      });
    });
  };

  handleOptionChange = fileds => {
    this.setState(({ formOption, items, currentIndex }) => {
      const newFormOption = { ...formOption, ...fileds };
      const itemsList = items.map(item => item.i === currentIndex
        ? { ...item, areaTitle: destructuring(newFormOption).areaTitle, option: mergeToItems(fileds, item) }
        : item
      );
      if (currentIndex && currentIndex !== '') {
        const value = this.childRefMap[currentIndex];
        const { offsetHeight, offsetWidth } = this.boardRefMap[currentIndex];
        value && value.rerender && value.rerender({
          height: offsetHeight - TITLE_HEIGHT,
          width: offsetWidth,
        });
      }
      return { formOption: { ...formOption, ...fileds }, items: itemsList };
    });
  };

  // 根据接口或者 Json 数据进行图标数据更新
  handleChangeDataSource = optionRes => {
    this.setState(({ items, currentType, currentIndex }) => {
      const currentComponent = items.filter(ele => ele.i === currentIndex)[0] || {};
      const res = optimizeRes(currentType, optionRes, currentComponent.option || getDefaultData(currentType));
      return {
        items: items.map(
          ele => ele.i === currentIndex ? { ...ele, option: { ...ele.option || {}, ...res } } : ele
        ),
      };
    }, () => {
      const { currentIndex } = this.state;
      if (currentIndex && currentIndex !== '') {
        const value = this.childRefMap[currentIndex];
        const { offsetHeight, offsetWidth } = this.boardRefMap[currentIndex];
        value && value.rerender && value.rerender({
          height: offsetHeight - TITLE_HEIGHT,
          width: offsetWidth,
        });
      }
    });
  };

  // 根据布局数据变更渲染页面
  getPageConfig = data => {
    const result = {};
    const { pageConfig } = this.state;
    // todo： 出现警告
    Object.keys(data).forEach(key => Object.assign(result, { [key]: pageConfig[key] }));
    if (JSON.stringify(data) !== JSON.stringify(result)) {
      this.setState(({ pageConfig }) => {
        return { pageConfig: { ...pageConfig, ...data } };
      });
    }
  };

  // 根据数据源表单配置项的变动，更新数据源数据，并进行统一暂存
  getDataSource = data => {
    const { currentIndex } = this.state;
    Object.assign(this.dataSourceConfig, {
      [currentIndex]: data,
    });
  };

  // 更新正在编辑组件的类型
  handleClickButton = (key, type) => this.setState({ currentType: type, currentIndex: key });


  // 还原为全局表单
  changeCurrentIndex = () => this.setState({ currentIndex: 'globalForm' });

  // 渲染已选组件，左侧菜单栏
  renderSelectedComponent = (selectedComponent = []) => {
    return selectedComponent.map(button => {
      const { currentIndex } = this.state;
      const { key, title, type } = button;
      return (
        <div
          className="selected-option"
          key={key || type}
          onClick={() => this.handleClickButton(key, type)}
          style={currentIndex === key ? { backgroundColor: '#303640', borderRight: '4px solid cadetblue' } : {}}
        >
          <Icon type={type} style={{ marginRight: 8 }} />
          {`${title}${Number(key) + 1}`}
        </div>
      );
    })
  };

  render() {
    const { percent, selectedComponent, pageConfig, currentIndex, formOption, currentType } = this.state;

    return (
      <div style={{ height: '100vh', backgroundColor: 'black' }}>
        <ShareModal visible={this.state.shareModal} onCancel={() => this.setState({ shareModal: false })} />
        <div style={{ width: '100vw', display: 'flex', backgroundColor: '#1d1e1f', color: '#eaeaea' }}>
          <div className="go-back">
            <TooltipIcon iconType="left" text="返回" />
          </div>
          <div className="recourse-menu">
            {ACTION_MENUS.map(menu => {
              return <PopoverIcon key={menu} iconType={menu} onClick={this.handleMenuClick} />;
            })}
          </div>
          <div className="files">
            <div className="icon-cell" style={{ width: 'auto', padding: 4 }} onClick={this.changeCurrentIndex}>
              文件名
            </div>
          </div>
          <div className="action-content">
            <div className="icon-cell" onClick={this.handleSaveData}>
              <Icon style={{ fontSize: 18 }} type="save" />
            </div>
            <div className="icon-cell" onClick={this.handleToReview}>
              <Icon style={{ fontSize: 18 }} type="desktop" />
            </div>
            <div className="icon-cell" onClick={() => this.setState({ shareModal: true })}>
              <Icon style={{ fontSize: 18 }} type="share-alt" />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div className="recourse">
            <div className="layout-title">
              <TitleTag iconType="container" text="已选组件" />
            </div>
            {this.renderSelectedComponent(selectedComponent)}
          </div>
          <div>
            <div className="main-content">
              <div style={{
                backgroundColor: pageConfig.backgroundColor,
                transform: `translate(-242px, -112px) scale(${percent / 100})`,
                height: DEFAULT_HEIGHT,
                width: DEFAULT_WIDTH,
              }}>
                <ResponsiveReactGridLayout
                  transformScale={percent / 100}
                  onResize={this.onResize}
                  onResizeStop={this.onResizeStop}
                  onLayoutChange={this.onLayoutChange}
                  onBreakpointChange={this.onBreakpointChange}
                  {...this.props}
                >
                  {map(this.state.items, (el, index) => this.createElement(el, index))}
                </ResponsiveReactGridLayout>
              </div>
            </div>
            <div style={{ width: '100vw - 480px' }}>
              <div className="footer-action">
                <span className="percent">{`${percent} %`}</span>
                <div onClick={() => this.handleSliderChange(percent + 1)} className="percent-action">
                  <Icon style={{ fontSize: 22, color: 'white' }} type="caret-up" />
                </div>
                <div onClick={() => this.handleSliderChange(percent - 1)} className="percent-action">
                  <Icon style={{ fontSize: 22, color: 'white' }} type="caret-down" />
                </div>
                <Slider min={51} style={{ width: 150 }} onChange={this.handleSliderChange} value={percent} />
              </div>
            </div>
          </div>
          <div className="setting">
            <div className="layout-title">
              <TitleTag iconType="setting" text="数据配置" />
            </div>
            {currentIndex !== 'globalForm' ? (
              <Tabs defaultActiveKey="1">
                <TabPane tab={<span style={{ fontSize: 16 }}><Icon type="bars" />配置项</span>} key="1">
                  {currentType === 'bar-chart' ? <BarForm
                    onChange={this.handleOptionChange}
                    formData={formOption}
                  /> : null}
                </TabPane>
                <TabPane tab={<span style={{ fontSize: 16 }}><Icon type="database" />数据源</span>} key="2">
                  <DataSourceForm
                    getDataSource={this.getDataSource}
                    handleChangeDataSource={this.handleChangeDataSource}
                  />
                </TabPane>
              </Tabs>
            ) : <PageGlobalForm getPageConfig={this.getPageConfig} />}
          </div>
        </div>
      </div>
    );
  }
}