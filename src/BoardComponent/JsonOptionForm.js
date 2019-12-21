import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

/**
 * JsonOptionForm.js
 *
 * @author nissen
 * @version 2019.12.02
 * @description
 */
export default class JsonOptionForm extends PureComponent {
  state = {
    value: '',
  };

  onChange = e => {
    this.setState({ value: e })
  };

  render() {
    const { visible, onOk, onCancel } = this.props;
    const { value } = this.state;

    return (
      <Modal
        title="静态 Json 配置"
        visible={visible}
        okText="确定"
        cancelText="取消"
        onOk={() => onOk(value)}
        onCancel={onCancel}
        afterClose={() => this.onChange('')}
      >
        <AceEditor
          mode="java"
          theme="github"
          width="520"
          fontSize={14}
          setOptions={{
            showLineNumbers: true,
            tabSize: 2,
          }}
          value={value}
          onChange={this.onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      </Modal>
    );
  }
}