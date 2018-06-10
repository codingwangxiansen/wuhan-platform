/**
 * Created by wangjunfei on 2018/1/10.
 */
/* 内存状态数据 */
export default {
  // 查看图片时滚动的高度
  scrollTop: 0,
  projectType: 'app', // 当前项目的类型 app--安卓应用  mini--小程序
  user: {}, // 用户信息
  textTemplate: [], // 文字模板 key--类型  templates--内容
  isRefresh: true, // 跳转到新路由是否刷新页面，页面状态控制
  allowBack: true, // 控制页面是否回退
  isMapInit: false, // 页面地图是否初始化过
  gisLocation: { // 地理位置信息
    x: 114.296350, // 经度
    y: 30.595510, // 纬度
    searchExtent: [110.58838, 29.25286, 118.09204, 31.98012], // 搜索范围
    address: '',
    isEdit: true,
    distCode: '420102' // 区域的code代码 默认
  },
  location: { // 当前的地理位置信息 默认武汉市中心
    isReset: false, // 是否按照当前位置重置
    x: 114.296350,
    y: 30.595510
  },
  // 办理页面当前弹出的窗口 默认没有弹出窗口 advise--拟办  trans--转办  check--审核
  dealWindow: '',
  leaderList: [], // 通用选择领导页面选中的领导ID数组
  imgSrc: [], // 设置图片路径
  VideoSrc: [], // 设置视频路径
  eventType: [], // 事件类型
  currentUser: {}, // 获取当前用户单位和用户名
  groupLeader: [],
  orgUserLeaderGroup: [],
  cityLeader: [],
  pageLoading: {
    isShowLoading: false,
    percent: 0
  },
  leaderBack: '', // 当前领导的回复
  // 转办督办选择的转办事项
  transThings: {},
  // 转办督办的批示指示
  orderInfo: {},
  echarts: '', // echarts图表对象
  headerOption: { // 公共的头部的配置
    showHeader: true,
    headerRightIcon: '',
    leftOptions: {
      showBack: false,
      backText: '',
      preventGoBack: true
    },
    title: '武汉市应急值班平台',
    transition: '',
    rightOptions: {
      showMore: false
    }
  },
  popupArgsList: [], // 当前页弹窗参数列表
  chooseEventType: {}, // 选中的事件类型
  infoPageManipulable: true, // 信息详细页可否操作 不可操作即为详情页 否则办理页,
  supervisePerson: {},

  orgList: [], // 机构列表
  selectedOrgList: [], // 页面上面选中的机构code列表 用于页面传值
  listPageStatus: { // 列表页面状态
    page: 0, // 当前页
    activeId: '' // 页面离开时所点击的元素ID
  },
  /*
   * 转办督办编辑表单
   */
  formSupervise: {
    // 事件id
    eventInfoId: '',
    // 事件标题
    eventInfoTitle: '',
    // 批示id
    disposeId: '',
    // 批示内容
    disposeTitle: '',
    // 转办督办意见
    content: ''
  }
}
