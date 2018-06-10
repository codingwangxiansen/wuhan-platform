/**
 * Created by sjy on 2018/4/17.
 * 通知公告--模块路由
 */
const AnnouncementList = () => import('components/announcement/AnnouncementList')
const AnnouncementAdd = () => import('components/announcement/AnnouncementAdd')
const AnnouncementView = () => import('components/announcement/AnnouncementView')

const announcement = [{
  path: '/announcement/list',
  name: 'AnnouncementList',
  component: AnnouncementList,
  meta: {
    title: '通知公告'
  }
}, {
  path: '/announcement/add',
  name: 'AnnouncementAdd',
  component: AnnouncementAdd
}, {
  path: '/announcement/view/:id',
  name: 'AnnouncementView',
  component: AnnouncementView
}]

export default announcement
