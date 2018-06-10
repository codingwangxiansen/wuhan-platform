/**
 * Created by wjf on 2018/2/6.
 * 测试用路由模块
 */
const Demo = () => import('components/inforeport/Demo')
const MapDemo = () => import('components/MapDemo')

const demo = [{
  path: '/demo',
  name: 'Demo',
  component: Demo
}, {
  path: '/mapDemo',
  name: 'mapDemo',
  component: MapDemo
}]

export default demo

