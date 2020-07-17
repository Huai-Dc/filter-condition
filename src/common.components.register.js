/**
 * 公共组件注册
 * 高频组件
 */

import 'normalize.css'
import 'view-design/dist/styles/iview.css'
import './style/base.scss'

import Vue from 'vue'
import { Collapse, Icon, Panel, Spin, Message, Modal, Input } from 'view-design'
import http from "./net/http";
import apis from "./net/apis";
import md5 from "js-md5";


Vue.component('Collapse', Collapse)
Vue.component('Panel', Panel)
Vue.component('Icon', Icon)
Vue.component("Input", Input)
Vue.prototype.$Spin = Spin
Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal

Vue.prototype.$http = http;
Vue.prototype.$apis = apis;
Vue.prototype.$md5 = md5;
