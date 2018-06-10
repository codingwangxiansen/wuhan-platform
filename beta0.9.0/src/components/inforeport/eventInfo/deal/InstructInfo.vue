<template>
  <div class="instruction" :class="mini" ref="parentBox">
    <!--begin导航
        页面由详情，续报，流程，领导批示3个组件组成
        场景：拟办，审核，上报。上报会跳转到呈报页面
    -->
    <div class="parentContent" :class="scrollerHeight">
      <div class="infoItem">
        <div class="mainRight">
          <h3>{{eventBase.infoTitle}}</h3>
          <div class="click-edit">
            <router-link :to="{path:'/report/editInfoChief/' + eventBase.eventInfoId}" v-show="showEdit && isWatch" class="linkBtn">
              <i class="gs-pencil-square-o"></i>
              <div>编辑</div>
            </router-link>
            <a @click="sharePrintPage" class="linkBtn" v-show="showEdit && isWatch">
              <img src="../../../../assets/image/eventInfo/deal/icon-share.png"/>
              <div class="click-share">分享</div>
            </a>
          </div>
          <p class="firstL">
            <i class="gs-warning"></i><span class="eventLevel">{{eventBase.eventLevelName}}</span>
            <i class="upSend">报</i><span>{{eventBase.reportDateStr}}</span>
          </p>
          <p class="secondL">
            <span class="pUnti">信息来源：{{eventBase.reportOrgName}}</span>
            <a class="pName gs-phone3" :href="'tel:'+eventBase.reportPersonPhone">{{eventBase.reportPerson}}</a>
          </p>
        </div>
      </div>
      <div class="mainScroll" @scroll="showScroll" ref="mainScroll">

        <div class="tabNav">
          <tab :line-width="2">
            <tab-item active-class="red"
                      :selected="currentItem === item.itemValue"
                      v-for="(item,index) in showTagList"
                      :key="index"
                      @on-item-click="getData(item.itemValue)">{{item.itemKey}}
            </tab-item>
          </tab>
        </div>
        <!--事件详情(含转办批示拟办审核)-->
        <div class="main_panel" v-show="showDetail">
          <info-item
            @action-success="infoActionSuccess"
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
            :id="id"
            :userId="userId"
            ref="setList">
          </info-item>
        </div>
        <!--end导航-->
        <!--关联信息-->
        <div class="main_panel" :class="{'reference':showReference}" v-show="showReference">
          <reference-list :eventInfoId="id"
                          @on-init="initReference"
                          ref="referencePanel"
                          :isWatch="isWatch">
          </reference-list>
        </div>
        <!--处理过程-->
        <div class="main_panel" :class="{'flow':showInfo}" v-show="showInfo">
          <instruct-timeline
            ref="timelinePanel"
            @on-init="initTimeline"
            :infoId="id"></instruct-timeline>
        </div>
        <!--领导批示-->
        <div class="main_panel" :class="{'instruct':showInstr}" v-show="showInstr">
          <instruct-import
            @on-add-click="showComment=true"
            :eventId="id"
            :isWatch="isWatch"
            ref="importPanel"
            @on-init="initInstruct"
            :showOperation="showOperation">
          </instruct-import>
        </div>
      </div>
      <!-- 弹窗页面弹窗 -->
      <div class="dealBtnGroup" v-if ="showOperation && isWatch"  position="bottom">
        <span slot="label"
              class="dealBtn upper gs-check-square-o"
              :class="[eventBase.signFlag=='1' ? 'disable' : 'highlight']"
              @click="checkSave">
          {{eventBase.signFlag=='1' ? '已签' : '签收'}}
        </span>
        <span slot="label" class="dealBtn upper gs-list3" :class="isInstruHighLight" @click="showAdvisePop">拟办</span>
        <span slot="label" class="dealBtn upper gs-list-alt" :class="isCheckHighLight" @click="showCheckPop">审核</span>
        <span slot="label" class="dealBtn upper gs-sign-up" @click="reportSub">上报</span>
        <span slot="label" class="dealBtn upper gs-external-link" @click="showPopupTransPop">转办</span>
        <span slot="label" class="dealBtn upper gs-calendar-minus-o" @click="conclude">办结</span>
      </div>
      <!--下级底部按钮-->
      <div class="dealBtnGroup" v-show ="!showOperation && isWatch"  position="bottom">
        <span slot="label" class="dealBtn gs-th-list" @click="infoContinue">信息续报</span>
        <span slot="label" class="dealBtn gs-disposalReport" @click="infoEdit">信息编辑</span>
        <span slot="label" class="dealBtn gs-share2" @click="reportShare">信息分享</span>
      </div>
      <!-- 拟办场景 -->
      <event-advise :id="id" :eventBase="eventBase"
                    v-model="showAdviseOption"
                    ref="dialogAdvise"
                    @on-confirm="appendAdvise">
      </event-advise>
      <!-- 信息审核场景 -->
      <event-apply v-model="showCheckPopup"
                   ref="dialogApply"
                   @on-confirm="appendApply">
      </event-apply>
      <!-- 领导批示弹窗 -->
      <popup v-model="showComment" class="leadSel">
        <box gap="10px 10px">
          <div class="popup0">
            <group>
              <cell class="thingType" v-if="switchleader" :value="data.leaderName"  title="选择领导:" @click.native="chooseEventType()"></cell>
              <x-input class="changeLeader" placeholder="输入领导姓名、职务" v-if="!switchleader" v-model="data.leaderName"></x-input>
              <span class="gs-exchange switchChange" @click="switchLeader()">切换</span>
            </group>
            <group>
              <x-textarea v-model="leadMessage" :rows="15" placeholder="输入批示信息"></x-textarea>
            </group>
            <group class="leadSelect">
              <x-button type="default" @click.native="leaderCommit">保存</x-button>
              <x-button type="theme" @click.native="dimssPop">取消</x-button>
            </group>
          </div>
        </box>
      </popup>
      <!--转办弹窗-->
      <event-trans ref="dialogTrans"
                   v-model="showPopupTrans"
                   :title="eventBase.infoTitle"
                   @on-confirm="appendTrans">
      </event-trans>
      <!--续报弹窗-->
      <info-continue :type="'7'" ref="dialogSupervise"
                     :eventInfoId="eventBase.eventInfoId"
                     v-model="showContinued" @addContinue="showContinue">
      </info-continue>
    </div>
    <div class="contact" @click = "gotoChat">
      在线交流
    </div>
  </div>
</template>
<style lang="less" scoped>
  /*新版*/
  .contact {
    width: 40px;
    position: fixed;
    right: 0;
    top: 35%;
    background: rgba(16, 174, 255,.6);
    padding-left: 20px;
    border-bottom-left-radius: 21px;
    border-top-left-radius: 20px;
    color: #fff;
  }
  .switchChange {
    position: absolute;
    top: 12px;
    right: 20px;
    color: #0094ff;
  }
  .changeLeader {
    width: 80% !important;
  }
  .click-edit {
    position: absolute;
    right: 0;
    color: #333;
    top: 5px;
    display: flex;
    width: 25%;
    padding: 5px;
    i{
      font-size: 2em;
    }
    div {
      font-size: 12px;
    }
    .click-share {
      left: 50px;
    }
  }
  .infoItem {
    overflow: hidden;
    background: #fff;
    padding: 5px 20px 0;
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
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .linkBtn {
    color: #333;
    flex: 1;
    text-align: center;
    img{
      width: 25px;
    }
  }
  .mainLeft {
    width: 20%;
    font-size: 12px;
    height: 88px;
    text-align: center;
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
    width: 100%;
  h3 {
    font-size: 16px;
    width: 75%;
    line-height: 26px;
    margin-bottom: 5px;
  }
  .firstL {
    font-size: 12px;
    color: #333;
    .eventLevel {
      width: 60px;
      display: inline-block;
    }
  span {
    font-weight: bold;
  }
  .gs-warning {
    color: #333;
    font-size: 14px;
    margin-right: 5px;
  }
  .upSend {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 50%;
    border: 1px solid;
    text-align: center;
    margin-right: 5px;
    font-style: normal;
  }
  }
  .secondL {
    position: relative;
    .pName {
      display: inline-block;
      margin-left: 10px;
    }
  span {
    font-size: 12px;
    color: #8A8A8A;
    display: inline-block;
  }
  }
    .continues {
    }
    span.tel {
      font-size: 12px;
      color: #006666;
      margin-left: 6px;
    }
  }
  }
  /*新版结束,常规*/
  .mainScroll {
    /*margin-bottom: 35px; 230*/
    height: calc(~"100vh - 150px");
    overflow: scroll;
    box-sizing: border-box;
  }
  .watchItem {
    height: calc(~"100vh - 139px");
  }
  .miniApp {
  .mainScroll {
    height: calc(~"100vh - 120px");
  }
    .watchItem {
      height: calc(~"100vh - 110px");
    }
  }
  /*场景1*/
  /*场景2*/
  /*场景1*/
  .adviseOption {
    padding-bottom: 270px;
  }
  .showCheck {
    padding-bottom: 270px;
  }
  .showPopupTrans {
    padding-bottom: 280px;
  }
  .showContinued{
    padding-bottom: 280px;
  }
  .instruction {
    box-sizing: border-box;
  }
  .leadSel {
    height:93% !important;
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

  .info-title {
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
  }
  @media screen and (max-width: 380px){
    .vux-tab .vux-tab-item {
      font-size: 14px !important;
    }
  }

  @media screen and (min-width: 381px){
    .vux-tab .vux-tab-item {
      font-size: 16px !important;
    }
  }

  .main_panel {
    padding-bottom: 50px;
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
    &.highlight{
      color: #d43e2f;
    }
    &.highlight:before{
      text-shadow: 1px 1px 2px #333;
    }
    &.disable{
      color: #999;
    }
    &.upper{
      letter-spacing: 0.3em;
    }
    a {
      color: #444;
    }
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
    Tab,
    TabItem,
    XInput,
    XTextarea,
    Cell,
    Group,
    XButton,
    Popup,
    Box
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl, appUrl, pageUtils } from '../../../../utils/common'
  import InfoItem from '../../commoncompents/InfoItem.vue'
  import ReferenceList from '../../commoncompents/ReferenceList'
  import InstructTimeline from './InstructTimeline.vue'
  import InstructImport from './InstructImport.vue'
  import LeaderSelector from '../../../gsafetycomponents/LeaderSelector'
  import OrgCheckList from '../../commoncompents/OrgCheckList'
  import EventAdvise from './EventAdvise'
  import EventApply from './EventApply'
  import EventTrans from './EventTrans'
  import InfoContinue from './InfoContinue'
  import AuditingList from '../../commoncompents/AuditingList'
  import EventPopover from './EventPopover'
  import instructTrans from '../../commoncompents/instructTrans'
  import DealWork from './DealWork'


  // 启用请求组件
  Vue.use(VueResource)

  export default {
    // 数据模型
    data() {
      return {
        // switch
        stringValue: '0',
        typeStr: '',
        switchleader: true,
        scrollTop: 0,
        userId: '',
        data: {},
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
        showOperation: true,
        showEdit: true,
        showCheckPopup: false,
        status: '',
        showButton: '',
        title: '',
        user: [],
        taglist: [
          { itemKey: '信息详情', itemValue: 'detailInfo' },
          { itemKey: '关联信息', itemValue: 'referenceInfo', count: 0 },
          { itemKey: '处理过程', itemValue: 'instruInfo', count: 0 },
          { itemKey: '领导批示', itemValue: 'instr', count: 0 }
        ],
        currentItem: '',
        showInfo: true,
        showShangji: true,
        showReference: false,
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
          attachs: '', // 附件信息json字符串
          checkPerson: '',
          opinion: '',
//          回复列表
          checkReplys: [],
          eventType: '',
          continueReportExist: false,
          relateExist: false,
          signFlag: '' // 签收标记
        },
        checkList: [
          {
            handleUserName: '',
            handleMsg: ''
          }
        ],
        finishEvent: {},
        submitStatus: false,
        addInstruFlag: false,
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
        currentUserId: '',
        chatInfo: {},
        teamId: '',
        uid: '',
        sdktoken: ''
      }
    },
    // 组件
    components: {
      Tab,
      TabItem,
      XInput,
      XTextarea,
      Cell,
      Group,
      InfoItem,
      ReferenceList,
      InstructTimeline,
      InstructImport,
      XButton,
      Popup,
      Box,
      LeaderSelector,
      OrgCheckList,
      EventAdvise,
      EventApply,
      EventTrans,
      InfoContinue,
      AuditingList,
      EventPopover,
      instructTrans,
      DealWork
    },
    beforeCreate() {
      this.$store.dispatch('showPageLoading')
    },
    // vue实例创建后调用
    created() {
      this.id = this.$router.history.current.params.id
    },
    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
          vm.$store.commit('setHeaderTitle', '信息办理')  // 设置头部文字
//          进入路由的时候隐藏弹窗
          if (from.name === 'eventTypeSelect') {
            const eventType = vm.$store.state.chooseEventType
            vm.$set(vm.data, 'eventTypeName', eventType.name)
            vm.selectInstrLeadList.push(eventType.name)
            vm.data.leaderName = eventType.name
            vm.showComment = true
          } else {
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
            if (from.name === 'AttachView') {
              return
            }
            vm.$store.commit('scrollTop', 0)
            vm.$store.commit('setHeaderRightIcon', 'more') // 隐藏右边按钮
            vm.fetchData()
            if (from.name === 'DealInstructSend') {
              vm.getData('instr')
            }
            // 判断进入的路由
            if (from.name === 'TransTabs') {
              vm.isWatch = false
            }
            if (vm.$store.state.dealWindow === 'advise') { // 如果在拟办窗口选择过领导 则弹出拟办窗口
              vm.showAdviseOption = true
            } else if (vm.$store.state.dealWindow === 'trans') {
              vm.showPopupTrans = true
            } else if (vm.$store.state.dealWindow === 'supervise') {
              vm.showSupervise = true
            } else if (vm.$store.state.dealWindow === 'check') {
              vm.showCheckPopup = true
              vm.activeScroll()
            }
            vm.$store.commit('setDealWindow', '')
          }
        }
      )
    },
    beforeRouteLeave(to, from, next) {
      const popupArgs = this.$store.state.popupArgsList
      this.isWatch = true
      if (popupArgs.length && to.name !== 'eventTypeSelect' && to.name !== 'LeaderSelect' && to.name !== 'OrgSelect') { // 领导选择允许跳页
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
        } else if (!this.isWatch) {
          return 'watchItem'
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
      },
      isWatch: { // 页面是否可以支持操作 是否查看页面
        get() {
          return this.$store.state.infoPageManipulable
        },
        set() {

        }
      },
      showTagList() {
        const list = this.taglist.map(({ itemKey, itemValue, count }) => {
          if (count !== undefined) {
            const key = `${itemKey}(${count})`
            return {
              itemKey: key,
              itemValue
            }
          }
          return {
            itemKey,
            itemValue
          }
        })
        return list
      }
    },
    methods: {
      switchLeader() {
        const show = this.switchleader
        this.switchleader = !show
      },
      //  打开选择事件类型页面
      chooseEventType() {
        let code
        if (this.data.eventType) {
          code = this.data.eventType
        } else {
          code = ''
        }
        this.$store.commit('setChooseEventType', {
          code,
          name: this.data.eventTypeName ? this.data.eventTypeName : ''
        })
        this.$router.push({
          name: 'eventTypeSelect',
          params: {
            code,
            type: 'leaderType'
          }
        })
      },
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
      conclude() {
        this.$router.push(`/deal/conclude/${this.id}`)
      },
      orgSelected(data) {
        this.orgSelected = data
      },
      // 加载初始化数据
      async fetchData() {
        this.id = this.$route.params.id
        await this.getData('detailInfo')
        await this.$refs.referencePanel.loadReference(this.id) // 续报tab
        await this.$refs.importPanel.init(this.id) // 领导批示tab
        await this.loadAuditingList()
        await this.instructPanel()
        await this.transLoad()
        await this.loadDeal(this.id)
        await this.completeLoad()
        this.userId = this.$store.state.user.username
        this.$store.dispatch('hidePageLoading')
      },
      // 加载拟办、审核、转办、督办数据
      async loadAuditingList() {
        const vm = this
//        审核
        const URLA = `${siteUrl}/eventInfo/${vm.id}/disposes/3`
        const res = await vm.$http.get(URLA)
        vm.auditingList = res.body.response
      },
//      拟办意见
      async instructPanel() {
        //        拟办
        const vm = this
        const URLP = `${siteUrl}/eventInfo/${vm.id}/disposes/2`
        const res = await vm.$http.get(URLP)
        vm.instructionPanel = res.body.response
      },
//      转办督办页面
      async transLoad() {
//        转办督办 5
        const vm = this
        const URLT = `${siteUrl}/eventInfo/${vm.id}/disposes/5`
        const res = await vm.$http.get(URLT)
        vm.instructTrans = res.body.response
      },
      // 办结页面
      async completeLoad() {
//        办结 16
        const vm = this
        const URLT = `${siteUrl}/eventInfo/${vm.id}/disposes/16`
        const res = await vm.$http.get(URLT)
        vm.completeList = res.body.response
      },
//      领导批示
      async loadDeal(id) {
        const vm = this
        const URLD = `${siteUrl}/eventInfo/${id}/disposes/12`
        const res = await vm.$http.get(URLD)
        vm.instList = []
        vm.instList = res.body.response
      },
      activeScroll() {
        this.$refs.setList.resetHeight('2')
        const scrollTop = this.$store.state.scrollTop
        this.$refs.mainScroll.scrollTop = scrollTop
        // 延时跳动
        setTimeout(() => {
          this.$refs.parentBox.scrollTop = 125
        }, 500)
      },
      showAdvisePop() {
        this.showAdviseOption = true
      },
      showCheckPop() {
        this.showCheckPopup = true
        this.activeScroll()
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
                  vm.$store.commit('resetSelectedOrgList')
                  vm.$store.commit('setDealWindow', '')
//                  刷新拟办列表
                  vm.instructPanel()
                  vm.$refs.timelinePanel.init(vm.id)
                } else {
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
                  vm.$vux.toast.text('审核成功', 'middle')
                  vm.showCheckPopup = false
                  vm.$store.commit('resetLeaderList')
                  vm.$store.commit('resetSelectedOrgList')
                  vm.$store.commit('setDealWindow', '')
                  vm.$refs.dialogApply.clear()
                  vm.loadAuditingList()
                  vm.getEventBase(vm.id)
                  vm.$refs.timelinePanel.init(vm.id)
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
      appendTrans(targets, members, comment) {
        const item = {
          commentValidate: comment,
          membersValidate: members,
          targets
        }
        const submitStatus = this.validateTrans(item)
        if (submitStatus) {
          const vm = this
          this.$vux.confirm.show({
            title: '确认转办?',
            content: '',
            onConfirm() {
              const url = `${siteUrl}/eventdispose/instruct/assign`
              const data = {
                orgCodes: targets,
                userids: members,
                opinionContent: comment,
                infoId: vm.id,
                attachId: vm.$refs.dialogTrans.attachId
              }
              vm.$http.post(url, data).then((res) => {
                if (res.body.code === 200) {
                  // 返回码不正确时直接结束
                  // alert('提交成功')
                  vm.$vux.toast.text('提交成功', 'middle')
                  vm.showPopupTrans = false
                  vm.$store.commit('resetLeaderList')
                  vm.$store.commit('resetSelectedOrgList')
                  vm.$store.commit('setDealWindow', '')
                  vm.$refs.dialogTrans.clear()
                  vm.$refs.timelinePanel.init(vm.id)
//                  刷新转办列表
                  vm.transLoad()
                } else {
                  vm.$vux.toast.text(res.body.message, 'middle')
                }
              })
            }
          })
        }
      },
      validateTrans(item) {
        if (item.targets.length === 0 && item.membersValidate.length === 0) {
          // alert('请选择接收的单位')
          this.$vux.toast.text('请选择接收的单位或者接收人', 'middle')
          return false
        } else if (!item.commentValidate) {
          // alert('请输入备注')
          this.$vux.toast.text('请输入转办督办意见！', 'middle')
          return false
        }
        return true
      },
      /**
       * 验证批示信息
       */
      validateDimss(data) {
        if (!data.instructionUserId) {
          this.$vux.toast.text('请选择领导', 'middle')
          return false
        }
        if (!data.instructionContent) {
          this.$vux.toast.text('请输入批示信息', 'middle')
          return false
        }
        // leadMessage
        // 校验输入是否全部是空格的正则
        const reg = /^\s*$/
        if (data.instructionContent === undefined) {
          return false
        } else if (data.instructionContent === null) {
          return false
        } else if (reg.test(data.instructionContent)) {
          // 全部是空格就是true
          return false
        }
        return true
      },
      dimssPop() {
        const vm = this
        vm.showComment = false
      },
      leaderCommit() {
        //  去除回复内容前后的空格
        this.leadMessage = this.leadMessage.trim()
        const vm = this
        const data = {
          mainObjectId: vm.id,
          instructionUserId: vm.data.leaderName,
          instructionContent: vm.leadMessage,
          flag: '2'
        }
        if (!vm.validateDimss(data)) {
          return
        }
        this.$vux.confirm.show({
          title: '确认提交批示？',
          content: '',
          onConfirm() {
            const url = `${siteUrl}/eventdispose/instruct`
            vm.$http.post(url, data).then((res) => {
              if (res.body.code === 200) {
                // 返回码不正确时直接结束
                // alert('提交成功')
                vm.$vux.toast.text('提交成功', 'middle')
                vm.showComment = false
                vm.$refs.importPanel.init(vm.$router.history.current.params.id)
                vm.leadMessage = ''
                vm.selectInstrLeadList = []
                vm.data.leaderName = ''
              } else {
                vm.$vux.toast.text(res.body.message, 'middle')
              }
            })
          }
        })
      },
      // 信息分享
      reportShare() {
        this.$router.push(`/report/editInfoShare/${this.id}`)
      },
      // 进入呈报上报页面
      reportSub() {
        this.$router.push(`/report/shareReport/${this.id}`)
      },
      async getEventBase(val) {
        const that = this
        const URL = `${siteUrl}${this.$REST.EventInfo.VIEW}/${val}`
        await this.$http.get(URL).then(function (response) {
          if (response.body.code === 200) {
            that.eventBase = response.body.response
            // 进来的时候存入当前时间的机构和机构code
            this.$store.commit('setSupervisePerson', {
              orgName: that.eventBase.reportOrgName,
              orgCode: that.eventBase.orgCode
            })
            if (this.eventBase.attachExist) {
              this.attachs = JSON.parse(this.eventBase.attachs)
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
      /*
       * 获取TAB指向的数据
       */
      async getData(item) {
        this.checkList = []
        this.attachs = []
        this.instructionId = ''
        this.currentItem = item
        await this.changeTab(item)
      },
      validation(val) {
        if (!val.instructionContent) {
          // alert('请输入批示内容')
          this.$vux.toast.text('请输入批示内容', 'middle')
        } else {
          this.submitStatus = true
        }
      },
      /*
       * 改变changeTab事件时触发
       */
      async changeTab(item) {
        if (item === 'instruInfo') {
          this.showInfo = true
          this.showReference = false
          this.showInstr = false
          this.showDetail = false
          await this.$refs.timelinePanel.init(this.id)
        } else if (item === 'referenceInfo') {
          this.showInstr = false
          this.showInfo = false
          this.showReference = true
          this.showDetail = false
          await this.$refs.referencePanel.loadReference(this.id)
        } else if (item === 'instr') {
          this.showInstr = true
          this.showInfo = false
          this.showReference = false
          this.showDetail = false
          await this.$refs.importPanel.init(this.id)
        } else {
          this.showInstr = false
          this.showInfo = false
          this.showReference = false
          this.showDetail = true
          await this.getEventBase(this.id)
          await this.$refs.setList.refreshAddInfo() // 刷新追加续报信息
          await this.loadDeal(this.id)
        }
      },
      showScroll() {
        this.scrollTop = this.$refs.mainScroll.scrollTop
        this.$store.commit('scrollTop', 0)
        this.$store.commit('scrollTop', this.scrollTop)
      },
      // 分享打印
      sharePrintPage() {
        if (this.$store.state.projectType === 'mini') {
          this.$vux.toast.text('微信中暂不支持业务数据分享', 'middle')
          return
        }
        // 当前通过微信分享上报信息到系统中，微信分享审核通过前，给出提示场景
        const options = {
          contentType: 1,
          type: 0,
          webpageUrl: `${location.origin}${location.pathname}#/deal/instructView/2/${this.eventBase.eventInfoId}`,
          title: this.eventBase.infoTitle,
          description: this.eventBase.eventDescription
        }
        this.$gsafety.weixinFriends(options.contentType, options.type,
          options.webpageUrl, options.title, options.description)
      },
      checkSave() { // 签收
        if (this.eventBase.signFlag === '1') {
          return
        }
        const vm = this
        this.$vux.confirm.show({
          title: '确认签收？',
          content: '',
          onConfirm() {
            vm.$vux.loading.show({
              text: '签收中'
            })
            const url = `${siteUrl}/eventInfo/${vm.id}/sign`
            vm.axios.get(url).then((res) => {
              vm.$vux.loading.hide()
              if (res.data.code === 200) {
                vm.getEventBase(vm.id)
                vm.$vux.toast.text('签收成功', 'middle')
              } else {
                vm.$vux.toast.text('系统繁忙，请稍后再试', 'middle')
              }
            })
          }
        })
      },
      initReference(count) { // 初始化关联信息成功回调
        this.setTagList(count, 'referenceInfo')
      },
      initTimeline(count) { // 初始化处理过程成功回调
        this.setTagList(count, 'instruInfo')
      },
      initInstruct(count) { // 初始化批示信息成功回调
        this.$refs.timelinePanel.init(this.id) // 处理过程tab
        this.setTagList(count, 'instr')
      },
      setTagList(count, type) {
        this.taglist.forEach((tag) => {
          if (tag.itemValue === type) {
            tag.count = count
          }
        })
      },
      infoActionSuccess() { // 对信息的操作成功 追加 回复等
        this.$refs.timelinePanel.init(this.id) // 处理过程tab
      },
      gotoChat() {
        const url = `${appUrl}/yunxinuser/restapi/list?token=gsafety`
        const data = {
          eventId: this.id
        }
        const vm = this
        this.$vux.confirm.show({
          title: '确认进入在线聊天？',
          content: '',
          onConfirm() {
            vm.$vux.loading.show({
              text: '正在创建聊天群组'
            })
            vm.axios.post(url, data)
              .then((res) => {
                // 回复成功时
                vm.$vux.loading.hide()
                if (res.data.code === 200) {
                  vm.chatInfo = res.data.response.result
                  const sdktoken = pageUtils.getCookie('sdktoken')
                  if (!sdktoken) {
                    // 注册后模拟登录
                    vm.$store.dispatch('refreshNeteaseUser').then((neteaseUser) => {
                      // 这里面是刷新云信用户成功的回调
                      vm.uid = neteaseUser.accid
                      vm.sdktoken = neteaseUser.token
                    })
                  }
                  vm.getChatTeam(vm.id)
                  vm.$vux.confirm.hide()
                } else if (res.data.code === 500) {
                  vm.$vux.toast.text('回复失败！', 'middle')
                  vm.$vux.confirm.hide()
                }
              })
              .catch(() => {
                console.log('请求错误')
                vm.$vux.confirm.hide()
              })
          }
        })
      },
      getChatTeam(val) {
        const url = `${appUrl}/yunxinteam/eventid/${val}`
        const vm = this
        vm.axios.get(url).then((res) => {
          if (res.data.code === 200) {
            const team = res.data.response
            if (team) {
              vm.teamId = team.tid
              vm.jumpChatView(vm.teamId, vm.uid, vm.sdktoken)
            } else {
              vm.creatChatTeam(vm.chatInfo)
            }
          } else {
            vm.$vux.toast.text('系统繁忙，请稍后再试', 'middle')
          }
        })
      },
      creatChatTeam(info) {
        const url = `${appUrl}/yunxinteam/action/create?token=gsafety`
        const data = {
          tname: info.tname,
          owner: info.owner,
          tmembers: info.members,
          announcement: '在线交流群公告',
          intro: '在线交流群介绍',
          msg: '本群提供在线交流方便讨论', // 没有msg创建群会报错
          eventId: this.id
        }
        const vm = this
        vm.axios.post(url, data)
          .then((res) => {
            if (res.data.code === 200) {
              vm.teamId = res.data.response.tId
              vm.$vux.toast.text('创建群组成功', 'middle')
              vm.jumpChatView(vm.teamId, vm.uid, vm.sdktoken)
            } else if (res.data.code === 500) {
              vm.$vux.toast.text('创建群组失败！', 'middle')
            }
          })
          .catch(() => {
            vm.$vux.toast.text('请求错误！', 'middle')
          })
      },
      jumpChatView(tid, uid, sdktoken) {
        if (this.$store.state.projectType === 'mini') {
          this.$gsafety.navigateTo('../neteaseview/neteaseview', {
            tid,
            uid,
            sdktoken
          }, () => {})
          return
        }
        this.$gsafety.openWindowByParam(`${location.origin}/webdemo/h5/index.html#/chat/team-${tid}`, {
          uid,
          sdktoken
        })
      },
      async refresh() {
        await this.fetchData() // 页面刷新数据
      }
    }
  }
</script>
