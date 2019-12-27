import React from 'react';
import { Tooltip, Icon } from 'antd';
import mapValues from 'lodash/mapValues';
import moment from 'moment';

/**
 * utils.js
 * 工具类
 * 存放相关的通用方法和通用无状态组件和工具方法
 * @author nissen
 * @version 2019.12.02
 * @description
 */

// Icon 增加提示
export const TooltipIcon = ({ text, iconType, style = {} }) => {
  return (
    <Tooltip title={text}>
      <Icon type={iconType || 'check'} style={style} />
    </Tooltip>
  );
};

// 标题
export const TitleTag = ({ text, iconType }) => (
  <div>
    <Icon type={iconType} style={{ marginRight: 8 }} />
    {text}
  </div>
);

// 设置图标 option
export const setOption = (option, chart, defaultOption) => {
  const resizeOption = option && JSON.stringify(option) !== '{}' ? option : defaultOption;
  chart.setOption && chart.setOption(resizeOption);
};

export const destructuring = (params, defaultString = false) =>
  mapValues(params, item => {
    if (defaultString) {
      return getFormItemValue(item) || '';
    }
    const result = item && (typeof item === 'object' && !Array.isArray(item)) ? item.value : item;
    return removeSearchFLSpace(result);
  });

export const getFormItemValue = formValue =>
  removeSearchFLSpace(isFieldsValue(formValue) ? formValue.value : formValue);

export const removeSearchFLSpace = data => {
  return typeof data === 'string' ? data.trim() : data;
};

function isFieldsValue(value) {
  return value && typeof value === 'object' && !(value instanceof moment) && 'value' in value;
}

/**
 * 根据 ':' 对对象的 key 值进行拼接成 option 表单需要的样子
 * @param data
 */
export const getOptionFormData = data => {
  const result = {};
  Object.keys(data).forEach(item => {
    const value = data[item] || {};
    if (Object.prototype.toString.call(value) === '[object Object]') {
      Object.keys(value).forEach(key => {
        Object.assign(result, {
          [`${item}:${key}`]: value[key],
        });
      });
    } else {
      Object.assign(result, {
        [item]: data[item],
      });
    }
  });
  return result;
};

/**
 * 根据 “:” 拆分单个对象
 * @param fileds 单个对象， key 值只能有一个
 * @returns {Object}
 */
export const getFildsParams = fileds => {
  let result = {};
  Object.entries(destructuring(fileds)).forEach(([key, value]) => {
    if (key.includes(':')) {
      const [paramKey, valueKey] = key.split(':');
      result = {
        [paramKey]: {
          [valueKey]: value,
        },
      };
    } else result = { [key]: fileds[key].value || fileds[key] };
  });
  return result;
};

/**
 * 将数组中对象的某一属性对应的数据替换成传入的数据
 * @param data
 * @param templateData
 * @returns {Object}
 */
export const mergeToItems = (data, templateData) => {
  const newData = getFildsParams(data);
  let result = {};
  const { option } = templateData;
  Object.keys(data).forEach(dataKey => {
    if (dataKey.includes(':')) {
      const [paramKey, valueKey] = dataKey.split(':');
      result = {
        ...option,
        [paramKey]: {
          ...option[paramKey],
          [valueKey]: newData[paramKey][valueKey],
        }
      }
    } else {
      result = { ...option, ...newData }
    }
  });
  return result;
};
