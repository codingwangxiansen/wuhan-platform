const CommunicateMain = () => import('components/communicate/CommunicateMain')
const CommunicateOrg = () => import('components/communicate/CommunicateOrg')
const CommunicateOrgUser = () => import('components/communicate/CommunicateOrgUser')
const CommunicateQueryAll = () => import('components/communicate/CommunicateQueryAll')
const CommunicateQueryResult = () => import('components/communicate/CommunicateQueryResult')
const CommunicateView = () => import('components/communicate/CommunicateView')

const communicate = [{
  path: '/communicate/main', // 政务通信录
  name: 'CommunicateMain',
  component: CommunicateMain
}, {
  path: '/communicate', // 通信录组织机构，临时改为首页
  name: 'CommunicateOrg',
  component: CommunicateOrg
}, {
  path: '/communicate/CommunicateOrgUser/:orgCode', // 通信录机构人员
  name: 'CommunicateOrgUser',
  component: CommunicateOrgUser
}, {
  path: '/CommunicateQueryAll', // 通信录查询页面(首页)
  name: 'CommunicateQueryAll',
  component: CommunicateQueryAll
}, {
  path: '/CommunicateQueryResult', // 检索结果页
  name: 'CommunicateQueryResult',
  component: CommunicateQueryResult
}, {
  path: '/CommunicateView/:id', // 用户详情页
  name: 'CommunicateView',
  component: CommunicateView
}]

export default communicate
