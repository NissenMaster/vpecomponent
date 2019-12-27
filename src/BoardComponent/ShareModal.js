import React from 'react';
import { Modal, Result, Button, Input, Icon } from 'antd';
import ClipboardJS from 'clipboard';

const { TextArea } = Input;
const clipboard = new ClipboardJS('.copy');

/**
 * ShareModal.js
 *
 * @author nissen
 * @version 2019.12.20
 * @description
 */
const ShareModal = ({ visible, url, onCancel }) => {
  return (
    <Modal
      title="分享"
      visible={visible}
      footer={[
        <Button
          key="copy"
          className="copy"
          type="primary"
          onClick={onCancel}
          data-clipboard-action="cut"
          data-clipboard-target="#bar"
        >
          复制
        </Button>,
        <Button onClick={onCancel} key="cancel">
          取消
        </Button>
      ]}
    >
      <Result
        status="success"
        title="分享链接创建成功！"
        subTitle={<TextArea id="bar" value={url || 'http://172.16.8.77:3000/demo'} rows={1} />}
      />
    </Modal>
  );
};

export default ShareModal;
