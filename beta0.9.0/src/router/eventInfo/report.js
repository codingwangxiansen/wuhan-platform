/**
 * Created by wjf on 2018/2/5.
 * 信息接报上报模块路由
 */

const MyInfo = () => import('components/inforeport/eventInfo/MyInfo') // 与我相关的接报信息
const InfoList = () => import('components/inforeport/eventInfo/report/InfoList')
const InfoView = () => import('components/inforeport/eventInfo/report/InfoView')
const InfoSuperView = () => import('components/inforeport/eventInfo/report/InfoSuperView')
const InfoCheck = () => import('components/inforeport/eventInfo/report/InfoCheck')
const InfoSuperCheck = () => import('components/inforeport/eventInfo/report/InfoSuperCheck')
const InfoSuperReport = () => import('components/inforeport/eventInfo/report/InfoSuperView')
const AddInfo = () => import('components/inforeport/eventInfo/report/AddInfo')
const AddWaringInfo = () => import('components/inforeport/eventInfo/report/addWaringInfo')
const AddOtherInfo = () => import('components/inforeport/eventInfo/report/addOtherInfo')
const EditInfo = () => import('components/inforeport/eventInfo/report/EditInfo')
const EditInfoChief = () => import('components/inforeport/eventInfo/report/EditInfoChief')
const Check = () => import('components/inforeport/eventInfo/report/Check')
const AddInfoTarget = () => import('components/inforeport/eventInfo/report/AddInfoTarget')
const EditInfoShare = () => import('components/inforeport/eventInfo/report/EditInfoShare')
// 呈报上报页面
const ShareReport = () => import('components/inforeport/eventInfo/report/ShareReport')
const ConnectionReport = () => import('components/inforeport/eventInfo/report/ConnectionReport')
const ContinuedReport = () => import('components/inforeport/eventInfo/report/ContinuedReport')
const InfoDetails = () => import('components/inforeport/eventInfo/report/InfoDetails')

const report = [{
  path: '/eventInfo/myInfo/:id',
  name: 'MyInfo',
  component: MyInfo
}, {
  path: '/report',
  name: 'InfoList',
  component: InfoList
}, {
  path: '/report/infoview/:id',
  name: 'InfoView',
  component: InfoView,
  meta: {
    title: '关联信息'
  }
}, {
  path: '/report/infosuperview/:id',
  name: 'InfoSuperView',
  component: InfoSuperView
}, {
  path: '/report/checkview/:id',
  name: 'InfoCheck',
  component: InfoCheck
}, {
  path: '/report/checksuperview/:id',
  name: 'InfoSuperCheck',
  component: InfoSuperCheck
}, {
  path: '/report/reportsuperview/:id',
  name: 'InfoSuperReport',
  component: InfoSuperReport
}, {
  path: '/report/add',
  name: 'AddInfo',
  component: AddInfo,
  meta: {
    title: '新增突发事件信息'
  }
}, {
  path: '/report/addWaringInfo',
  name: 'AddWaringInfo',
  component: AddWaringInfo,
  meta: {
    title: '新增预警信息'
  }
}, {
  path: '/report/editWaringInfo/:id',
  name: 'editWaringInfo',
  component: AddWaringInfo,
  meta: {
    title: '编辑预警信息'
  }
}, {
  path: '/report/addOtherInfo',
  name: 'AddOtherInfo',
  component: AddOtherInfo
}, {
  path: '/report/edit/:id',
  name: 'EditInfo',
  component: EditInfo,
  meta: {
    title: '信息登记'
  }
}, {
  path: '/report/editInfoChief/:id',
  name: 'EditInfoChief',
  component: EditInfoChief,
  meta: {
    title: '信息编辑'
  }
}, {
  path: '/report/check/:type/:id',
  name: 'Check',
  component: Check
}, {
  path: '/report/addInfoTarget/:id',
  name: 'AddInfoTarget',
  component: AddInfoTarget
}, {
  path: '/report/editInfoShare/:id',
  name: 'EditInfoShare',
  component: EditInfoShare,
  meta: {
    title: '信息分享'
  }
}, {
  path: '/report/shareReport/:id',
  name: 'ShareReport',
  component: ShareReport,
  meta: {
    title: '呈报上报'
  }
}, {
  path: '/report/connectionReport/:id',
  name: 'ConnectionReport',
  component: ConnectionReport
}, {
  path: '/report/continuedReport/:id',
  name: 'ContinuedReport',
  component: ContinuedReport
}, { // 关联接报的信息查看页
  path: '/report/infoDetails/:id',
  name: 'InfoDetails',
  component: InfoDetails
}]

export default report
