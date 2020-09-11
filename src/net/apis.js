/**
 * Created by huai on 2019-08-01
 */
'use strict';

export default {
    'baseHost': process.env.NODE_ENV === 'development' ? 'http://59.61.72.38:8000' :  'http://59.61.72.38:8000',
    'analyse': '/api/Enterprise/enterprise/analyse',
    'params': '/api/Enterprise/enterprise/params',  // 获取参数 省市区
    'exportExcel': '/api/Enterprise/enterprise/export', // 导出
}
