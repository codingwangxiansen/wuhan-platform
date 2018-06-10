/**
 * Created by wangjunfei on 2018/1/6.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

// 404页面
import NotFoundComponent from 'components/mycomponents/NotFoundComponent'

// 首页
// import Index from 'components/inforeport/Index'

import register from './register' // 用户注册模块
import user from './user' // 用户管理模块
import communicate from './communicate/communicate' // 通讯录模块
import push from './push' // 消息中心模块
import demo from './demo' // 测试用
import announcement from './announcement/announcement' // 通知公告

import report from './eventInfo/report' // 信息接报--上报模块
import check from './eventInfo/check' // 信息接报--审核模块
import deal from './eventInfo/deal' // 信息接报--办理模块
import instruction from './eventInfo/instruction' // 信息接报--批示模块
import statistics from './eventInfo/statistics'
import eventInfoSupervise from './eventInfo/supervise' // 信息接报--批示模块
// 启用路由
Vue.use(VueRouter)

// 定义一个能够被 Webpack 自动代码分割的异步组件
const Index = () => import('components/inforeport/Index')
const LeaderSelectorPage = () => import('components/gsafetycomponents/LeaderSelectorPage')
const OrgSelectorPage = () => import('components/gsafetycomponents/OrgSelectorPage')
const EventTypeSelector = () => import('components/gsafetycomponents/EventTypeSelector')
const DistrictSelector = () => import('components/gsafetycomponents/DistrictSelector')
const AttachView = () => import('components/gsafetycomponents/AttachView')
const SignListPage = () => import('components/gsafetycomponents/SignListPage')
const ErrorView = () => import('components/gsafetycomponents/ErrorView')
/* 首页 */
const index = [
  {
    path: '*', // 404页面
    component: NotFoundComponent
  }, {
    path: '/', // 首页
    component: Index,
    meta: {
      title: '武汉市应急值班平台'
    }
  }, {
    path: '/leaderSelect', // 选择领导页面
    name: 'LeaderSelect',
    component: LeaderSelectorPage,
    meta: {
      title: '选择领导'
    }
  }, {
    path: '/orgSelect', // 选择机构页面
    name: 'OrgSelect',
    component: OrgSelectorPage,
    meta: {
      title: '选择机构'
    }
  }, {
    path: '/eventTypeSelect', // 选择事件类型页面
    name: 'eventTypeSelect',
    component: EventTypeSelector
  }, {
    path: '/districtSelector', // 选择地区页面
    name: 'districtSelector',
    component: DistrictSelector
  }, {
    path: '/attachView', // 附件查看页面
    name: 'AttachView',
    component: AttachView
  }, {
    path: '/signList', // 签收机构页面
    name: 'SignListPage',
    component: SignListPage
  }, {
    path: '/error', // 跳转路由报错页面
    name: 'ErrorView',
    component: ErrorView
  }]

const routers = index.concat(register, user, push, report, check, deal,
  instruction, statistics, demo, communicate, announcement, eventInfoSupervise)

const router = new VueRouter({
  routes: routers
})
// 切换路由的时候改变title
router.beforeEach((to, form, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router
