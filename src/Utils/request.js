/**
 * request.js
 * @author nissen
 * @version 2019.12.04
 * @description axios 相关的简易封装
 */
import { message } from 'antd';

const axios = require('axios');

const baseUrl = 'http://172.16.8.77:3001';

// 确认是否走基础路径
const checkUrl = url => url.startsWith('http') ? url : `${baseUrl}${url}`;

// 查询 get
export const fetchRequest = (url, data) => {
  return axios.get(checkUrl(url), { params: data }).catch(error => message.error(`请检查接口路径是否正确！${error}`));
};

// 新建 post
export const postRequest = (url, data) => {
  return axios.post(checkUrl(url), data);
};

// 修改 put
export const putRequest = (url, data) => {
  return axios.put(checkUrl(url), data);
};

// 删除 delete
export const deleteRequest = (url, data) => {
  return axios.delete(checkUrl(url), data);
};

// 请求拦截器
axios.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error);
});