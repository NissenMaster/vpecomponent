/**
 * ComponentDefaultData.js
 *
 * @author nisse
 * @version 2019.12.09
 * @description
 */
const textStyle = { color: '#fff' };
const axisLine = {
  lineStyle: {
    color: '#fff',
  },
};

export const bossOption = {
  areaTitle: '区域标题',
  title: {
    show: true,
    text: '标题',
    subText: '副标题',
    textStyle,
  },
  legend: {
    show: true,
    type: 'scroll',
    textStyle,
  },
  xAxis: {
    show: true,
    type: 'category', // 'value' 数值轴 'category' 类目轴 'time' 时间轴 'log' 对数轴
    name: '名称',
    position: 'bottom',
    axisLine,
  },
  yAxis: {
    show: true,
    type: 'value', // 'value' 数值轴 'category' 类目轴 'time' 时间轴 'log' 对数轴
    name: '名称',
    position: 'left',
    axisLine,
  },
  tooltip: {
    show: true,
  }
};

export const getDefaultData = type => {
  switch (type) {
    case 'bar-chart' :
      return defaultBarOption;
    case 'pie-chart' :
      return defaultPieOption;
    case 'line-chart' :
      return defaultLineOption;
    default:
      return defaultBarOption;
  }
};

export const defaultBarOption = {
  title: {
    text: '简易柱形图',
    textStyle,
  },
  legend: {
    textStyle,
  },
  textStyle,
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine,
  },
  yAxis: {
    type: 'value',
    axisLine,
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar'
  }],
  ...bossOption,
};

export const defaultLineOption = {
  title: {
    text: '折线图堆叠',
    textStyle,
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    show: true,
    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
    textStyle,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine,
  },
  yAxis: {
    type: 'value',
    axisLine,
  },
  series: [
    {
      name: '邮件营销',
      type: 'line',
      stack: '总量',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
  ]
};

export const defaultPieOption = {
  title: {
    text: '各类型流程任务比例',
    x: 'center',
    textStyle,
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: 'pro1' },
        { value: 310, name: 'pro2' },
        { value: 234, name: 'pro3' },
        { value: 135, name: 'pro4' },
        { value: 1548, name: 'pro4' },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};
