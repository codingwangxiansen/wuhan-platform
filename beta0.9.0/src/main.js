/**
 * Created by tangjingwen on 2018/1/4.
 * 信息接报模块
 */
import Vue from 'vue'
import App from 'src/App'
// 添加Fastclick移除移动端点击延迟
import FastClick from 'fastclick'
import INFO_CONST_URL from 'src/config/inforeport.json' // 引入URL常量
import INFO_CONST_REST from 'src/config/inforeportRest.json' // 引入REST常量
import COMMUNICATE_URL from 'src/datas/url_const.json' // 引入通讯录URL常量

import router from 'src/router'

// 引入状态管理
import store from 'src/store'

// 引入发送请求的对象
import Http from 'src/utils/http'

// 在main.js内
import VideoPlayer from 'vue-video-player'
// 引入表单验证
import './utils/Validate'

FastClick.attach(document.body)


Vue.use(VideoPlayer)
// 引入v-touch 支持滑动等手机端事件
// const VueTouch = require('vue-touch')
//
// Vue.use(VueTouch, { name: 'v-touch' })

Vue.prototype.axios = Http
Vue.prototype.$DEFAULT = INFO_CONST_URL // 在页面入口处将URL常量挂载到Vue实例上，所有页面通过VUE实例使用
Vue.prototype.$REST = INFO_CONST_REST // 在页面入口处将URL常量挂载到Vue实例上，所有页面通过VUE实例使用
Vue.prototype.$COMMUNICATE = COMMUNICATE_URL // 通讯录路径常量，先这么写，后面调整

// 异步获取事件类型  进入系统执行一次
store.dispatch('updateEventType')

// 异步设置系统里面的用户信息
store.dispatch('setUser')

// 异步设置系统里面的除本人以外的全部用户信息
store.dispatch('setAllUser')

// 异步设置系统里面的除本人以外的全部用户信息
store.dispatch('setGroupLeader')

// 异步获取全部文字模板
store.dispatch('getTextTemplate')

// 异步设置系统里面的除本人以外市级领导
store.dispatch('setCityLeader')

// 异步设置系统里面机构列表
store.dispatch('setOrgList')

// 异步加载领导分组数据
store.dispatch('updateOrgUserLeaderGroup')

/* eslint-disable no-new */
new Vue({
  store,
  router,
  // 挂载路由
  render: h => h(App)
}).$mount('#app')
