/**
 * Created by wjf on 2018/2/6.
 * 信息接报--领导批示模块路由
 */
const InstructList = () => import('components/inforeport/eventInfo/instruction/InstructList')
const InstructView = () => import('components/inforeport/eventInfo/instruction/InstructView')
const InstructSend = () => import('components/inforeport/eventInfo/instruction/InstructSend')
const TransView = () => import('components/inforeport/eventInfo/instruction/TransView')
const bigImg = () => import('components/inforeport/eventInfo/instruction/bigImg')
const playVideo = () => import('components/mycomponents/playVideo')
const TransTabs = () => import('components/inforeport/eventInfo/instruction/TransTabs')

const instruct = [{
  path: '/instruct/list',
  name: 'InstructList',
  component: InstructList,
  meta: {
    title: '转办督办'
  }
}, {
  path: '/instruct/view/:id',
  name: 'InstructView',
  component: InstructView
}, {
  path: '/instruct/send/:id',
  name: 'InstructSend',
  component: InstructSend
},
{
  path: '/instruct/trans/:id',
  name: 'TransView',
  component: TransView
}, {
  path: '/instruct/bigImg/:index',
  name: 'bigImg',
  component: bigImg
}, {
  path: '/instruct/playVideo',
  name: 'playVideo',
  component: playVideo
}, {
  path: '/instruct/transtab/:id',
  name: 'TransTabs',
  component: TransTabs
}]

export default instruct
