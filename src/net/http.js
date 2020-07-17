/**
 * Created by huai on 2019-08-01
 */
'use strict';

import axios from 'axios';
import { Spin, Message } from 'view-design'
// 此处加入 路由会导致路由渲染顺序滞后 造成导航不显示
// import store from '@/store'
// import router from '@/router'

axios.defaults.withCredentials = true; // 跨域请求时发送 cookies
axios.defaults.crossDomain = true;

/**
 * 拦截器
 * config 包含每次请求的内容
 */
axios.interceptors.request.use(config => {
    // config.headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    // };
    return config;
}, error => {
    return Promise.reject(error)
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.resolve(error.response);
});

/**
 * 检测返回状态
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 ||
            response.status === 400)) {
        return response
    }

    if (response && response.status === 500) {
        clearOverlayAndAlert("服务器异常，请联系管理员处理或刷新重试！");
        return {
            status: -500,
            msg: '服务器异常，请联系管理员处理或刷新重试！',
        }
    } else if (response && response.status === 401) {
        clearOverlayAndAlert("登录信息已过期，请重新登录！");

        // store.dispatch("LogOut").then( () =>{
        //     router.push({
        //         path: '/homeIndex'
        //     });
        // })

        return {
            status: -401,
            msg: '登录信息已过期，请重新登录！',
        }
    }
    // 异常状态下，把错误信息返回去
    clearOverlayAndAlert("网络异常");
    return {
        status: -404,
        msg: '网络异常'
    }
}

/**
 * 出现异常时清除遮罩 提示错误信息
 * @param msg
 */
function clearOverlayAndAlert(msg){
    Spin.hide();
    Message.error(msg);
}

/**
 * 处理异常状态码
 * @param res
 * @returns {*}
 */
function checkCode(res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404) {
        /// console.log(res.msg)
    }
    if (res.data && (!res.data.success)) {
        // alert(res.data.error_msg)
    }
    return res
}


// 请求方式的配置
export default {
    post(url, params, config) {  //  post
        let conf = {
            method: 'post',
            url:url,
            data: params, // qs.stringify() 将对象序列化成URL的形式以 & 拼接
            timeout: 10000,//10秒
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        if(!!config){
            Object.assign(conf.headers,config.headers||{});
            Object.assign(conf, config);
        }
        return axios(conf).then((response) => {
                return checkStatus(response)
            }
        ).then((res) => {
                return checkCode(res)
            }
        )
    },
    get(url, params, config) {  // get
        let conf = {
            method: 'GET',
            url:url,
            params:params, // get 请求时带的参数
            timeout: 10000,//10秒
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        if(!!config){
            Object.assign(conf.headers,config.headers||{});
            Object.assign(conf, config);
        }
        return axios(conf).then((response) => {
                return checkStatus(response)
            }
        ).then((res) => {
                return checkCode(res)
            }
        ).catch(error => {
            console.log('error');
            return checkCode(error);
        })
    }
}
