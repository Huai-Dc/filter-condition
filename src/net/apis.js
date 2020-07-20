/**
 * Created by huai on 2019-08-01
 */
'use strict';

export default {
    'baseHost': process.env.NODE_ENV === 'development' ? 'http://59.61.72.38:8000' :  'http://192.168.1.114:8005',
    'analyse': '/api/Enterprise/enterprise/analyse',
}
