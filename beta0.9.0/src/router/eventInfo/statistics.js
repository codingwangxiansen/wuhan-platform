/**
 * Created by wjf on 2018/2/6.
 * 信息接报--信息办理模块路由
 */
const StatisBtn = () => import('components/inforeport/eventInfo/statistics/StatisBtn')
const StatisInfo = () => import('components/inforeport/eventInfo/statistics/StatistInfo')


const statistics = [{
  path: '/statisbtn',
  name: 'StatisBtn',
  component: StatisBtn
}, {
  path: '/statisbtn/info/:id',
  name: 'StatisInfo',
  component: StatisInfo
}]

export default statistics
