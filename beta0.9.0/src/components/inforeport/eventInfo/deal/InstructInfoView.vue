<!-- 纯查看信息内容页 用于打印 -->
<template>
  <div class="instruction" :class="mini">
    <!--把详情从infoitem里面挪出来-->
    <div class="infoItem">
      <div class="mainRight">
        <h3>{{eventBase.infoTitle}}</h3>
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
    <div class="tabNav">
      <tab :line-width="2">
        <tab-item active-class="red"
                  :selected="currentItem === item.itemValue"
                  v-for="(item,index) in showTagList" :key="index"
                  @on-item-click="getData(item.itemValue)">
          {{item.itemKey}}
        </tab-item>
      </tab>
    </div>
    <div class="mainScroll">
      <!--事件详情(含转办批示拟办审核)-->
      <div class="main_panel" v-show="showDetail">
        <info-item
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
        <instruct-timeline  ref="timelinePanel"
                            @on-init="initTimeline"
                            :infoId="id"></instruct-timeline>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  /*新版*/
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
    span {
      position: absolute;
      font-size: 14px;
      bottom: 0;
      left: 5px;
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
  }
  .linkBtn {
    position: absolute;
    right: 28px;
    font-size: 48px;
    color: #333;
    top: 5px;
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
    width: 98%;
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
  .gs-warning2 {
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
    box-sizing: border-box;
  }
  .watchItem {
    height: calc(~"100vh - 139px");
  }
  .miniApp {
  .mainScroll {
    height: calc(~"100vh - 148px");
  }
    .watchItem {
      height: calc(~"100vh - 110px");
    }
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

  .child-view{
    height:auto;
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
    Tab,
    TabItem,
    XInput,
    Cell,
    Group,
    XButton,
    Popup,
    Box
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import InfoItem from '../../commoncompents/InfoItem.vue'
  import ReferenceList from '../../commoncompents/ReferenceList'
  import InstructTimeline from './InstructTimeline.vue'
  import InstructImport from './InstructImport.vue'
  import InstructionPanel from './InstructionPanel'


  // 启用请求组件
  Vue.use(VueResource)

  export default {
    // 数据模型
    data() {
      return {
        // switch
        userId: '',
        data: {},
        attachs: [],
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
        showButton: '',
        title: '',
        user: [],
        taglist: [
          { itemKey: '信息详情', itemValue: 'detailInfo' },
          { itemKey: '关联信息', itemValue: 'referenceInfo', count: 0 },
          { itemKey: '处理过程', itemValue: 'instruInfo', count: 0 }
        ],
        currentItem: '',
        showInfo: true,
        showReference: false,
        showShangji: true,
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
      Tab,
      TabItem,
      XInput,
      Cell,
      Group,
      InfoItem,
      InstructTimeline,
      InstructImport,
      XButton,
      Popup,
      Box,
      InstructionPanel,
      ReferenceList
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
          vm.$store.commit('setHeaderTitle', '信息详情')  // 设置头部文字
          vm.$store.commit('setInfoPageManipulable', false) // 进入不可操作的信息详情页面
          vm.fetchData()
        }
      )
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('setInfoPageManipulable', true) // 离开信息详情页面 还原可操作
      next()
    },
    computed: {
      mini() {
        if (this.$store.state.projectType === 'mini') {
          return 'miniApp'
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
      headerRightClick() { // 头部右键点击事件
        window.print()
      },
      // 加载初始化数据
      fetchData() {
        this.id = this.$route.params.id
        this.getData('detailInfo')
        this.$refs.referencePanel.loadReference(this.id) // 续报tab
        this.$refs.timelinePanel.init(this.id) // 处理过程tab
        this.loadAuditingList()
        this.instructPanel()
        this.transLoad()
        this.loadDeal(this.id)
        this.completeLoad()
        this.userId = this.$store.state.user.username
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
          vm.instList = []
          vm.instList = res.body.response
        })
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
      getData(item) {
        this.checkList = []
        this.attachs = []
        this.instructionId = ''
        this.currentItem = item
        this.changeTab(item)
      },
      /*
       * 改变changeTab事件时触发
       */
      changeTab(item) {
        if (item === 'instruInfo') {
          this.showInfo = true
          this.showDetail = false
          this.showReference = false
          this.$refs.timelinePanel.init(this.id)
        } else if (item === 'referenceInfo') {
          this.showInfo = false
          this.showReference = true
          this.showDetail = false
          this.$refs.referencePanel.loadReference(this.id)
        } else {
          this.showInfo = false
          this.showDetail = true
          this.showReference = false
          this.loadDeal(this.id)
          this.getEventBase(this.id)
          this.$refs.setList.refreshAddInfo() // 刷新追加续报信息
        }
      },
      initReference(count) { // 初始化关联信息成功回调
        this.setTagList(count, 'referenceInfo')
      },
      initTimeline(count) { // 初始化处理过程成功回调
        this.setTagList(count, 'instruInfo')
      },
      setTagList(count, type) {
        this.taglist.forEach((tag) => {
          if (tag.itemValue === type) {
            tag.count = count
          }
        })
      }
    }
  }
</script>
