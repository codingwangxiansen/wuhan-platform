<template>
 <div class="multItem">
   <!-- 领导批示 -->
	  <div class="baseInfo">
      <!--常规信息-->
      <group title="基本信息" class="ma-bottom gs-list4" v-show="data.infoType === 'emergency'">
        <i class="icon" @click.prevent="infoShow = !infoShow" :class="infoShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
        <div class="contain" v-show="infoShow">
          <x-input title="事件类型:" :readonly="flag" :value="data.eventTypeName" :show-clear="false"></x-input>
          <cell title="事发地点:" class="eventAd" :value="shortAddress" @click.native="openGeolocationSelector"></cell>
          <x-input title="事发时间:" :readonly="flag" :value="timeStr" :show-clear="false"></x-input>
        </div>
      </group>
      <div class="tabNav">
        <!--<tab :line-width="2">-->
          <!--<tab-item active-class="red" :selected="currentDetailItem === item.itemValue" v-for="(item,index) in taglist" :key="index"-->
                    <!--@on-item-click="getDetail(item.itemValue)">{{item.itemKey}}-->
          <!--</tab-item>-->
        <!--</tab>-->
        <ul>
          <li :class="currentDetailItem === item.itemValue? 'selected': ''" v-for="(item,index) in taglist" :key="index" @click.stop="getDetail(item.itemValue)">
            {{item.itemKey}}
          </li>
        </ul>
      </div >
      <div class="currentDetail" v-show="currentDetailItem === 'detailInfo'">
      <group v-show="data.infoType === 'emergency'">
        <div class="infoMore">
          <router-link :to="{path:'/report/connectionReport/' + data.eventInfoId}">
            <span v-show="data.relateExist" class="tel">关联接报</span>
          </router-link>
        </div>
        <div class="fileContain" v-show="fileContain">
          <x-textarea v-if="!flag" v-show="isShowDesc" :autosize="autoText" v-model='data.eventDescription'></x-textarea>
          <div v-if="flag" v-show="isShowDesc" class="area">{{data.eventDescription}}</div>
          <div class="time" v-show="data.existsAdditional">{{data.reportDateStr}}</div>
        </div>
        <reply-list :eventInfoId="data.eventInfoId"
                    :currentDetailItem="currentDetailItem"
                    :isWatch="isWatch"
                    :options="{showFooter: showOperation}"></reply-list>
      </group>
    </div>
    </div>
    <!-- 续报 -->
    <div v-show="currentDetailItem === 'continueInfo'">
      <connection-report
        ref="continuePanel"
        :currentDetailItem="currentDetailItem"
        :eventInfoId="data.eventInfoId">
      </connection-report>
    </div>
    <!-- 关联接报 -->
   <div v-show="currentDetailItem === 'referenceInfo'">
     <reference-list :eventInfoId="data.eventInfoId"
                     ref="referen"
                     :isWatch="isWatch"
                     :currentDetailItem="currentDetailItem"
                 :options="{showFooter: showOperation}"></reference-list>
   </div>
    <div class="allInfo" v-show="allInfo">
      <!--拟办 当拟办记录数大于0是显示-->
      <div ref="dealWork">
        <deal-work :userId="userId"
                   v-if="isShowWork"
                   :listDeal="instList">
        </deal-work>
      </div>
      <div ref="insPanel">
        <instruction-panel :showEdit="showEdit"
                           :isWatch="isWatch"
                           :userId="userId"
                           v-if='instructions.length > 0'
                           :data = "instructions"
                           :showOperation="showOperation">
        </instruction-panel>
      </div>
      <!-- 审核-->
      <div ref="auditing">
        <auditing-list :showEdit="showEdit"
                       :isWatch="isWatch"
                       v-if="auditShow"
                       :userId="userId"
                       :list="pageAuditingList"
                       :showOperation="showOperation">
        </auditing-list>
      </div>

      <!--转办  data.trunToDisposeDtos-->
      <div ref="trans">
        <instruct-trans :userId="userId"
                        v-if="instructTrans.length > 0"
                        :listTrans="loadTrans" >
        </instruct-trans>
      </div>
      <!-- 办结信息 -->
      <instruction-complete :showEdit="showEdit"
                            :userId="userId"
                            v-if='completeList.length > 0'
                            :data = "completeInfo"
                            :showOperation="showOperation">
      </instruction-complete>
      <div class="baseInfo">
        <group :title="fileTitle"  class="collpic gs-file-picture">
          <i class="icon" @click.prevent="expandFlag = !expandFlag" :class="expandFlag ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
          <div v-show="expandFlag">
            <attach-upload :attachs="files" :canUpload="false"></attach-upload>
          </div>
        </group>
      </div>
    </div>
      <!--</div>-->
</div>
</template>
<style lang="less" scoped>
  @import "../../../styles/common.less";
  .fileContain .time {
    text-align: left;
    font-size: 12px;
    color: #999;
    font-weight: 400;
    margin: 1px 3px 6px 3px;
  }

  .fileContain{
    padding: 5px 16px 0 16px;
    // text-indent: 2em;
  }
  .tabNav {
    width:100%;
    position: relative;
    z-index: 100;
    ul {
      display: flex;
      background: #fff;
      li {
        list-style: none;
        flex: 1;
        text-align: center;
        margin: 4px;
        border-right: 1px solid #999;
        &:nth-child(3) {
          border-right: none;
        }
      }
      li.selected {
        color: #4e8cff;
      }
    }
  }
  .infoMore {
    position: absolute;
    top: -27px;
    left: 106px;
    color: #248bff;
  }
  .pover-text{
    color: #fff;
    width: 10px;
    margin-left: 86%;
    height: 10px;
    font-size: 18px;
  }
  .pover-text:not(:first-child){
    position:relative;
    &:before {
      content: "";
      display: inline-block;
      position: absolute;
      border-top: 1px solid #9c9898;
      width: 90%;
      top: 0;
      left: 5%;
    }
  }
  .pover-text ::after{
    height: 2px;
    color: #5C5C5E;
  }
  .pover-text i{
    font-size: 25px;
    margin-right: 20px;
    vertical-align: middle;
  }
  .baseInfo .img-box {
    margin: 10px 0 0 10px;
  }
  /*gs-list4*/
  .baseInfo {
    .collpic {
      margin-bottom: 30px;
    }
    & > .tabNav {
      margin-bottom: -1px;
    }
    & > .currentDetail {
      margin-top: -2px;
    }
    &>div {
      border-bottom: 1px solid #e2e2e2;
      border-top: 1px solid #e2e2e2;
      position: relative;
      margin: 5px 0;
      .icon {
        position: absolute;
        right: 15px;
        font-size: 30px;
        top: -35px;
        color: #333;
        width: 35%;
        text-align: right;
      }
    }

    &>section {
      .span-group{
        border-bottom: 1px solid #e2e2e2;
        border-top: 1px solid #e2e2e2;
        position: relative;
        margin: 15px 0;
      }

      .icon {
        position: absolute;
        right: 15px;
        font-size: 30px;
        top: -35px;
        color: #333;
        width: 45%;
        text-align: right;
      }
    }
    .gs-list4:before {
      position: absolute;
      z-index: 9;
      font-size: 20px;
      color: #333;
      top: 10px;
      left: 8px;
    }
    .gs-file-text2:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 12px;
      left: 12px;
    }
    .gs-file-picture:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 12px;
      left: 12px;
    }
  }
  .square-o{
    background: #C0DEED;
    margin: 0;
    line-height: 40px !important;
    color: #fff;
    font-size: 16px;
    padding: 0px 10px;
    text-align: left;
  }
  .square-o span:first-child {
    margin-left: 7px;
  }
  .title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    background: #fff;
    line-height: 2em;
    position: relative;
  }

  .attach-img{
    overflow: hidden;
    margin-bottom: 10px;
  }

  .detail-img {
    width: 33%;
    height: 33vw;
    float: left;
    padding: 0.2rem;
  }

  .detail-video {
    width: 33%;
    height: 33vw;
    float: left;
    padding: 0.2rem;
    color: #666;
    font-size: 50px;
  }

  .detail-video .video-action{
    width: 60%;
    height: 60%;
    text-align: center;
    background: #ddd;
    border-radius: 50%;
    margin-left: 20%;
    margin-top: 20%;
  }

  .video-title{
    padding-left: 20px;
    text-decoration: underline;
  }

  .other-title{
    padding-left: 20px;
    text-decoration: underline;
  }

  .desc {
    div.area {
      color: #333;
      padding: 10px;
      font-size: 14px;
    }

    span.arrow {
      float: right;
      font-size: 30px;
      color: #ddd;
    }
  }
  /*状态*/
 </style>
<script>
// 导入页面所需的标签
import { Cell, Group, XInput, XTextarea, XButton, Datetime, Tab, TabItem } from 'vux'
import { fileserver } from '../../../utils/common'
import SlideImg from './slideImg'
import AuditingList from './AuditingList'
import InstructionPanel from '../eventInfo/deal/InstructionPanel'
import ConnectionReport from '../eventInfo/report/ConnectionReport'
import InstructionComplete from '../eventInfo/deal/InstructionComplete'
import instructTrans from './instructTrans'
import DealWork from '../eventInfo/deal/DealWork'
import AttachUpload from '../../mycomponents/AttachUpload'
import ReplyList from './ReplyList'
import ReferenceList from './ReferenceList'
import TimeController from '../../mycomponents/TimeController'

export default{
  name: 'InfoItem',
  props: {
    showEdit: {
      type: Boolean,
      default: true
    },
    isWatch: { // 是否查看页面
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    userId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    attachs: {
      type: Array,
      default() {
        return []
      }
    },
//    审核
    auditingList: {
      type: Array,
      default() {
        return []
      }
    },
//    拟办
    instructionPanel: {
      type: Array,
      default() {
        return []
      }
    },
//    转办
    instructTrans: {
      type: Array,
      default() {
        return []
      }
    },
//    办结
    completeList: {
      type: Array,
      default() {
        return []
      }
    },
    instList: {
      type: Array,
      default() {
        return []
      }
    },
    showAllInfo: { // 控制隐藏显示详细情况部分
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: null
    },
    showOperation: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 详情显示隐藏
      allInfo: true,
      // 测试视频
      videoPath: '',
      // 附件信息标题
      fileTitle: '附件信息',
      currentDetailItem: 'detailInfo',
      fileContain: true,
      infoShow: true,
      autoText: true,
      dealShow: true,
      readFlag: true,
      imgCss: 'gs-caret-down',
      otherClass: 'gs-plus-square-o',
      isExpandInfo: false,
      expandFlag: false,
      expandAudioFlag: false,
      expandVideoFlag: false,
      isExpandOrg: false,
      isShowDesc: true,
      taglist: [{ itemKey: '情况描述', itemValue: 'detailInfo' },
        { itemKey: '续报信息', itemValue: 'continueInfo' },
        { itemKey: '关联信息', itemValue: 'referenceInfo' }]
    }
  },
  components: {
    Cell,
    Group,
    XInput,
    XTextarea,
    XButton,
    Datetime,
    SlideImg,
    AuditingList,
    InstructionPanel,
    InstructionComplete,
    instructTrans,
    DealWork,
    AttachUpload,
    ReplyList,
    ReferenceList,
    ConnectionReport,
    Tab,
    TabItem,
    TimeController
  },
  created() {
    if (this.$store.state.projectType === 'mini') {
      // this.showAudioPart = false
    }
  },
  watch: {
    $route(to, from) {
      if (from.fullPath === '/deal') {
        this.expandFlag = false
      }
      if (from.name === 'ConnectinfoList') {
        this.currentDetailItem = 'referenceInfo'
        this.$refs.referen.loadReference()
      }
    }
  },
  computed: {
    timeStr() {
      if (this.data.gmtMarker && this.data.incidentDateStr) {
        const dateStr = this.data.incidentDateStr.split(' ')[0]
        const dateTimeStr = this.data.incidentDateStr.split(' ')[1]
        const timeArr = dateTimeStr.split(':')
        let timeDataStr
        if (this.data.gmtMarker === 'A') {
          timeDataStr = `${dateStr}上午`
        } else if (this.data.gmtMarker === 'P') {
          timeDataStr = `${dateStr}下午`
        } else if (this.data.gmtMarker === 'H') {
          timeDataStr = `${dateStr} ${timeArr[0]}时`
        } else {
          timeDataStr = `${dateStr} ${timeArr[0]}:${timeArr[1]}`
        }
        return timeDataStr
      }
      return ''
    },
    shortAddress: {
      get() {
        if (this.data.infoAddress) {
          if (this.data.distCodeName) {
            return this.data.distCodeName + this.data.infoAddress
          }
          return this.data.infoAddress
        }
        return '暂无事件位置'
      }
    },
    flag() {
      if (this.isEdit) {
        return false
      }
      return this.readFlag
    },
    attachFlag() {
      if (this.attachs) {
        if (this.attachs.length > 0) {
          return true
        }
      }
      return false
    },
     // 与父组件通信用属性
    isShowApply: {
      get() {
        if (!this.data) {
          return false
        }
        if (!this.data.commonInstructionDto) {
          return false
        }
        if (this.data.commonInstructionDto.flag !== 0) {
          return true
        }
        return false
      }
    },
    isShowTrans: {
      get() {
        if (!instructTrans) {
          return false
        }
        if (this.instructTrans > 0) {
          return true
        }
        return false
      }
    },
    isShowWork: {
      get() {
        if (this.instList && this.instList.length > 0) {
          return true
        }
        return false
      }
    },
    files() {
      const imagesArr = []
      if (this.data.attachs) {
        this.fileTitle = '附件信息'
        const attachArr = JSON.parse(this.data.attachs)
        attachArr.forEach((attach) => {
          imagesArr.push(attach)
        })
      } else {
        this.fileTitle = '附件信息（暂无附件信息）'
      }
      return imagesArr
    },
    pageAuditingList() {
      return this.auditingList
    },
    // 拟办信息列表
    instructions() {
      return this.instructionPanel
    },
    completeInfo() {
      return this.completeList
    },
    loadTrans() {
      return this.instructTrans
    },
    auditShow() {
      if (this.auditingList) {
        if (this.auditingList.length > 0) {
          return true
        }
        return false
      }
      return false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(
      (vm) => {
        vm.editData()
        vm.$refs.getContinueData()
      })
  },
  methods: {
    // 设置时间数据
    setDate(val) {
      this.data.incidentDateStr = val
    },
    getDetail(item) {
      if (item === 'detailInfo') {
        this.allInfo = true
      } else {
        this.allInfo = false
      }
      const that = this
      that.currentDetailItem = item
    },
    isExist() {
      const existData = [this.data.economylose, this.data.effectRadius, this.data.woundNum,
        this.data.deathNum, this.data.disappearNum, this.data.lockNum,
        this.data.eventCause, this.data.eventOrginLost, this.data.supportReguest,
        this.data.remark]
      if (existData) {
        const valArr = Object.values(existData)
        valArr.forEach((value) => {
          if (!value) {
            return false
          }
          return true
        })
      }
    },
    editData() {
      if (!this.isEdit) {
        this.readFlag = false
      } else {
        this.readFlag = true
      }
    },
    showFullScreen(imgs) { // 全屏查看图片
      this.$emit('showFullScreen', imgs)
    },
    getAttachPath(item) {
      return fileserver + item
    },
    expandOther() {
      this.isExpandInfo = !this.isExpandInfo
      if (this.isExpandInfo) {
        this.otherClass = 'gs-minus-square-o'
      } else {
        this.otherClass = 'gs-plus-square-o'
      }
    },
    /* 打开GeolocationSelector */
    openGeolocationSelector() {
      const g = {
        x: this.data.longitude,
        y: this.data.latitude,
        address: this.data.infoAddress,
        county: this.data.distCodeName,
        isEdit: false
      }
      this.$store.commit('setGisLocation', g)
      this.$router.push('/deal/GeolocationSelector')
    },
    isBack() {
      if (this.expandFlag) {
        this.imgCss = 'gs-caret-up'
      } else {
        this.imgCss = 'gs-caret-down'
      }
      this.expandFlag = !this.expandFlag
    },
    toggleShowDesc() {
      this.showDesc = !this.showDesc
    },
    playVideo(video) {
      // 小程序中的video 测试
      if (this.$store.state.projectType === 'mini') {
      // alert('9999')
        this.videoPath = video.attachPath
        // this.playerOptions.sources.src = location.origin + this.getAttachPath(video.attachPath)
        this.$refs.playV.onPlayerPlay()
        return
      }
      const videoObj = {
        id: video.id,
        path: video.attachPath
      }
      this.$gsafety.playVideo(videoObj)
    }
  }
}
</script>
