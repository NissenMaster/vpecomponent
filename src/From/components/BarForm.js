import React, { PureComponent } from 'react';
import mapValues from 'lodash/mapValues';
import { Form, Switch, Collapse, Input, Select } from 'antd';
import moment from 'moment';
import './BarForm.css';

const { Panel } = Collapse;
const { Option } = Select;
export const defaultOption = {
  areaTitle: '简易柱形图',
  changeXY: false,
  showInTop: true,
  showTitle: true,
  title: '标题',
  fontSize: 14,
  subTitle: '副标题',
  showX: true,
  showXOption: 'bottom',
  showY: true,
  showYOption: 'left',
  showLegend: true,
  type: 'scroll',
  showTooltip: true,
};

/**
 * BarForm.js
 *  柱形图 配置项 option 数据录入表单
 * @author Nissen
 * @version 2019.12.11
 * @description
 */
class BarForm extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="bar-form">
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          <label style={{ color: '#fff' }}>区域标题</label>
          {getFieldDecorator('areaTitle', {
            rules: [{ required: true, message: 'areaTitle is required!' }],
          })(<Input />)}
          {/*<div style={{ display: 'flex', marginTop: 8, color: '#fff' }}>*/}
          {/*  <label>XY轴互换：</label>*/}
          {/*  {getFieldDecorator('changeXY', {*/}
          {/*    valuePropName: 'checked',*/}
          {/*    rules: [{ required: true, message: 'Username is required!' }],*/}
          {/*  })(<Switch checkedChildren="开" unCheckedChildren="关" />)}*/}
          {/*</div>*/}
          {/*<div style={{ display: 'flex', marginTop: 8, marginBottom: 8, color: '#fff' }}>*/}
          {/*  <label>柱顶显示数据：</label>*/}
          {/*  {getFieldDecorator('showInTop', {*/}
          {/*    rules: [{ required: true, message: 'showInTop is required!' }],*/}
          {/*    valuePropName: 'checked',*/}
          {/*  })(<Switch checkedChildren="开" unCheckedChildren="关" />)}*/}
          {/*</div>*/}
          <Collapse defaultActiveKey={['0', '1', '2', '3', '4']}>
            <Panel header="标题设置" key="0">
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <label>是否显示标题：</label>
                {getFieldDecorator('title:show', {
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </div>
              <label>标题内容</label>
              {getFieldDecorator('title:text', {})(<Input style={{ marginBottom: 8 }} />)}
              {/*<label>标题字体大小</label>*/}
              {/*{getFieldDecorator('fontSize', {*/}
              {/*  rules: [{ required: true, message: 'showTitle is required!' }],*/}
              {/*})(<Input style={{ marginBottom: 8 }} />)}*/}
              <label>副标题内容</label>
              {getFieldDecorator('title:subtext', {})(<Input style={{ marginBottom: 8 }} />)}
            </Panel>
            <Panel header="X 轴设置" key="1">
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <label>是否显示X轴：</label>
                {getFieldDecorator('xAxis:show', {
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </div>
              <label>显示名称</label>
              {getFieldDecorator('xAxis:name', {
                rules: [{ required: true, message: 'name is required!' }],
              })(<Input style={{ marginBottom: 8 }} />)}
              <label>显示类型</label>
              {getFieldDecorator('xAxis:type', {
                rules: [{ required: true, message: 'type is required!' }],
              })(<Select style={{ marginBottom: 8 }}>
                <Option value="value">数值轴</Option>
                <Option value="category">类目轴</Option>
                <Option value="time">时间轴</Option>
                <Option value="log">对数轴</Option>
              </Select>)}
              <label>显示位置</label>
              {getFieldDecorator('xAxis:position', {
                rules: [{ required: true, message: 'position is required!' }],
              })(<Select style={{ marginBottom: 8 }}>
                <Option value="top">上方</Option>
                <Option value="bottom">下方</Option>
              </Select>)}
            </Panel>
            <Panel header="Y 轴设置" key="2">
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <label>是否显示Y轴：</label>
                {getFieldDecorator('yAxis:show', {
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </div>
              <label>显示名称</label>
              {getFieldDecorator('yAxis:name', {
                rules: [{ required: true, message: 'name is required!' }],
              })(<Input style={{ marginBottom: 8 }} />)}
              <label>显示类型</label>
              {getFieldDecorator('yAxis:type', {
                rules: [{ required: true, message: 'type is required!' }],
              })(<Select style={{ marginBottom: 8 }}>
                <Option value="value">数值轴</Option>
                <Option value="category">类目轴</Option>
                <Option value="time">时间轴</Option>
                <Option value="log">对数轴</Option>
              </Select>)}
              <label>显示位置</label>
              {getFieldDecorator('yAxis:position', {
                rules: [{ required: true, message: 'showTitle is required!' }],
              })(<Select style={{ marginBottom: 8 }}>
                <Option value="left">左侧</Option>
                <Option value="right">右侧</Option>
              </Select>)}
            </Panel>
            <Panel header="图例设置" key="3">
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <label>是否显示图例：</label>
                {getFieldDecorator('legend:show', {
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </div>
              <label>类型</label>
              {getFieldDecorator('legend:type', {
                rules: [{ required: true, message: 'showTitle is required!' }],
              })(<Select style={{ marginBottom: 8 }}>
                <Option value="plain">普通类型</Option>
                <Option value="scroll">含有滚动条</Option>
              </Select>)}
            </Panel>
            <Panel header="提示设置" key="4">
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <label>是否显示提示：</label>
                {getFieldDecorator('tooltip:show', {
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </div>
            </Panel>
          </Collapse>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return mapValues(props.formData, value =>
      Form.createFormField(isFieldsValue(value) ? value : { value })
    );
  },
})(BarForm);

function isFieldsValue(value) {
  return value && typeof value === 'object' && !(value instanceof moment) && 'value' in value;
}