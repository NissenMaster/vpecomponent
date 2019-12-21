import React from 'react';
import { Popover, Icon, Tooltip } from 'antd';
import { CHARTS_LIST, COMMON_LIST, LAYOUT_LIST, MEDIUM_LIST, OTHER_LIST, STAR_LIST } from "../DefaultConfig";

/**
 * PopoverIcon.js
 *
 * @author nissen
 * @version 2019.12.02
 * @description 组件选择控件，根据类型来进行组件内容筛选
 */

const PopoverIcon = ({ iconType, onClick }) => {
  return (
    <Popover
      placement="bottom"
      title={getTitle(iconType)}
      content={<Content onClick={onClick} type={iconType} />}
      trigger="click"
    >
      <Tooltip title={getTitle(iconType)}>
        <div className="icon-cell">
          <Icon style={{ fontSize: 18 }} type={iconType} />
        </div>
      </Tooltip>
    </Popover>
  );
};

// 气泡框内容
const Content = ({ onClick, type }) => {
  return getComponentList(type).map(({ key, title, type }) => {
    return (
      <div className="select-option" key={key || type} onClick={() => onClick(type, title)}>
        <Icon type={type} style={{ marginRight: 8 }} />
        {title}
      </div>
    );
  });
};

// 获取该类型下的组件列表
const getComponentList = type => {
  switch (type) {
    case 'layout' :
      return LAYOUT_LIST;
    case 'radar-chart' :
      return CHARTS_LIST;
    case 'font-size' :
      return COMMON_LIST;
    case 'fund' :
      return MEDIUM_LIST;
    case 'star':
      return STAR_LIST;
    case 'dash':
      return OTHER_LIST;
    default:
      return CHARTS_LIST;
  }
};

// 获取类型对应的标题
const getTitle = type => {
  switch (type) {
    case 'layout' :
      return '模板';
    case 'radar-chart' :
      return '图表';
    case 'font-size' :
      return '基础组件';
    case 'fund' :
      return '媒体';
    case 'star':
      return '业务组件';
    case 'dash':
      return '其他';
    default:
      return '模板';
  }
};

export default React.memo(PopoverIcon);