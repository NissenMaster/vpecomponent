import React from 'react';
import { Form, InputNumber, Button, Popover, Icon, Upload, message } from 'antd';
import { SketchPicker } from 'react-color';

/**
 * PageGlobalForm.js
 *
 * @author nissen
 * @version 2019.12.09
 * @description 画布整体布局数据配置，因为需要实时刷新，所以会调用父组件的 setState
 */
const PageGlobalForm = ({ getPageConfig }) => {
  const [config, setConfig] = React.useState({
    height: 1080,
    width: 1920,
    backgroundColor: '#161719',
    bgUrl: '',
  });

  const [imageUrl, setImageUrl] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e, key) => setConfig({ ...config, [key]: e });

  const handleChangeUpload = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        setLoading(false);
        setImageUrl({ ...config, bgUrl: imageUrl });
      });
    }
  };

  getPageConfig && getPageConfig(config);

  return (
    <div style={{ padding: '0px 8px', color: 'white' }}>
      <article>布局配置</article>
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
        <Form.Item label="宽度">
          <InputNumber
            style={{ width: '100%' }}
            value={config.width || 0}
            onChange={e => handleChange(e, 'width')}
          />
        </Form.Item>
        <Form.Item label="高度">
          <InputNumber
            style={{ width: '100%' }}
            value={config.height || 0}
            onChange={e => handleChange(e, 'height')}
          />
        </Form.Item>
        <label style={{ color: '#fff' }}>背景色：</label>
        <Popover
          placement="bottomRight"
          title="选择背景色"
          content={
            <SketchPicker
              width={240}
              color={config.backgroundColor}
              onChange={e => handleChange(e.hex, 'backgroundColor')}
            />
          }
          trigger="click"
        >
          <Button
            style={{ backgroundColor: config.backgroundColor, width: '100%', marginBottom: 16 }}
          >
            {config.backgroundColor}
          </Button>
        </Popover>
        <label style={{ color: '#fff' }}>背景图片：</label>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChangeUpload}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton(loading)}
        </Upload>
      </Form>
    </div>
  );
};

export default React.memo(PageGlobalForm);

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只可以上传 JPG/PNG 两种格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('上传图片的大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const uploadButton = loading => (
  <div>
    <Icon type={loading ? 'loading' : 'plus'} />
    <div className="ant-upload-text">Upload</div>
  </div>
);
