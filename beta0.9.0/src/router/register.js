/**
 * Created by wjf on 2018/2/6.
 * 注册相关路由
 */
const Register = () => import('components/register/Register')
const RegisterAdminApply = () => import('components/register/RegisterAdminApply')

const register = [{
  path: '/register',
  name: 'Register',
  component: Register
}, {
  path: '/register/adminApply/:id', // 管理员审核页面
  name: 'RegisterAdminApply',
  component: RegisterAdminApply
}]

export default register

