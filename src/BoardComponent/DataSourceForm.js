import React from 'react';
import { Input, message, Button, Switch, InputNumber } from 'antd';
import { fetchRequest } from "../Utils/request";
import JsonOptionForm from "./JsonOptionForm";

const { Search } = Input;

export const dataConfig = {
  isRefresh: false, // 是否自动刷新
  refreshInterval: 10, // 刷新间隔
  isHasJson: false, // 是否配置 json
  dataUrl: '', // 接口路径
  jsonData: {}, // json 数据（转换后）
};
/**
 * DataSourceForm.js
 *
 * @author nissen
 * @version 2019.12.04
 * @description
 */

const DataSourceForm = ({ handleChangeDataSource, getDataSource }) => {
  // 接口调试输入值
  const [value, setValue] = React.useState('');
  // 测试 loading
  const [loading, setLoading] = React.useState(false);
  // json 弹窗开关
  const [jsonForm, setJsonForm] = React.useState(false);
  // 是否开启定时刷新
  const [switchFlag, setSwitchFlag] = React.useState(false);
  // 定时刷新时间间隔
  const [timeInterval, setTimeInterval] = React.useState(10);
  // json 配置开关
  const [jsonSetting, setJsonSetting] = React.useState(false);
  // jsonData Json数据
  const [jsonData, setJsonData] = React.useState({});

  const testInterface = async () => {
    if (value === '') {
      return message.warning('请先填写数据来源路径！')
    }
    setLoading(true);
    const res = await fetchRequest(value);
    handleChangeDataSource(res);
    setLoading(false);
  };

  // 将代码编辑器内的数据处理存储
  const handleOk = value => {
    let codeData = {};
    try {
      codeData = Function('"use strict";return (' + value + ')')()
    } catch (e) {
      return message.error(`请确认输入的数据是否符合格式要求！ ${e}`);
    }
    handleChangeDataSource(codeData);
    setJsonData(codeData);
    handleCancel();
  };

  //  关闭代码编辑器弹窗
  const handleCancel = () => setJsonForm(false);

  getDataSource && getDataSource({
    ...dataConfig,
    isRefresh: switchFlag,
    isHasJson: jsonSetting,
    jsonData,
    refreshInterval: timeInterval,
    dataUrl: value,
  });

  return (
    <div style={{ marginTop: -8, padding: '0px 8px' }}>
      <JsonOptionForm visible={jsonForm} onOk={handleOk} onCancel={handleCancel} />
      <Search
        enterButton="测试"
        placeholder="请输入数据接口路径"
        loading={loading}
        value={value}
        onChange={e => setValue(e.target.value)}
        onSearch={testInterface}
      />
      <div style={{ display: 'flex', marginTop: 16, color: '#fff' }}>
        <div style={{ display: 'flex', padding: 4 }}>
          <label>静态JSON：</label>
          <Switch checkedChildren="开" unCheckedChildren="关" onChange={e => setJsonSetting(e)} checked={jsonSetting} />
        </div>
        {jsonSetting ? (
          <Button style={{ marginLeft: 8 }} onClick={() => setJsonForm(true)}>配置JSON</Button>
        ) : null}
      </div>
      <div style={{ display: 'flex', marginTop: 16, color: '#fff' }}>
        <label>定时刷新开关：</label>
        <Switch checkedChildren="开" unCheckedChildren="关" onChange={e => setSwitchFlag(e)} checked={switchFlag} />
      </div>
      {switchFlag ? (
        <div style={{ display: 'flex', marginTop: 16, color: '#fff' }}>
          <label style={{ padding: 4 }}>刷新间隔(秒)：</label>
          <InputNumber min={10} value={timeInterval} onChange={e => setTimeInterval(e)} />
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(DataSourceForm);