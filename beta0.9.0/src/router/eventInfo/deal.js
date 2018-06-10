/**
 * Created by wjf on 2018/2/6.
 * 信息接报--信息办理模块路由
 */
const DealList = () => import('components/inforeport/eventInfo/deal/DealList')
const InstructInfo = () => import('components/inforeport/eventInfo/deal/InstructInfo')
const ConnectinfoList = () => import('components/inforeport/eventInfo/deal/ConnectinfoList')
const WarningView = () => import('components/inforeport/eventInfo/deal/WarningView')
const OtherView = () => import('components/inforeport/eventInfo/deal/OtherView')
const InstructSend = () => import('components/inforeport/eventInfo/instruction/InstructSend')
const InstructSendLeader = () => import('components/inforeport/eventInfo/deal/InstructSendLeader')
const InstructEdit = () => import('components/inforeport/eventInfo/deal/InstructEdit')
const GeolocationSelector = () => import('components/inforeport/eventInfo/deal/GeolocationSelector')
const eventTypeSelector = () => import('components/inforeport/eventInfo/deal/EventTypeChose')
const InstructInfoView = () => import('components/inforeport/eventInfo/deal/InstructInfoView')

// 办结页面
const conclude = () => import('components/inforeport/eventInfo/deal/Conclude')
const LeaderSelector = () => import('components/gsafetycomponents/LeaderSelector')

const deal = [{
  path: '/deal',
  name: 'DealList',
  component: DealList,
  meta: {
    title: '信息管理'
  }
}, {
  path: '/deal/view/:status/:id',
  name: 'InstructInfo',
  component: InstructInfo,
  meta: {
    title: '信息办理'
  }
}, {
  path: '/deal/instructView/:status/:id',
  name: 'InstructInfoView',
  component: InstructInfoView,
  meta: {
    title: '信息详情'
  }
}, {
  path: '/deal/view/:status/:id/0',
  name: 'InstructInfo',
  component: InstructInfo,
  meta: {
    title: '信息办理'
  }
}, {
  path: '/deal/connectinfo/:id',
  name: 'ConnectinfoList',
  component: ConnectinfoList,
  meta: {
    title: '关联列表'
  }
}, {
  path: '/deal/send/:id',
  name: 'DealInstructSend',
  component: InstructSend
}, {
  path: '/deal/sendLeader/:id',
  name: 'InstructSendLeader',
  component: InstructSendLeader
}, {
  path: '/deal/InstructEdit/:id',
  name: 'InstructEdit',
  component: InstructEdit
}, {
  path: '/deal/GeolocationSelector',
  name: 'GeolocationSelector',
  component: GeolocationSelector
}, {
  path: '/deal/conclude/:id',
  name: 'conclude',
  component: conclude
}, {
  path: '/deal/select/:id/:num',
  name: 'LeaderSelector',
  component: LeaderSelector
}, {
  path: '/deal/eventTypeChose',
  name: 'eventTypeSelector',
  component: eventTypeSelector
}, {
  path: '/instruct/warn/:id',
  name: 'WarningView',
  component: WarningView
}, {
  path: '/instruct/other/:id',
  name: 'OtherView',
  component: OtherView
}]

export default deal
