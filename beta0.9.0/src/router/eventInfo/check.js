/**
 * Created by wjf on 2018/2/6.
 * 信息接报--信息审核模块路由
 */
const CheckList = () => import('components/inforeport/eventInfo/check/CheckList')

const check = [{
  path: '/check', // 审核列表
  name: 'CheckList',
  component: CheckList
}]

export default check
