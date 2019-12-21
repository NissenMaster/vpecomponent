/**
 * DefaultConfig.js
 * 用于存放通用配置常量
 * @author nissen
 * @version 2019.11.28
 * @description
 */

// 区域标题默认高度
export const TITLE_HEIGHT = 35;
// 操作板粒度
export const DEFAULT_LG = 56;
// 操作板粒度
export const DEFAULT_ROW_HEIGHT = 5;
// 增加组件默认占用格数
export const CELL_WIDTH = 16;
export const CELL_HEIGHT = 16;
// 画布默认尺寸
export const DEFAULT_HEIGHT = 1080;
export const DEFAULT_WIDTH = 1920;
// 画布默认比例
export const DEFAULT_PRO = 9 / 16;
// 操作菜单列表 内容必须是图标的类型，否则将使用默认图标   类型修改需和 PopoverIcon 内的类型同步
export const ACTION_MENUS = ['layout', 'radar-chart', 'font-size', 'fund', 'star', 'dash'];
// 图标组件列表
export const CHARTS_LIST = [{
  key: '1',
  title: '柱形图',
  type: 'bar-chart',
}, {
  key: '2',
  title: '饼图',
  type: 'pie-chart',
}, {
  key: '3',
  title: '折现图',
  type: 'line-chart',
}];
// 普通组件列表（表格等）
export const COMMON_LIST = [{
  key: '1',
  title: '输入框',
  type: 'input',
}, {
  key: '2',
  title: '表格',
  type: 'table',
}];
// 末班组件列表（常用布局等）
export const LAYOUT_LIST = [];
// 媒体组件列表（视频图片等）
export const MEDIUM_LIST = [];
// 业务组件列表（拥有制定业务的组件，例如异常统计、NCR等）
export const STAR_LIST = [];
// 其他组件列表
export const OTHER_LIST = [];