<template>
  <div class="instruction" @click="hiddenShell" :class="mini">
    <div class="infoItem">
      <div class="other">
        <h3>{{eventBase.infoTitle}}</h3>
        <p>{{eventBase.createTimeStr}}</p>
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
        <other-item
          :showAllInfo="showAllInfo"
          :data="eventBase"
          :attachs="attachs"
          :showOperation="showOperation"
          :auditingList="auditingList"
          :instructionPanel="instructionPanel"
          :instList="instList"
          :instructTrans="instructTrans"
          :id = 'id'
          :userId="userId"
          ref="setList"
          :backContent="backContent"
          @maskShow="showMask"
          @showFullScreen="showFullScreen">
        </other-item>
      </div>
      <!--end导航-->
      <!--信息流程-->
      <div class="main_panel" :class="{'flow':showInfo}" v-show="showInfo">
        <instruct-timeline  ref="timelinePanel" :infoId="id"></instruct-timeline>
      </div>
      <!--领导批示-->
      <div class="main_panel" :class="{'instruct':showInstr}" v-show="showInstr">
        <instruct-import @on-add-click="showComment=true" :eventId="id"  ref="importPanel"></instruct-import>
      </div>
    </div>
    <!--</scroller>-->

    <!-- 心事弹窗 -->
    <div class="dealBtnGroup" v-if ="showOperation"  position="bottom">
      <!-- <span slot="label" class="dealBtn" @click="Edit">编辑</span>-->
      <span slot="label" class="dealBtn gs-list3" :class="isInstruHighLight" @click="showAdvisePop">拟办意见</span>
      <span slot="label" class="dealBtn gs-list-alt" :class="isCheckHighLight" @click="showCheckPop">审核意见</span>
      <span slot="label" class="dealBtn gs-external-link" @click="showPopupTransPop">转办督办</span>
      <!--<span slot="label" class="dealBtn" @click="showSupervise=true;showBtn=false">督办</span>-->
      <span slot="label" class="dealBtn gs-calendar-minus-o" @click="conclude">办结</span>
      <span slot="label" class="dealBtn gs-sign-up" @click="reportSub">呈报上报</span>
    </div>
    <!--下级底部按钮-->
    <div class="dealBtnGroup" v-if ="!showOperation"  position="bottom">
      <span slot="label" class="dealBtn gs-th-list" @click="infoContinue">信息续报</span>
      <span slot="label" class="dealBtn gs-disposalReport" @click="infoEdit">信息编辑</span>
      <span slot="label" class="dealBtn gs-share2" @click="reportSub">信息分享</span>
    </div>
    <!-- 拟办场景 -->
    <event-advise :id="id" :eventBase="eventBase" v-model="showAdviseOption" ref="dialogAdvise" @on-confirm="appendAdvise"></event-advise>
    <!-- 信息审核场景 -->
    <event-apply v-model="showCheckPopup" ref="dialogApply" @on-confirm="appendApply"></event-apply>

    <popup v-model="showComment" class="leadSel">
      <div class="head">领导批示</div>
      <box gap="10px 10px">
        <div class="popup0">
          <group>
            <leader-selector leaderType='2' v-model="selectInstrLeadList" label="选择领导" maxLength="1"></leader-selector>
          </group>
          <group>
            <x-textarea v-model="leadMessage" :max="500" placeholder="输入批示信息"></x-textarea>
          </group>
          <group>
            <x-button type="theme" @click.native="leaderCommit">批示</x-button>
            <x-button type="default" @click.native="showComment=false">取消</x-button>
          </group>
        </div>
      </box>
    </popup>
    <!--转办弹窗-->
    <event-trans :type="'5'" ref="dialogTrans" v-model="showPopupTrans" @on-confirm="appendTrans"></event-trans>
    <!--督办弹窗-->
    <event-trans :type="'6'" ref="dialogSupervise" v-model="showSupervise" @on-confirm="appendSupervise"></event-trans>

  </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
  /*新版*/
  .infoItem {
    overflow: hidden;
    background: #fff;
    padding: 0 10px;
    position: relative;
    border-bottom: 1px solid #ddd;
  .other {
    font-size: 14px;
    text-align: center;
    color: #333;
  }
  p {
    font-weight: 400;
    font-size: 12px;
  }
  .linkBtn {
    position: absolute;
    right: 10px;
    font-size: 35px;
    color: #248bff;
    top: 10px;
  }
  .mainLeft {
    width: 20%;
    font-size: 12px;
    height: 100px;
    text-align: center;
    padding-top: 10px;
  > img {
      width: 60px;
      height: 60px;
    }
  > p {
      text-align: center;
      color: #888;
    }
  }
  .mainRight {
    width: 78%;
  h3 {
    font-size: 14px;
    line-height: 38px;
  }
  .firstL {
    font-size: 12px;
    color: #333;
  span {
    font-weight: bold;
    margin-right: 20px;
  }
  .gs-warning2 {
    color: #333;
    font-size: 14px;
    margin-right: 5px;
  }
  .upSend {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #4e8cff;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    margin-right: 5px;
    font-style: normal;
  }
  }
  .secondL {
  span {
    font-size: 12px;
    color: #8A8A8A;
    margin-right: 26px;
  }
  }
  .thirdL {
    display: flex;
  span {
    font-size: 12px;
    color: #006666;
  }
  span:nth-child(1) {
    flex:1;
  }
  span:nth-child(2) {
    flex: 0 0 30%;
  }
  }
  }
  }
  /*新版结束,常规*/
  .mainScroll {
    /*margin-bottom: 35px;*/
    height: calc(~"100vh - 190px");
    overflow: scroll;
    box-sizing: border-box;
  }
  .miniApp {
  .mainScroll {
    height: calc(~"100vh - 110px");
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
    font-size: 16px;
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
    background: #f2f2f2;
    border-top:1px solid #e2e2e2;
    box-shadow: 0 -2px 1px #e2e2e2;
    // background-image:-webkit-linear-gradient(
    //   to bottom,
    //   rgba(255,255,255,0) 0%,
    //   rgba(255,255,255,0) 5%,
    //   rgba(255,255,255,0) 10%,
    //   rgba(255,255,255,1) 50%,
    //   rgba(255,255,255,1) 80%,
    //   rgba(255,255,255,1) 100%);
    // background-image: linear-gradient(
    //   to bottom,
    //   rgba(255,255,255,0) 0%,
    //   rgba(255,255,255,0) 5%,
    //   rgba(255,255,255,0) 10%,
    //   rgba(255,255,255,1) 50%,
    //   rgba(255,255,255,1) 80%,
    //   rgba(255,255,255,1) 100%);
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

  import InstructTimeline from './InstructTimeline.vue'
  import InstructImport from './InstructImport.vue'
  import LeaderSelector from '../../../gsafetycomponents/LeaderSelector'
  import OrgCheckList from '../../commoncompents/OrgCheckList'
  import EventAdvise from './EventAdvise'
  import EventApply from './EventApply'
  import EventTrans from './EventTrans'
  import AuditingList from '../../commoncompents/AuditingList'
  import InstructionPanel from './InstructionPanel'
  import EventPopover from './EventPopover'
  import instructTrans from '../../commoncompents/instructTrans'
  import DealWork from './DealWork'
  import OtherItem from './../../commoncompents/OtherItem.vue'

  // 启用请求组件
  Vue.use(VueResource)

  export default {
    props: {
      backContent: {
        type: String,
        default: ''
      }
    },
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
        showSupervise: false,
        selectInstrLeadList: [],
        id: '', // 信息id
        auditingList: [], // 审核记录列表
        instructionPanel: [], // 拟办录
        instructTrans: [], // 转办记录
        instList: [], // 领导审核记录
        transList: [],
        showBtn: true,
        showOperation: true,
        showCheckPopup: false,
        status: '',
        showButton: '',
        title: '',
        user: [],
        taglist: [{ itemKey: '信息详情', itemValue: 'detailInfo' },
          { itemKey: '处理过程', itemValue: 'instruInfo' },
          { itemKey: '领导批示', itemValue: 'instr' }],
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
          eventType: ''
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
      InstructTimeline,
      InstructImport,
      XButton,
      Datetime,
      Flexbox,
      FlexboxItem,
      Tabbar,
      TabbarItem,
      Popup,
      Box,
      Divider,
      CellBox,
      LeaderSelector,
      OrgCheckList,
      EventAdvise,
      EventApply,
      EventTrans,
      AuditingList,
      InstructionPanel,
      EventPopover,
      instructTrans,
      DealWork,
      OtherItem
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
          console.log(vm.eventBase.infoType)
          console.log('vm.eventBase.infoType')
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
//      续报
      infoContinue() {
        this.$router.push(`/report/continuedReport/${this.id}`)
      },
//      进入编辑
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
//      领导批示
      loadDeal(id) {
        const vm = this
        const URLD = `${siteUrl}/eventInfo/${id}/disposes/12`
        vm.$http.get(URLD).then((res) => {
          vm.instList = res.body.response
        })
      },
      showAdvisePop() {
        this.showAdviseOption = true
//        const beforeR = this.$router.history.current.fullPath
//        this.$router.push(`${beforeR}/0`)
      },
      showCheckPop() {
        this.showCheckPopup = true
      },
      showPopupTransPop() {
        this.showPopupTrans = true
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
//                  刷新拟办
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
      }
    }
  }
</script>
