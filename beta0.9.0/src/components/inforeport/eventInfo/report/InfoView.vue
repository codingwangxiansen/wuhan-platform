<template>
  <div class="instruction" @click="hiddenShell" :class="mini">
    <div class="infoItem">
      <div class="lineF">
        <div class="lineF-left">
          <img :src="iconShortTxt(eventBase.eventType).img" alt="">
          <p>{{iconShortTxt(eventBase.eventType).txt}}</p>
        </div>
        <div class="lineF-center">
          <h3>{{eventBase.infoTitle}}</h3>
          <p>
            <i class="gs-warning2"></i><span>{{eventBase.eventLevelName}}</span>
            <i class="gs-clock-o"></i><span>{{eventBase.reportDateStr}}</span>
          </p>
        </div>
        <div class="lineF-right">
          <router-link :to="{path:'/report/editInfoChief/' + eventBase.eventInfoId}" v-show="showEdit" class="linkBtn">
            <i class="gs-pencil-square-o"></i>
          </router-link>
        </div>
      </div>

      <div class="lineS">
        <span class="pName">{{eventBase.reportPerson}}</span>
        <span class="pUnti">{{eventBase.reportOrgName}}</span>
        <a :href="'tel:'+eventBase.reportPersonPhone" class="tel">{{eventBase.reportPersonPhone}}</a>
        <router-link :to="{path:'/report/continuedReport/' + eventBase.eventInfoId}">
          <span v-show="eventBase.continueReportExist" class="tel">续报</span>
        </router-link>
        <router-link :to="{path:'/report/connectionReport/' + eventBase.eventInfoId}">
          <span v-show="eventBase.relateExist" class="tel">关联接报</span>
        </router-link>
      </div>
    </div>
    <div class="tabNav">
      <tab :line-width="2">
        <tab-item active-class="red" :selected="currentItem === item.itemValue" v-for="(item,index) in taglist" :key="index"
                  @on-item-click="getData(item.itemValue,id)">{{item.itemKey}}
        </tab-item>
      </tab>
    </div>
    <div class="mainScroll" @scroll="showScroll" ref="mainScroll" :class="scrollerHeight">
      <!--事件详情(含转办批示拟办审核)-->
      <div class="main_panel" v-show="showDetail">
        <info-view-item
          :showAllInfo="showAllInfo"
          :data="eventBase"
          :isWatch="isWatch"
          :attachs="attachs"
          :showOperation="showOperation"
          :showEdit="showEdit"
          :auditingList="auditingList"
          :instructionPanel="instructionPanel"
          :instList="instList"
          :instructTrans="instructTrans"
          :completeList="completeList"
          :id = 'id'
          :userId="userId"
          ref="setList"
          @maskShow="showMask"
          @showFullScreen="showFullScreen">
        </info-view-item>
      </div>
      <!--end导航-->
      <!--信息流程-->
      <div class="main_panel" :class="{'flow':showInfo}" v-show="showInfo">
        <instruct-timeline  ref="timelinePanel" :infoId="id"></instruct-timeline>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
  /*新版*/
  .infoItem {
    overflow: hidden;
    background: transparent;
    //padding: 0 10px;
    position: relative;
    border-bottom: 1px solid #ddd;
    .other {
      font-size: 14px;
      text-align: center;
      color: #333;
    }
    .lineF{
      background: transparent;
      width: 100%;
      height: 72px;
      text-align: left;
      display: -webkit-inline-flex;
      display: inline-flex;
      > .lineF-left{
        flex: 1;
        background: #fff;
        text-align: center;
        img{
          width: 48px;
          height: 48px;
        }
        p{
          text-align: center;
          color: #888;
          margin-top: -10px;
        }
      }
      > .lineF-center{
        flex: 2;
        padding: 0 6px;
        h3 {
          font-size: 14px;
          line-height: 20px;
          padding: 3px 0;
        }
        p{
          color: #888;
          font-size: 14px;
          border-top: 1px dotted #e2e2e2;
          line-height: 24px;
          i{
            margin-right: 5px;
          }
          :nth-child(2){
            margin-right: 15px;
          }
        }

      }
      > .lineF-right{
        flex: 0.5;
        background: #fff;
        text-align: center;
        i{
          color: #4e8cff;
          font-size: 35px;
          line-height: 72px;
        }
      }
    }
    .lineS{
      display: inline-block;
      width: 100%;
      line-height: 32px;
      font-size: 14px;
      border-top: 1px dotted #e2e2e2;
      span{
        display: inline-block;
        margin: 0 3px 0 0;
        padding: 0 10px;
        .tel{
          background: #4e8cff;
          border-radius: 15px;
          color: #fff;
        }
      }
      a{
        display: inline-block;
        margin: 3px;
        padding: 0 10px;
        max-height: 28px;
        line-height: 28px;
        background: #4e8cff;
        border-radius: 15px;
        color: #fff;
      }
    }
  }
  /*新版结束,常规*/
  .mainScroll {
    /*margin-bottom: 35px;*/
    height: calc(~"100vh - 200px");
    overflow: scroll;
    box-sizing: border-box;
  }
  .miniApp {
    .mainScroll {
      height: calc(~"100vh - 170px");
    }

  }
  /*场景1*/
  /*场景2*/
  /*场景1*/
  .adviseOption {
    margin-bottom: 270px;
  }
  .showCheck {
    margin-bottom: 270px;
  }
  .showPopupTrans {
    margin-bottom: 280px;
  }
  .showContinued{
    margin-bottom: 280px;
  }
  .instruction {
    /*padding-top: 44px;*/
    box-sizing: border-box;
  }
  .leadSel {
    height:90% !important;
  }
  .tabNav {
    width:100%;
    position: relative;
    z-index: 100;
  }
  .finished {
    display: inline-block;
    width: 100%;
  }
  div.firstLine {
    bottom:50px;
  }
  .weui-tabbar {
    left:0;
  }

  .inst-feed {
    display: flex;
  }
  .weui-tabbar {
    position: fixed;
  }
  .head {
    color: #444;
    background-color: #f2f2f2;
    text-align: center;
    font-weight: 700;
    line-height: 56px;
    font-size: 20px;
  }
  .feedback-btn {
    padding: 0;
    font-size: 12px;
    width: 20% !important;
    height: 30px;
    margin-right: 3px;
  }

  .info-title {
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
  }

  .vux-tab .vux-tab-item {
    font-size: 16px !important;
  }

  .main_panel {
    padding-bottom: 24px;
    overflow: hidden;
  }

  .main_panel.flow{
    background: #FFFFFF;
  }

  .main_panel.instruct{
    padding-top: 0;
  }

  .inst-con {
    margin: 15px;
  }

  .inst-item {
    margin: 30px 0px;
  }

  .inst-item p:first-child {
    margin: 0px 15px;
    word-break: break-all;
  }

  .inst-item .inst-leader {
    float: right;
    margin: 0px 15px;
  }
  .dealBtnGroup{
    z-index: 29;
    right: 0;
    left:0;
    padding: 8px;
    position: fixed  ;
    bottom:0;
    height:56px;
    background-image:-webkit-linear-gradient(
      to bottom,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0) 5%,
      rgba(255,255,255,0) 10%,
      rgba(255,255,255,1) 50%,
      rgba(255,255,255,1) 80%,
      rgba(255,255,255,1) 100%);
    background-image: linear-gradient(
      to bottom,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0) 5%,
      rgba(255,255,255,0) 10%,
      rgba(255,255,255,1) 50%,
      rgba(255,255,255,1) 80%,
      rgba(255,255,255,1) 100%);
    display: flex;
    justify-content: space-around;
  }
  .dealBtn{
    position: relative;
    display: inline-block;
    width: 4rem;
    height: 4rem;
    border-radius: 6rem 6rem 6rem 6rem;
    color: #444;
    line-height: 6rem;
    opacity: 0.9;
    text-align: center;
    font-size: 12px;
    &:before {
      position: absolute;
      top: 12px;
      line-height: 1em;
      font-size: 2em;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
    }

  }
  .btn-highLight{
    color: #36ba4f;
  }
  .dealPopDiv{
    position: fixed;
    width: 3rem;
    height: 3rem;
    background-color: rgba(3,169,244,0.8);
    border-radius: 3rem;
    line-height: 3rem;
    color: #fff;
    border: none;
    text-align: center;
    bottom: 2.5rem;
    right: 1rem;
  }
  .vux-popup-mask{
    display: none !important;
  }
  .xs-container {

  }

  /* 与我相关 */
  .about{
    position: fixed;
    color: #ffffff;
    background: #fe9900;
    top: 50%;
    right: -77px;
    padding: 0 6px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    transition: all 0.5s;
    opacity: 0.4;
    &:hover {
      right: 0;
      opacity: 1;
    }

    span{
      display: inline-block;
      height: 50px;
      line-height: 50px;
      vertical-align: middle;
    }

    span.symbol-span{
      font-size: 30px;
    }
  }
</style>
<script>
  import {
    Scroller,
    Tab,
    TabItem,
    XInput,
    XTextarea,
    Cell,
    Group,
    Checklist,
    XButton,
    Datetime,
    Flexbox,
    FlexboxItem,
    Tabbar,
    TabbarItem,
    Popup,
    Box,
    Divider,
    CellBox
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import InfoViewItem from './InfoViewItem.vue'
  import InstructTimeline from '../../eventInfo/deal/InstructTimeline.vue'


  // 启用请求组件
  Vue.use(VueResource)

  export default {
    // 数据模型
    data() {
      return {
        typeStr: '',
        scrollTop: 0,
        userId: '',
        ifShow: false,
        showAdviseOption: false, // 拟办操作显示
        attachs: [],
        showPopupTrans: false,
        showContinued: false,
        showSupervise: false,
        selectInstrLeadList: [],
        id: '', // 信息id
        auditingList: [], // 审核记录列表
        instructionPanel: [], // 拟办录
        instructTrans: [], // 转办记录
        completeList: [], // 办结记录
        instList: [], // 领导审核记录
        transList: [],
        showBtn: true,
        showOperation: true,
        showEdit: true,
        showCheckPopup: false,
        status: '',
        showButton: '',
        title: '',
        user: [],
        taglist: [{ itemKey: '信息详情', itemValue: 'detailInfo' },
          { itemKey: '处理过程', itemValue: 'instruInfo' }],
        currentItem: '',
        showInfo: true,
        showShangji: true,
        showInstr: false,
        showDetail: false,
        showComment: false,
        leadMessage: '', // 领导批示内容
        expandImg: 'gs-plus-square-o',
        leaders: [],
        instru: {
          content: '',
          smsNotice: '1',
          weixinNotice: '1'
        },
        sendInstruWay: [
          { key: 'wechat', value: '微信送审' },
          { key: 'message', value: '短信送审' }
        ],
        beInfo: {
          instructionUsername: '',
          instructionTimeStr: '',
          instructionContent: ''
        },
        instructionId: '',
        leaderId: '',
        eventBase: {
          infoId: '',
          infoTitle: '',
          infoAddress: '',
          eventTypeName: '',
          incidentDateStr: '',
          reportDateStr: '',
          eventDescription: '',
          eventMeasures: '',
          reportPerson: '',
          reportPersonPhone: '',
          org: {
            orgName: ''
          },
          checkPerson: '',
          opinion: '',
//          回复列表
          checkReplys: [],
          eventType: '',
          continueReportExist: false,
          relateExist: false
        },
        checkList: [
          {
            handleUserName: '',
            handleMsg: ''
          }
        ],
        finishEvent: {},
        isExpandCheck: false,
        submitStatus: false,
        addInstruFlag: false,
        isEdit: false,
        record: {},
        supRecord: {},
        sub: {
          applyRrecord: [],
          applyRecordDtos: []
        },
        sup: {
          applyRrecord: [],
          applyRecordDtos: []
        },
        checkMessage: '',
        currentUserId: ''
      }
    },
    // 组件
    components: {
      Scroller,
      Tab,
      TabItem,
      XInput,
      XTextarea,
      Cell,
      Group,
      Checklist,
      InfoViewItem,
      InstructTimeline,
      XButton,
      Datetime,
      Flexbox,
      FlexboxItem,
      Tabbar,
      TabbarItem,
      Popup,
      Box,
      Divider,
      CellBox
    },
    beforeCreate() {
      this.ifShow = false
      this.$store.dispatch('showPageLoading')
    },
    // vue实例创建后调用
    created() {
      this.id = this.$router.history.current.params.id
      this.status = this.$router.history.current.params.status
      this.show(this.status)
    },
    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
//          进入路由的时候隐藏弹窗
          vm.showAdviseOption = false
          vm.showCheckPopup = false
          vm.showPopupTrans = false
          vm.showSupervise = false
          vm.typeStr = vm.iconShortTxt(vm.eventBase.eventType)
          if (from.name === 'bigImg') {
//            页面滚动高度
            vm.$refs.mainScroll.scrollTop = vm.$store.state.scrollTop
            return
          }
          vm.$store.commit('scrollTop', 0)
          vm.$store.commit('setHeaderRightIcon', 'more') // 隐藏右边按钮
          vm.$store.commit('setHeaderTitle', '信息办理')  // 设置头部文字
          vm.fetchData()
          if (from.name === 'DealInstructSend') {
            vm.getData('instr', vm.id)
          }
          if (from.name === 'MyInfo') {
            // this.$store.commit('setDealWindow', typeName)
            vm.showBlock(vm.$store.state.dealWindow)
          }
          if (vm.$store.state.dealWindow === 'advise') { // 如果在拟办窗口选择过领导 则弹出拟办窗口
            vm.showAdviseOption = true
          } else if (vm.$store.state.dealWindow === 'trans') {
            vm.showPopupTrans = true
          } else if (vm.$store.state.dealWindow === 'supervise') {
            vm.showSupervise = true
          } else if (vm.$store.state.dealWindow === 'check') {
            vm.showCheckPopup = true
          }
        }
      )
    },
    beforeRouteLeave(to, from, next) {
      const popupArgs = this.$store.state.popupArgsList
      if (popupArgs.length && to.name !== 'LeaderSelect') { // 领导选择允许跳页
        const arg = popupArgs[popupArgs.length - 1]
        this[arg] = false
        this.$store.commit('removePopupArg', arg)
        next(false)
      } else {
        this.$store.commit('setHeaderRightIcon', '') // 隐藏右边按钮
        next()
      }
    },
    watch: {
//      领导批示
      showComment(val) {
        if (val) {
          this.$store.commit('addPopupArgsList', 'showComment')
        } else {
          this.$store.commit('removePopupArg', 'showComment')
        }
      },
      showAdviseOption(val) {
        if (val) {
          this.$store.commit('addPopupArgsList', 'showAdviseOption')
        } else {
          this.$store.commit('removePopupArg', 'showAdviseOption')
        }
      },
      showPopupTrans(val) {
        if (val) {
          this.$store.commit('addPopupArgsList', 'showPopupTrans')
        } else {
          this.$store.commit('removePopupArg', 'showPopupTrans')
        }
      },
      showSupervise(val) {
        if (val) {
          this.$store.commit('addPopupArgsList', 'showSupervise')
        } else {
          this.$store.commit('removePopupArg', 'showSupervise')
        }
      },
      showCheckPopup(val) {
        if (val) {
          this.$store.commit('addPopupArgsList', 'showCheckPopup')
        } else {
          this.$store.commit('removePopupArg', 'showCheckPopup')
        }
      }
    },
    computed: {
      isWatch: { // 页面是否可以支持操作 是否查看页面
        get() {
          return this.$store.state.infoPageManipulable
        },
        set() {

        }
      },
      // 与父组件通信用属性
      isShowApply: {
        get() {
          if (!this.eventBase) {
            return false
          }
          if (!this.eventBase.commonInstructionDto) {
            return false
          }

          if (this.eventBase.commonInstructionDto.flag !== 0) {
            return true
          }
          return false
        }
      },
      mini() {
        if (this.$store.state.projectType === 'mini') {
          return 'miniApp'
        }
        return ''
      },
      scrollerHeight() {
        if (this.showAdviseOption) {
          return 'adviseOption'
        } else if (this.showCheckPopup) {
          return 'showCheck'
        } else if (this.showPopupTrans) {
          return 'showPopupTrans'
        }
        return ''
      },
      showAllInfo() {
        return !(this.showAdviseOption || this.showCheckPopup)
      },
      isShowTrans: {
        get() {
          if (!this.eventBase) {
            return false
          }
          if (!this.eventBase.trunToDisposeDtos) {
            return false
          }

          if (this.eventBase.trunToDisposeDtos.length > 0) {
            return true
          }
          return false
        }
      },
      isShowWork: {
        get() {
          if (!this.eventBase) {
            return false
          }
          if (!this.eventBase.infoInstructionDtos) {
            return false
          }
          if (this.eventBase.infoInstructionDtos.length > 0) {
            return true
          }
          return false
        }
      },
      isInstruHighLight() {
        if (this.eventBase) {
          if (this.eventBase.commonInstructionDto) {
            if (!this.eventBase.commonInstructionDto.instructionContent
              || this.eventBase.commonInstructionDto.instructionContent === '') {
              return 'btn-highLight'
            }
          }
        }
        return ''
      },
      isCheckHighLight() {
        let checkCss = ''
        if (this.auditingList) {
          const valueArr = Object.values(this.auditingList) // 获取对象的属性值数组
          valueArr.forEach((value) => {
            if (value.handleUser === this.currentUserId && !value.handleMsg) {
              checkCss = 'btn-highLight'
            }
          })
        }
        return checkCss
      }
    },
    methods: {
//      进入编辑
      showContinue() {
        this.eventBase.continueReportExist = true
      },
      infoEdit() {
        this.$router.push(`/report/editInfoChief/${this.id}`)
      },
      iconShortTxt(eventType) { // 四大类首字 作为cell头部 参数为事件类型code 返回类型首字
        let txt = ''
        let img = ''
        if (eventType.substring(0, 2) === '11') {
          txt = '自然灾害'
          img = require('assets/image/nature.png')
        } else if (eventType.substring(0, 2) === '12') {
          txt = '事故灾难'
          img = require('assets/image/danger.png')
        } else if (eventType.substring(0, 2) === '13') {
          txt = '公共卫生'
          img = require('assets/image/hospital.png')
        } else if (eventType.substring(0, 2) === '14') {
          txt = '社会安全'
          img = require('assets/image/social.png')
        }
        return { txt, img }
      },
//    控制审核页面回复内容的设置
      setList() {
        this.$refs.setList.setList()
      },
//        进入编辑页面
      enterEdit(e) {
        if (e.stopPropagation) {
          e.stopPropagation()
        } else {
          e.cancelBubble = true
        }
      },
      conclude() {
        this.$router.push(`/deal/conclude/${this.id}`)
      },
      headerRightClick() { // 头部右键点击事件
        const that = this
        that.ifShow = !that.ifShow
      },
      hiddenShell() {
        this.ifShow = false
      },
      orgSelected(data) {
        this.orgSelected = data
      },
      // 加载初始化数据
      fetchData() {
        this.id = this.$route.params.id
        this.getData('detailInfo', this.id)
        this.loadAuditingList()
        this.instructPanel()
        this.transLoad()
        this.loadDeal(this.id)
        this.userId = this.$store.state.user.username
//        this.leaderCommit()
      },
      // 加载拟办、审核、转办、督办数据
      loadAuditingList() {
        const vm = this
//        审核
        const URLA = `${siteUrl}/eventInfo/${vm.id}/disposes/3`
        vm.$http.get(URLA).then((res) => {
          vm.auditingList = res.body.response
        })
      },
//      拟办意见
      instructPanel() {
        //        拟办
        const vm = this
        const URLP = `${siteUrl}/eventInfo/${vm.id}/disposes/2`
        vm.$http.get(URLP).then((res) => {
          vm.instructionPanel = res.body.response
        })
      },
//      转办督办页面
      transLoad() {
//        转办督办 5
        const vm = this
        const URLT = `${siteUrl}/eventInfo/${vm.id}/disposes/5`
        vm.$http.get(URLT).then((res) => {
          vm.instructTrans = res.body.response
        })
      },
      // 办结页面
      completeLoad() {
//        办结 16
        const vm = this
        const URLT = `${siteUrl}/eventInfo/${vm.id}/disposes/16`
        vm.$http.get(URLT).then((res) => {
          vm.completeList = res.body.response
        })
      },
//      领导批示
      loadDeal(id) {
        const vm = this
        const URLD = `${siteUrl}/eventInfo/${id}/disposes/12`
        vm.$http.get(URLD).then((res) => {
          vm.instList = res.body.response
        })
      },
      showCheckPop() {
        this.showCheckPopup = true
      },
      showPopupTransPop() {
        this.showPopupTrans = true
      },
      infoContinue() {
        this.showContinued = true
      },
      // 提交拟办意见
      appendAdvise(targets, comment) {
        const url = `${siteUrl}/eventdispose/propose`
        const data = {
          mainObjectId: this.id,
          handleUser: targets.join(','),
          opinionContent: comment
        }
        const submitStatus = this.validateHandle(data)
        if (submitStatus) {
          const vm = this
          this.$vux.confirm.show({
            title: '确认送审？',
            content: '',
            onConfirm() {
              vm.$http.post(url, data).then((res) => {
                if (res.body.code === 200) {
                  // 返回码不正确时直接结束
                  // alert('提交拟办成功')
                  vm.$vux.toast.text('提交拟办成功', 'middle')
                  vm.showAdviseOption = false
                  vm.$refs.dialogAdvise.clear()
                  vm.$refs.dialogAdvise.cancel()
                  vm.changeTab('detailInfo')
                  vm.$store.commit('resetLeaderList')
                  vm.$store.commit('setDealWindow', '')
//                  刷新拟办列表
                  vm.instructPanel()
                } else {
                  // alert(res.body.message)
                  vm.$vux.toast.text(res.body.message, 'middle')
                }
              })
            }
          })
        }
      },
      validateHandle(item) {
        if (!item.handleUser) {
          // alert('请选择送审领导')
          this.$vux.toast.text('请选择送审领导', 'middle')
          return false
        } else if (!item.opinionContent) {
          // alert('请输入拟办意见')
          this.$vux.toast.text('请输入拟办意见', 'middle')
          return false
        }
        return true
      },
      validateApply(item) {
        if (item.targets.length === 0) {
          // alert('请选择发送的领导')
          // return false
        }
        if (!item.handleMsg) {
          // alert('请输入审核意见')
          this.$vux.toast.text('请输入审核意见', 'middle')
          return false
        }
        return true
      },
      // 提交审核
      appendApply(comment, targets) {
        const data = {
          handleMsg: comment,
          mainObjectId: this.id,
          targets
        }
        const submitStatus = this.validateApply(data)
        if (submitStatus) {
          const vm = this
          this.$vux.confirm.show({
            title: '确认提交审核意见？',
            content: '',
            onConfirm() {
              const url = `${siteUrl}/eventdispose/check`
              vm.$http.post(url, data).then((res) => {
                if (res.body.code === 200) {
                  // 返回码不正确时直接结束
                  // alert('审核成功')
                  vm.$vux.toast.text('审核成功', 'middle')
                  vm.showCheckPopup = false
                  vm.$store.commit('resetLeaderList')
                  vm.$store.commit('setDealWindow', '')
                  vm.$refs.dialogApply.clear()
//                  vm.refreshTimeline()
                  vm.loadAuditingList()
                } else {
                  // alert('服务器异常')
                  vm.$vux.toast.text('服务器异常', 'middle')
                }
              })
            }
          })
        }
      },
      // 信息转办
      appendTrans(targets, members, comment, active) {
        const item = {
          commentValidate: comment,
          membersValidate: members,
          targets
        }
        const submitStatus = this.validateTrans(item)
        if (submitStatus) {
          const vm = this
          if (active === '5') {
            this.title = '转办'
          } else {
            this.title = '督办'
          }
          this.$vux.confirm.show({
            title: `确认${this.title}?`,
            content: '',
            onConfirm() {
              const url = `${siteUrl}/eventdispose/assign`
              const data = {
                transactOrgName: targets.join(','),
                transactUserName: members.join(','),
                opinionContent: comment,
                infoId: vm.id,
                attachId: vm.$refs.dialogTrans.serverIds,
                disposeType: active
              }
              vm.$http.post(url, data).then((res) => {
                if (res.body.code === 200) {
                  // 返回码不正确时直接结束
                  // alert('提交成功')
                  vm.$vux.toast.text('提交成功', 'middle')
                  vm.showPopupTrans = false
                  vm.$store.commit('resetLeaderList')
                  vm.$store.commit('setDealWindow', '')
                  vm.$refs.dialogTrans.clear()
                  vm.refreshTimeline()
//                  刷新转办列表
                  vm.transLoad()
                } else {
                  vm.$vux.toast.text(res.body.message, 'middle')
                  // alert(res.body.message)
                }
              })
            }
          })
        }
      },
      // 信息督办
      appendSupervise(targets, comment) {
        const vm = this
        this.$vux.confirm.show({
          title: '确认督办？',
          content: '',
          onConfirm() {
            const url = `${siteUrl}/eventInfo/transact/superviseSave`
            const data = {
              transactOrgName: targets.join(','),
              transactUserName: '',
              opinionContent: comment,
              infoId: vm.id,
              attachId: vm.$refs.dialogSupervise.serverIds
            }
            vm.$http.post(url, data).then((res) => {
              if (res.body.code === 200) {
                // 返回码不正确时直接结束
                // alert('提交成功')
                vm.$vux.toast.text('提交成功', 'middle')
                vm.showSupervise = false
                vm.$store.commit('resetLeaderList')
                vm.$store.commit('setDealWindow', '')
                vm.$refs.dialogSupervise.clear()
//                vm.refreshTimeline()
              } else {
                vm.$vux.toast.text('服务器异常', 'middle')
                // alert('服务器异常')
              }
            })
          }
        })
      },
      validateTrans(item) {
        if (item.targets.length === 0) {
          // alert('请选择接收的单位')
          this.$vux.toast.text('请选择接收的单位', 'middle')
          return false
        } else if (!item.commentValidate) {
          // alert('请输入备注')
          this.$vux.toast.text('请输入备注', 'middle')
          return false
        }
        return true
      },
      dimssPop() {
        const vm = this
        vm.leadMessage = ''
        vm.showComment = false
        vm.selectInstrLeadList = []
      },
      leaderCommit() {
        const vm = this
        this.$vux.confirm.show({
          title: '确认提交批示？',
          content: '',
          onConfirm() {
            const url = `${siteUrl}/eventdispose/instruct`
            const data = {
              mainObjectId: vm.id,
              instructionUserId: vm.selectInstrLeadList[0],
              instructionContent: vm.leadMessage,
              flag: '2'
            }
            vm.$http.post(url, data).then((res) => {
              if (res.body.code === 200) {
                // 返回码不正确时直接结束
                // alert('提交成功')
                vm.$vux.toast.text('提交成功', 'middle')
                vm.showComment = false
                vm.$refs.importPanel.init(vm.$router.history.current.params.id)
                vm.refreshTimeline()
                //  leadMessage
                console.log(vm.leadMessage)
                vm.leadMessage = ''
                vm.selectInstrLeadList = []
              } else {
                vm.$vux.toast.text(res.body.message, 'middle')
                // alert(res.body.message)
              }
            })
          }
        })
      },

      init() {

      },
      reportSub() {
//        alert('此功能暂未开放，敬请期待~~')
//        this.$router.push(`/deal/sendLeader/${this.id}`)
        this.$router.push(`/report/editInfoShare/${this.id}`)
      },
      // 进入编辑页面
      Edit() {
        this.$router.push(`/report/editInfoChief/${this.id}`)
        this.showBtn = false
      },
      getEventBase(val) {
        const that = this
        const URL = `${siteUrl}${this.$REST.EventInfo.VIEW}/${val}`
        this.$http.get(URL).then(function (response) {
          that.$store.dispatch('hidePageLoading')
          if (response.body.code === 200) {
            that.eventBase = response.body.response
            if (this.eventBase.attachExist) {
              this.attachs = JSON.parse(this.eventBase.imgAttach)
            }
            if (this.eventBase.showOperation === '0') {
              this.showOperation = false
            } else {
              this.showOperation = true
            }
            const currentUser = this.$store.state.user
            if (this.eventBase.showOperation === '0' || (this.eventBase.infoStatus === '1' && currentUser.typeCode === 0)) {
              this.showEdit = false
            } else {
              this.showEdit = true
            }
            const dtos = that.eventBase.applyRecordDtos
            if (dtos) {
              const valArr = Object.values(dtos)  // 获取对象中的属性名，并且是一个数据
              valArr.forEach((value) => {
                that.checkList.push(value)
              })
            }
            const dto = that.eventBase.applyRrecord
            if (dto) {
              const valArr1 = Object.values(dto)
              valArr1.forEach((value) => {
                that.checkList.push(value)
              })
            }
            this.title = this.eventBase.infoTitle
            this.convertUsers(this.eventBase)
//            that.$nextTick(() => { // 重置滚动
//              that.$refs.infoScroll.reset({
//                top: 0
//              })
//            })
          }
        })
      },
      convertUsers(data) {
        // 主报
        // 获取到data.applyRrecord中属性的值，然后生成一个数组
        const that = this
        if (data.applyRecordDtos && data.applyRrecord) {
          const RecordDtosValArr = Object.values(data.applyRecordDtos)
          const RrecordValArr = Object.values(data.applyRrecord)
          RrecordValArr.forEach((value) => {
            if (value.userTypeCode === '1') {
              that.sup.applyRrecord.push(value)
            } else {
              that.sub.applyRrecord.push(value)
            }
            RecordDtosValArr.forEach((Dtosvalue) => {
              if (Dtosvalue.userTypeCode === '1') {
                that.sup.applyRecordDtos.push(Dtosvalue)
              } else {
                that.sub.applyRecordDtos.push(Dtosvalue)
              }
            })
            that.record = this.sub.applyRrecord[0]
            that.supRecord = this.sup.applyRrecord[0]
          })
        }
      },
      convertUser(val) {
        let a = ''
        if (val) {
//            获取到val的属性值，并成一个数组
          const valValArr = Object.values(val)
          valValArr.forEach((value) => {
            a += value
          })
        }
        return a
      },
      /*
       * 获取TAB指向的数据
       */
      getData(item, id) {
        this.checkList = []
        this.attachs = []
        this.instructionId = ''
        const that = this
        that.currentItem = item
        that.changeTab(item)
        if (item === 'instruInfo') {
          this.$refs.timelinePanel.init()
          this.showBtn = false
        } else if (item === 'instr') {
          this.loadDeal(id)
          this.showBtn = false
          this.$refs.importPanel.init(id)
        } else {
          console.log('init main')
          this.getEventBase(id)
          this.loadDeal(id)
          this.showBtn = true
        }
      },
      chooseNoticeWay(keys) {
        this.instru.smsNotice = '0'
        this.instru.weixinNotice = '0'
        const that = this
        if (keys) {
          const keyValArr = Object.values(keys)
          keyValArr.forEach((value) => {
            if (value === 'message') {
              that.instru.smsNotify = '1'
            }
            if (value === 'wechat') {
              that.instru.weixinNotify = '1'
            }
          })
        }
      },
      saveBeInfo() {
        const that = this
        that.beInfo.instructionUserId = that.convertUser(this.user)
        that.beInfo.mainObjectName = 'EVENT_INFO'
        that.beInfo.mainObjectId = that.id
        that.beInfo.flag = '1'
        if (this.isEdit) {
          that.beInfo.id = that.instructionId
          that.beInfo.instructionUserId = that.leaderId
        }
        const data = that.beInfo

        const URL = `${siteUrl}${this.$REST.INSTRUCT.SAVE}`
        this.$vux.confirm.show({
          title: '确认保存？',
          content: '',
          onConfirm() {
            that.$http.post(URL, data).then((response) => {
              if (response.body.code === 200) {
                this.$gsafety.closeWindow(response.body.code)
                // alert('保存成功')
                that.$vux.toast.text('保存成功', 'middle')
                that.$vux.confirm.hide()
              }
            }, () => {
              // alert('操作失败')
              that.$vux.toast.text('操作失败', 'middle')
              that.$vux.confirm.hide()
            })
          }
        })
        that.instructionId = ''
        that.leaderId = ''
      },
      validation(val) {
        if (!val.instructionContent) {
          // alert('请输入批示内容')
          this.$vux.toast.text('请输入批示内容', 'middle')
        } else {
          this.submitStatus = true
        }
      },
      showPopupBtn() {
        this.showBtn = true
      },
      showPopup1() {
        this.showCheckPopup = true
      },
      /*
       * 改变changeTab事件时触发
       */
      changeTab(item) {
        if (item === 'instruInfo') {
          this.showInfo = true
          this.showInstr = false
          this.showDetail = false
          this.showBtn = false
//        this.$refs.timelinePanel.init()
        } else if (item === 'instr') {
          this.showInstr = true
          this.showInfo = false
          this.showDetail = false
          this.showBtn = false
          this.loadDeal(this.id)
        } else {
          this.showInstr = false
          this.showInfo = false
          this.showDetail = true
          this.showBtn = true
          this.getEventBase(this.id)
        }
      },
      expandCheck() {
        this.isExpandCheck = !this.isExpandCheck
        if (this.isExpandCheck) {
          this.expandImg = 'gs-minus-square-o'
        } else {
          this.expandImg = 'gs-plus-square-o'
        }
      },
      show(val) {
        if (val === 7) {
          this.showButton = false
        } else {
          this.showButton = true
        }
      },
      // 刷新时间轴
      refreshTimeline() {
        if (this.$refs.timelinePanel) {
//            提交之后直接刷新  先屏蔽
//          this.$refs.timelinePanel.init()
        }
      },
      showFullScreen(imgs) { // 全屏查看图片
        this.$emit('showFullScreen', imgs)
      },
      showMask(obj) {
        this.$emit('maskShow', obj)
      },
      showScroll() {
        this.scrollTop = this.$refs.mainScroll.scrollTop
        this.$store.commit('scrollTop', 0)
        this.$store.commit('scrollTop', this.scrollTop)
      },
      // 打开与我相关页面
      openAbout(id) {
        // console.log(id + 123456)
        const r = `/eventInfo/myInfo/${id}`
        this.$router.push(r)
      },
      // 根据场景值显示拟办和审核
      showBlock(state) {
        if (state === '2') {
          // 显示拟办
          console.log(' 显示拟办')
        } else {
          // 显示审核
          console.log(' 显示审核')
        }
      }
    }
  }
</script>
