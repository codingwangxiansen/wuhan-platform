/**
 * Created by wangjunfei on 2018/1/10.
 */
export default {
  showPageLoading(state) { // 修改页面加载动画是否显示
    state.pageLoading.percent = 0
    state.pageLoading.isShowLoading = true
    state.pageLoadInterval = setInterval(() => {
      if (state.pageLoading.percent > 80) {
        clearInterval(state.pageLoadInterval)
        return false
      }
      state.pageLoading.percent++
      return false
    }, 50)
  },
  hidePageLoading(state) { // 修改页面加载动画进度条长度
    clearInterval(state.pageLoadInterval)
    state.pageLoading.percent = 100
    setTimeout(() => {
      state.pageLoading.isShowLoading = false
    }, 50)
  },
  setProjectType(state, projectType) {
    state.projectType = projectType
  },
  setUser(state, userInfo) { // 初始化用户信息
    state.user = Object.assign(state.user, userInfo)
  },
  setAllUser(state, userInfo) { // 初始化用户信息
    state.allUser = userInfo
  },
  setTextTemplate(state, textTemplate) {
  //  初始化模板信息
    state.textTemplate = textTemplate
  },
  setGroupLeader(state, groupLeader) { // 初始化领导用户
    state.groupLeader = groupLeader
  },
  setCityLeader(state, cityLeader) { // 初始化领导用户
    state.cityLeader = cityLeader
  },
  // 设置转办督办的转办事项
  setTransThings(state, transThings) {
    state.transThings = transThings
  },
  // 设置转办督办的批示指示
  setOrderInfo(state, orderInfo) {
    state.orderInfo = orderInfo
  },
  setLeaderBack(state, back) {
    state.leaderBack = back
  },
  setIsRefresh(state, isRefresh) { // 修改页面跳转是否刷新的状态控制参数,默认应设置为不刷新
    state.isRefresh = isRefresh
  },
  setAllowBack(state, allowBack) {
    state.allowBack = allowBack // 修改页面点击手机回退是否回退,默认回退
  },
  setBigSrc(state, srcArr) {
    state.imgSrc = srcArr
  },
  setVideo(state, src) {
    state.VideoSrc = src
  },
  getCurrentUser(state, obj) {
    state.currentUser = obj
  },
  setGisLocation(state, gisLocation) {
    state.gisLocation = Object.assign(state.gisLocation, gisLocation)
  },
  resetGisLocation(state) {
    state.gisLocation = { // 地理位置信息
      x: 114.296350, // 经度
      y: 30.595510, // 纬度
      searchExtent: [110.58838, 29.25286, 118.09204, 31.98012], // 搜索范围
      address: '',
      isEdit: true,
      distCode: '420102'
    }
  },
  setLocation(state, location) {
    state.location = Object.assign(state.location, location)
  },
  resetLocation(state) { // 系统里面重置当前位置信息
    state.location = Object.assign(state.location, {
      isReset: false,
      x: 114.296350,
      y: 30.595510
    })
  },
  setIsMapInit(state, isMapInit) {
    state.isMapInit = isMapInit
  },
  setDealWindow(state, dealWindow) {
    state.dealWindow = dealWindow
  },
  setLeaderList(state, leaderList) {
    state.leaderList = leaderList
  },
  resetLeaderList(state) {
    state.leaderList = []
  },
  updateEventType(state, eventType) {
    state.eventType = eventType
  },
  updateOrgUserLeaderGroup(state, orgUserLeaderGroup) {
    state.orgUserLeaderGroup = orgUserLeaderGroup
  },
  initECharts(state, echarts) {
    state.echarts = echarts
  },
  setHeaderTitle(state, title) {
    state.headerOption.title = title
  },
  showHeader(state) {
    state.headerOption.showHeader = true
  },
  // 查看大图页面返回滚动的高度
  scrollTop(state, num) {
    state.scrollTop = num
  },
  hideHeader(state) {
    state.headerOption.showHeader = false
  },
  setHeaderRightIcon(state, type) {
    state.headerOption.headerRightIcon = type
  },
  setHeaderLeft(state, leftOptions) {
    state.headerOption.leftOptions = leftOptions
  },
  addPopupArgsList(state, popupArg) {
    if (popupArg instanceof Array) {
      state.popupArgsList = state.popupArgsList.concat(popupArg)
    } else {
      state.popupArgsList.push(popupArg)
    }
  },
  removePopupArg(state, popupArg) {
    const index = state.popupArgsList.indexOf(popupArg)
    if (index > -1) {
      state.popupArgsList.splice(index, 1)
    }
  },
  resetPopupArgsList(state) {
    state.popupArgsList = []
  },
  setChooseEventType(state, chooseEventType) {
    state.chooseEventType = chooseEventType
  },
  setChooseDistrict(state, chooseDistrict) {
    state.chooseDistrict = chooseDistrict
  },
  setInfoPageManipulable(state, infoPageManipulable) {
    state.infoPageManipulable = infoPageManipulable
  },
  setSupervisePerson(state, supervisePerson) {
    state.supervisePerson = supervisePerson
  },
  setOrgList(state, orgList) {
    state.orgList = orgList
  },
  setSelectedOrgList(state, selectedOrgList) {
    state.selectedOrgList = selectedOrgList
  },
  resetSelectedOrgList(state) {
    state.selectedOrgList = []
  },
  setListPageStatus(state, listPageStatus) {
    state.listPageStatus = Object.assign(state.listPageStatus, listPageStatus)
  },
  resetListPageStatus(state) {
    state.listPageStatus = { // 列表页面状态
      page: 0, // 当前页
      activeId: '' // 页面离开时所点击的元素ID
    }
  },
  /*
   * 设置formSupervise的属性
   * data的格式{data: [{key:'',value:''},{key:'',value:''}]}
   */
  setFormSupervise(state, data) {
    data.data.forEach((item) => {
      state.formSupervise[item.key] = item.value
    })
  },
  /*
   * 清除formSupervise的属性
   */
  clearFormSupervise(state) {
    console.log('清除formSupervise的属性')
    state.formSupervise = {
      eventInfoId: '',
      eventInfoTitle: '',
      disposeId: '',
      disposeTitle: '',
      content: ''
    }
  }
}
