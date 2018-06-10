/**
 * Created by wjf on 2018/2/6.
 * 用户相关操作模块的路由
 */
const Userchange = () => import('components/user/Userchange')
const ChangePass = () => import('components/user/ChangePass')
const UserCheck = () => import('components/user/UserCheck')
const UserInfo = () => import('components/user/UserInfo')
const About = () => import('components/user/About')
const AdministratorReview = () => import('components/user/AdministratorReview')
const FindPwd = () => import('components/user/FindPwd')
const ChangePhoneNum = () => import('components/user/ChangePhoneNum')

const users = [{
  path: '/user',
  name: 'Userchange',
  component: Userchange
}, {
  path: '/user/pass',
  name: 'ChangePass',
  component: ChangePass
}, {
  path: '/user/usercheck',
  name: 'UserCheck',
  component: UserCheck
}, {
  path: '/user/userinfo',
  name: 'UserInfo',
  component: UserInfo
}, {
  path: '/user/about',
  name: 'About',
  component: About
}, {
  path: '/user/adreview',
  name: 'AdministratorReview',
  component: AdministratorReview
}, {
  path: '/user/findPwd',
  name: 'FindPwd',
  component: FindPwd
}, {
  path: '/user/changephonenum/:id',
  name: 'ChangePhoneNum',
  component: ChangePhoneNum
}]

export default users
