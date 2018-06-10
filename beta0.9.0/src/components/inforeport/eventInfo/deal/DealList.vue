<template>
  <div class="info-list">
    <div class="searchInput" v-show="searchShow">
      <search
        placeholder="搜索"
        v-model="value"
        :auto-fixed="false"
        position="relative"
        @on-focus="enterHistory"
        @on-change="getListItem"
        @on-cancel="cancelSearch"
        ref="search">
      </search>
    </div>
    <scroller v-show="mainContent" :height="scrollH"
              lock-x scrollbar-y use-pullup
              :pullup-config="pullup_config"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-scroll="scrollList"
              @on-pulldown-loading="loadPage(0, true)"
              @on-pullup-loading="loadPage(page,false)" >
      <div>
        <transition-page :options="promptDiagram"></transition-page>
        <cell class="report-info-col"
              :id="'info'+item.eventInfoId"
              v-for="(item,index) in list"
              :key="index"
              :class="{'activeColor': activeIndex == index, 'icon-done': item.handleStatus === '4' && !(item.userHandler==='1')}"
              @touchstart.native="showDeleteButton(item, index)"
              @touchmove.native="moveTouch()"
              @touchend.native="endTouch(item)">
          <div class="document-index-title"
               :title="item.infoTitle"
               :class="{'Done':item.handleStatus === '4' && item.userHandler!=='1', 'unRead': item.userRead == 0}">
            <span class="title-span">
              {{item.infoTitle}}
            </span>
            <span class="read-status" v-show="currentUser.typeCode === 1 && item.userHandler==='1'">
                [待办]
              </span>
            <span class="sign-status" v-show="currentUser.typeCode === 0 && !item.signFlag">
                [待签]
              </span>
            <span class="descTime">{{getTimeStr(item.createTimeStr)}}</span>
          </div>
        </cell>
      </div>
    </scroller>
    <!-- 搜索历史 -->
    <search-history :class="miniType"
                    :value="value"
                    v-show="historyList"
                    ref="searchH"
                    @on-change-value="changeValue"
                    @on-change-history="changeHistory"></search-history>
    <!--搜索结果-->
    <search-result :class="miniType"
                   :value="value"
                   :list="list"
                   ref="searchR"
                   v-show="searchList"></search-result>
    <a class="add-btn" @click="addInfo" v-show="mainContent">
      上报信息
    </a>
    <popup v-show="AddPop" :show-mask="true" class="addPop">
      <div @click="normalInfo">突发事件</div>
      <div @click="warnInfo">预警信息</div>
      <!--<div @click="otherInfo">其他信息</div>-->
      <div @click="cancelPop">取消</div>
    </popup>
    <div class="loading" v-show="Loaded">
      <img src="../../../../assets/image/eventInfo/index/loading.gif" alt="">
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common";
  .mini {
    margin-top: 46px;
  }
  .addPop.vux-popup-dialog {
      background: #e2e2e2;
    > div {
        line-height: 40px;
        border-bottom: 1px solid #e2e2e2;
        text-align: center;
        background: #fff;
      }
    > div:nth-last-child(1) {
        border-bottom: none;
        margin-top: 5px;
      }
  }
  /*重新*/
  .titleDown {
    text-align: left;
    margin-top: 5px;
  }
  .vux-label-desc .document-title  span.Done {
    color: #888;
  }
  .report-info-col.activeColor {
    background-color: #ebebeb;
  }
  .report-info-col.icon-done {
    /*opacity: 0.6;*/
  }
  .searchInput {
    position: relative;
  p {
    text-align: center;
  }

  }
  .vux-search-box {
    z-index: 10001;
  }
  .loading {
    height: 46em;
    position: relative;
    background: #fff;
    overflow: hidden;
  }
  .loading img {
    width: 10%;
    margin: 50% auto 0 auto;
    display: block;
  }
  .info-list{
    background: #EDEDED;
  }

  .report-info-col{
    background: #fff;
    margin: 0px 0;
    border-bottom: 1px solid #e2e2e2;
    border-top: 1px solid #fff;
    padding: 2px 15px;
    &:before {
      display: none;
    }
  }

  .document-index-title{
    .title-span{
      display: inline-block;
      max-width: calc(~"100% - 70px");
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
    &.unRead:before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: #d43e2f;
      border-radius: 5px;
      position: absolute;
      left: 6px;
      top: 16px;
    }
    &.Done{
      color: #999999;
    }
    .descTime {
      font-size: 12px;
      float: right;
      margin-top: 8px;
    }
    text-align: left;
    color: #000;
    font-size: 16px;
    padding: 3px;
  }

  .read-status{
    color: #900;
    font-weight: bold;
    font-size: 14px;
  }

  .sign-status{
    color: #be0909;
    font-weight: bold;
    font-size: 14px;
  }

  .dealDone {
    color: #999;
    font-weight: 100;
  }
  .read-status .read{
    color: #ffffff;
    font-style: normal;
  }

  .read-status .unread{
    color: #36ba4f;
    font-style: normal;
  }

  .dist-info-type{
    margin-right: 10px;
    float: right;
    color: #03A9F4;
  }

  span.typeMain {
    color:#222;
  }
  .add-btn{
    display: block;
    font-weight: bold;
    position: absolute;
    letter-spacing: 3px;
    width: 100%;
    bottom: 0;
    height: 40px;
    color: @themeColor;
    line-height: 40px;
    text-align: center;
    border-top: 1px solid #e2e2e2;
    background: #FFF;
    box-shadow: 0px -1px 2px #e2e2e2;
  }

  /*不同等级颜色*/
  .lineRed {
    background-color: #f73535;
  }
  .lineYellow {
    background-color: #ffb818;
  }
  .lineOrange {
    background-color: #ff7418;
  }
  .lineBlue {
    background-color: #2d41bb;
  }
</style>
<script>
  import { Cell, Scroller, Search, Group, XButton, Popup } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import TransitionPage from '../../../mycomponents/TransitionPage'
  import searchHistory from './searchHistory'
  import searchResult from './searchResult'

  Vue.use(VueResource)

  export default {
    // 数据模型
    data() {
      return {
//        新增页面弹窗
        AddPop: false,
        scrollerTop: 0, // 页面的滚动高度
//        搜索列表页页面
        searchList: false,
//        搜索历史页面
        historyList: false,
//        滚动高度
        scrollH: '-132',
        activeIndex: null,
        searchShow: true, // 搜索框显示隐藏
        showAction: false, // 是否长按显示出来操作了，没有就不能点击跳入详情
        results: [],
        value: '',
        isDiffTime: '99',
        currentUser: {},
        // 搜索框字段
        search: '',
        load: true,
        Loaded: false,
        mainContent: true,
        infos: {},
        list: [],
        readFlag: false,
        readStatus: '未读',
        page: 0,
        // 扶我起来，我觉得我还可以多拉几行，先拉个25行，后退页面时让用户好想一点吧。。。。
        // 祈祷后台代码给力~~~~加载记录数从10改成25
        size: 15,
        imgsrc: require('assets/image/img-05NotExist.png'),
        pullup_config: {
          content: '',
          downContent: '数据加载中...',
          upContent: '',
          loadingContent: '数据加载中...',
          hight: 60
        },
        pulldown_config: {
          content: '',
          downContent: '松开刷新',
          upContent: '松开刷新',
          loadingContent: '数据加载中...',
          hight: 60
        },
        // 提示图
        promptDiagram: {
          show: false,
          imgUrl: '',
          content: '',
          myColor: {
            type: String,
            default: '#e45050'
          }
        },
        miniType: ''
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
//        判断头部是否隐藏,假如不隐藏
        if (vm.$store.state.projectType === 'mini') {
          vm.scrollH = '-86'
        }
        // console.log(vm.$router.history.current.meta.title)
        // document.title = vm.$router.history.current.meta.title
        vm.AddPop = false
        // 通过 `vm` 访问组件实例
        vm.$store.commit('setHeaderTitle', '信息管理') // 设置头部文字
//        vm.$store.commit('setHeaderRightIcon', 'add') // 设置头部右边按钮
        vm.mainContent = true
        vm.Loaded = false
        vm.activeIndex = null
        vm.searchShow = true
        vm.searchList = false
        vm.historyList = false
        vm.value = '' // 清空搜索框的值
        const listPageStatus = vm.$store.state.listPageStatus
        const page = listPageStatus.page
        if (page) {
          vm.page = page
          const totalNum = (page + 1) * vm.size
          vm.loadPage(0, true, totalNum)
          return
        }
        vm.loadPage(0, true)
      })
    },
    beforeRouteLeave(to, from, next) {
      this.searchShow = false
      this.AddPop = false
      this.$store.commit('setHeaderRightIcon', '')
      next()
    },
    // 组件
    components: {
      Cell,
      Scroller,
      TransitionPage,
      Search,
      Group,
      XButton,
      searchHistory,
      searchResult,
      Popup
    },
    beforeCreate() {
      this.$store.dispatch('showPageLoading')
    },
    // 页面加载
    created() {
      this.currentUser = this.$store.state.user
    },
    // 方法
    methods: {
//      点历史记录的时候
      changeHistory(item) {
        this.value = item
        this.getListItem()
      },
//      点击常用事件列表的时候，修改搜索框的值
      changeValue(item, code) {
        const that = this
//        this.value = item
        this.list = []
        this.mainContent = false
        this.searchList = true
        this.historyList = false
        const URL = `${siteUrl}/eventInfo/list/search/eventtype`
        const param = {
          categoryType: code
        }
        this.list = []
        that.axios.post(URL, param)
          .then((response) => {
            that.list = that.list.concat(response.data.response.result)
            that.$refs.searchR.splitStr(that.list, item)
          })
          .catch(() => {})
      },
//      点击取消的时候
      cancelSearch() {
        this.mainContent = true
        this.searchList = false
        this.historyList = false
      },
//      进入搜索历史页面
      enterHistory() {
        if (this.value) {
//          如果搜索框里面还有值
          this.searchList = true
          this.historyList = false
        } else {
          this.searchList = false
          this.historyList = true
        }
        this.mainContent = false
        this.$refs.searchH.setHistory()
//      判断是否是小程序场景
        if (this.$store.state.projectType === 'mini') {
          this.miniType = 'mini'
          return
        }
        this.miniType = ''
      },
      // next中为了避免修改形参，改成函数修改
      changeVal(key, val) {
        this[key] = val
      },
//      搜索框获取焦点时
      onfocus() {
        this.mainContent = false
      },
      // 模糊查询
      getListItem() {
        this.$store.dispatch('showPageLoading')
//        判断进入详情页面
        if (this.value.length > 0) {
          this.searchList = true
          this.historyList = false
        } else {
          this.searchList = false
          this.historyList = false
        }
        const URL = `${siteUrl}/eventInfo/list/search/all?page=${this.page}&size=${this.size}`
        const that = this
        const param = {
          keyWord: that.value
        }
        that.axios.post(URL, param)
          .then((response) => {
            that.$store.dispatch('hidePageLoading')
            that.list = []
            const infos = response.data.response.result
            if (infos) {
              const infosValArr = Object.values(infos)
              infosValArr.forEach((value) => {
                that.list.push(value)
              })
              if (that.list.length > 0) {
                that.Loaded = false
                that.promptDiagram.show = false
              }
              that.$refs.searchR.splitStr(that.list, that.value)
            }
          })
          .catch(() => {

          })
        that.$nextTick(() => { that.$refs.scroll1.reset({ top: 0 }) })
      },
      loadPage(page, reload, totalNum) {
        const that = this
        if (!reload) {
          let changPage = page
          changPage += 1
          this.page = changPage
        } else {
          if (!totalNum) {
            this.page = 0
          }
          this.list = []
          // 添加加载效果图
          this.promptDiagram.show = true // 开启效果图
          this.promptDiagram.imgUrl = require('assets/image/loading.gif')
          this.promptDiagram.content = ''
        }
        const URL = '/eventInfo/list/search/all'
        const size = totalNum || this.size
        const searchPage = totalNum ? page : this.page
        that.axios.getList(URL, searchPage, size, '', (list) => {
          that.$store.dispatch('hidePageLoading')
          that.infos = list
          if (that.infos.length > 0) {
            that.$refs.scroll1.enablePullup()
            if (that.infos) {
              const infosValArr = Object.values(that.infos)
              that.Loaded = false
              that.promptDiagram.show = false
              infosValArr.forEach((value) => {
                that.list.push(value)
              })
            }
            // 小飞机隐藏
            that.promptDiagram.show = false
          } else if (that.list.length <= 0) {
            that.promptDiagram.show = true
            that.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png') // eslint-disable-line global-require
            that.promptDiagram.content = '暂无数据'
          } else if (that.infos.length < 10) {
            that.$refs.scroll1.disablePullup()
          }
          that.$refs.scroll1.donePullup()
          that.$refs.scroll1.donePulldown()
          that.$nextTick(() => {
            if (totalNum) {
              that.$store.commit('resetListPageStatus')
              that.$refs.scroll1.reset({
                top: this.scrollerTop
              })
              return
            }
            that.$refs.scroll1.reset()
          })
        })
      },
      // 滑动时 清除长按事件
      moveTouch() {
        this.showAction = true
        clearTimeout(this.Loop)
      },
      endTouch(item) { // 触摸离开的时候  如果没有出来弹窗  就进入详情
        clearTimeout(this.Loop)
        if (!this.showAction) {
          this.getDetail(item)
        } else {
          this.showAction = false
        }
      },
      getDetail(item) {
        // 进入详情后，回到列表是默认不刷新的、
        this.$store.commit('setListPageStatus', {
          page: this.page,
          activeId: `info${item.eventInfoId}`
        })
        const that = this
        const id = item.eventInfoId
        clearInterval(this.Loop)
        if (item.userRead === '0') {
          const readUrl = `${siteUrl}/eventInfo/markread/${id}`
          that.axios.post(readUrl, '')
            .then(() => {
              this.openDetail(item)
            })
            .catch(() => {
              this.openDetail(item)
            })
          item.userRead = '1'
        } else {
          this.openDetail(item)
        }
      },
      openDetail(item) {
//        是否撤回
        const backStatus = (item.isBack === '1')
//        const id = item.eventInfoId
        const infoStatus = item.infoStatus
        let r = ''
        if (this.currentUser.typeCode === '0') { // 下级
          if (infoStatus === '0' || backStatus) { // 未上报
            r = item.info.link.draft
          } else {
            r = item.info.link.view
          }
        } else if (infoStatus === '0' || (backStatus && (this.currentUser.id === item.createPerson))) {
          r = item.info.link.draft
        } else {
          r = item.info.link.view
        }
        this.mainContent = false
        this.Loaded = true
        this.historyList = false
        this.activeIndex = null
        this.$store.dispatch('showPageLoading')
        if (r === '') {
          this.$router.push('/error')
          return
        }
        this.$store.commit('setHeaderTitle', '信息办理')  // 设置头部文字
        this.$store.commit('setInfoPageManipulable', true) // 进入可操作的信息管理页面
//        this.$store.commit('setHeaderTitle', '信息详情')  // 设置头部文字
//        this.$store.commit('setInfoPageManipulable', false) // 进入不可操作的信息详情页面
        this.$router.push(r)
      },
      // 长按删除（未上报）
      showDeleteButton(item, index) {
        this.AddPop = false
        this.activeIndex = index
        const status = item.handleStatus
        // 当消息是当前用户上报时
        if (this.currentUser.id === item.createPerson) {
          const that = this
          clearTimeout(this.Loop) // 再次清空定时器，防止重复注册定时器
          that.Loop = setTimeout(() => {
            that.showAction = true
            if (status === '1' || !item.reportDate) {
              // 未上报时长按删除
              const url = `${siteUrl}/eventInfo/delete/${item.eventInfoId}`
              that.$vux.confirm.show({
                title: '确认删除？',
                content: '',
                onConfirm() {
                  that.showAction = false
                  that.$http.post(url).then((response) => {
                    if (response.body.code === 200) {
                      that.$vux.toast.text('删除成功', 'middle')
                      that.loadPage(that.page, true)
                      that.$vux.confirm.hide()
                    }
                  }, () => {
                    that.$vux.toast.text('删除失败', 'middle')
                    that.$vux.confirm.hide()
                  })
                },
                onCancel() {
                  that.showAction = false
                }
              })
            } else {
              that.isDiffTime = that.getDiffTimer(item.reportDate)
              // 当前时间与上报时间小于两分钟时，可以进行撤回操作
              if (that.isDiffTime <= 2) {
                // 已上报时长按撤回
                const url = `${siteUrl}/eventInfo/cancelReport/${item.eventInfoId}`
                that.$vux.confirm.show({
                  title: '确认撤回？',
                  content: '',
                  onConfirm() {
                    that.showAction = false
                    that.$http.get(url).then((response) => {
                      if (response.body.code === 200) {
                        that.$vux.toast.text('撤回成功', 'middle')
                        that.loadPage(that.page, true)
                        that.$vux.confirm.hide()
                      } else {
                        that.$vux.toast.text(response.body.message, 'middle')
                      }
                    }, () => {
                      that.$vux.toast.text('撤回失败', 'middle')
                      that.$vux.confirm.hide()
                    })
                  },
                  onCancel() {
                    that.showAction = false
                  }
                })
              } else {
                that.showAction = false
                that.$vux.toast.text('上报时间已超过两分钟，撤回失败', 'middle')
              }
            }
          }, 2000)
        }
      },
      // 上报时间与当前时间相比的间隔时长
      getDiffTimer(reportTime) {
        const date = new Date(reportTime)
        // 计算时间间隔，单位为分钟
        return parseInt((new Date().getTime() - date.getTime()) / 1000 / 60, 10)
      },
//      headerRightClick() { // 头部右边按钮点击事件
//        const r = '/report/add'
//        this.$router.push(r)
//      },
      imageSrc(val) {
        const imgUrl = '../static/image/info/'
        if (val === 5) {
          return 'lineBlue'
        } else if (val === 4) {
          return 'lineOrange'
        } else if (val === 3) {
          return 'lineYellow'
        } else if (val === 2) {
          return 'lineRed'
        } else if (val === 1) {
          return 'lineRed'
        }
        return imgUrl
      },
      readColor(val) {
        if (!val) return 'read'
        return 'unread'
      },
      iconShortTxt(eventType) { // 四大类首字 作为cell头部 参数为事件类型code 返回类型首字
        let txt = ''
        this.list.map(() => {
          if (eventType.substring(0, 2) === '11') {
            txt = '自然灾害'
          } else if (eventType.substring(0, 2) === '12') {
            txt = '事故灾难'
          } else if (eventType.substring(0, 2) === '13') {
            txt = '公共卫生'
          } else if (eventType.substring(0, 2) === '14') {
            txt = '社会安全'
          } else if (eventType.substring(0, 2) === '30') {
            txt = '预警信息'
          } else if (eventType.substring(0, 2) === '40') {
            txt = '其它信息'
          }
          return txt
        })
        return txt
      },
      iconShortClass(eventLevelCode, userRead) { // 四大类首字 作为cell头部 参数为事件类型code 返回类型颜色样式类
        let colorCss = 'blue'
        if (eventLevelCode === '1') {
          colorCss = 'red'
        } else if (eventLevelCode === '2') {
          colorCss = 'orange'
        } else if (eventLevelCode === '3') {
          colorCss = 'yellow'
        } else if (eventLevelCode === '4') {
          colorCss = 'blue'
        }
        if (userRead === '0') {
          colorCss += ' unread'
        }
        return colorCss
      },
      addInfo() {
//        const r = '/report/add'
//        this.$router.push(r)
        this.AddPop = true
      },
      warnInfo() {
        const r = '/report/addWaringInfo'
        this.$router.push(r)
        this.AddPop = false
      },
      otherInfo() {
        const r = '/report/addOtherInfo'
        this.$router.push(r)
        this.AddPop = false
      },
      normalInfo() {
        const r = '/report/add'
        this.$router.push(r)
        this.AddPop = false
      },
      cancelPop() {
        this.AddPop = false
      },
      scrollList(position) { // 滚动列表的时候触发的方法
        this.scrollerTop = position.top
      },
      getTimeStr(timeStr) {
        let showTimeStr
        if (timeStr) {
          showTimeStr = timeStr.split(' ')[0]
          const date = new Date(showTimeStr)
          showTimeStr = `${date.getDate()}/${date.getMonth() + 1}`
        }
        return showTimeStr
      }
    }
  }
</script>
