/**
 * Created by 123 on 2018/2/6.
 * 消息推送--消息中心模块的路由
 */
const PushList = () => import('components/push/PushList')
const PushDetail = () => import('components/push/PushDetail')
const PushView = () => import('components/push/PushView')

const push = [{
  path: '/push',
  name: 'PushList',
  component: PushList
}, {
  path: '/push/result',
  name: 'PushDetail',
  component: PushDetail
}, {
  path: '/push/:id',
  name: 'PushView',
  component: PushView
}]
export default push
