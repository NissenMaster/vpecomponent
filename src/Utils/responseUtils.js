/**
 * responseUtils.js
 *
 * @author nissen
 * @version 2019.12.06
 * @description  用于根据类型区分各类图表返回值的数据处理方法
 */
export const optimizeRes = (type, res, option) => {
  switch (type) {
    case 'bar-chart':
    case 'line-chart':
      return optimizeBarChart(res, option);
    case 'pie-chart':
      return optimizeBarChart(res, option);
    default:
      return optimizeBarChart(res, option);
  }
};

// 优化图表数据返回值
const optimizeBarChart = (res, option) => {
  const data = res.data || {};
  const series = data.series && data.series.length > 0
    ? data.series.map((item, index) => ({ ...option.series[index] || {}, ...item }))
    : [];
  let legendData = [];
  // 如果是有图例的情况则进行数据筛选
  if (option.legend && option.legend.show) {
    series.forEach(item => item.name && legendData.push(item.name));
  }
  return {
    ...option,
    series,
    legend: { ...option.legend || {}, data: legendData },
    xAxis: option.xAxis ? { ...option.xAxis || {}, ...data.xAxis || {} } : void 0,
    yAxis: option.yAxis ? { ...option.yAxis || {}, ...data.yAxis || {} } : void 0,
  };
};