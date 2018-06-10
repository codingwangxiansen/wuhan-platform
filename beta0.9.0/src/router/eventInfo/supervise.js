/**
 * Created by wjf on 2018/5/2.
 * 信息接报--转办督办新增业务场景
 */
const EventInfoSuperviseAddPage = () => import('components/inforeport/eventInfo/supervise/AddPage')
const SelectThings = () => import('components/inforeport/eventInfo/supervise/components/selectThings')

const eventInfoSupervise = [{
  path: '/eventInfo/supervise/add',
  name: 'EventInfoSuperviseAddPage',
  component: EventInfoSuperviseAddPage,
  meta: {
    title: '新增转办督办'
  }
}, {
  path: '/eventInfo/supervise/things',
  name: 'SelectThings',
  component: SelectThings
}]

export default eventInfoSupervise
