<template>
 <div class="multItem no-border">
	  <div class="baseInfo">
      <!--常规信息-->
      <group gutter="0" class="ma-bottom">
        <div class="contain">
          <x-input title="事件类型:" :readonly="true" :value="data.eventTypeName" :show-clear="false"></x-input>
          <cell title="事发地点:" class="eventAd" :value="shortAddress" @click.native="openGeolocationSelector"></cell>
          <x-input title="事发时间:" :readonly="true" :value='timeStr' :show-clear="false"></x-input>
        </div>
      </group>
      <group title="情况描述" class="gs-file-text2">
        <i class="icon"
           @click.prevent="infoShow = !infoShow"
           :class="infoShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' ">
        </i>
        <div v-show="infoShow">
          <div class="fileContain">
            <x-textarea ref="descriptionArea"
                        autosize
                        readonly
                        :rows="1"
                        v-model='data.eventDescription'>
            </x-textarea>
            <div class="time" v-show="hasAddInfo">{{data.reportDateStr}}</div>
          </div>
          <!-- 追加 -->
          <reply-list :eventInfoId="data.eventInfoId"
                      @on-success="addInfoSuccess"
                      @on-init="initReplyList"
                      :isWatch="isWatch"
                      :options="{showFooter: showOperation}"
                      ref="replyList">
          </reply-list>
        </div>
        </group>
      <!-- 续报 -->
      <group title="续报信息" class="gs-disposalReport">
        <i class="icon"
           @click.prevent="infoContinueShow = !infoContinueShow"
           :class="infoContinueShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' ">
        </i>
        <connection-report
          v-show="infoContinueShow"
          ref="continuePanel"
          :eventInfoId="data.eventInfoId">
        </connection-report>
      </group>
    </div>
   <!-- 领导批示 -->
   <div ref="dealWork">
     <deal-work :userId="userId"
                v-if="isShowWork"
                :listDeal="instList">
     </deal-work>
   </div>
   <!--拟办 当拟办记录数大于0是显示-->
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
       <i v-show="data.attachs" class="icon" @click.prevent="expandFlag = !expandFlag" :class="expandFlag ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
       <div v-show="expandFlag">
         <attach-upload
           :attachs="files"
           :canUpload="false"></attach-upload>
       </div>
     </group>
   </div>
</div>
</template>
<style lang="less" scoped>
  @import "../../../styles/common.less";
  .fileContain .time {
    text-align: left;
    font-size: 12px;
    color: #999;
    font-weight: 400;
    padding-left: 15px;
    margin-top: -15px;
  }

  .weui-textarea{
    background: #ffffff !important;
    padding: 0 !important;
    border: none !important;
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
    & > .ma-bottom{
      margin-top: 0;
    }
    & > .tabNav {
      margin-bottom: -1px;
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
    .gs-disposalReport:before {
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
import AuditingList from './AuditingList'
import InstructionPanel from '../eventInfo/deal/InstructionPanel'
import ConnectionReport from '../eventInfo/report/ConnectionReport'
import InstructionComplete from '../eventInfo/deal/InstructionComplete'
import instructTrans from './instructTrans'
import DealWork from '../eventInfo/deal/DealWork'
import AttachUpload from '../../mycomponents/AttachUpload'// 附件上传组件
import ReplyList from './ReplyList'

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
    },
    videoMask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 附件信息标题
      fileTitle: '附件信息',
      infoShow: true,
      infoContinueShow: true,
      dealShow: true,
      imgCss: 'gs-caret-down',
      otherClass: 'gs-plus-square-o',
      isExpandInfo: false,
      expandFlag: false,
      expandAudioFlag: false,
      expandVideoFlag: false,
      isExpandOrg: false,
      isShowDesc: true,
      hasAddInfo: false, // 是否有追加信息
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
    AuditingList,
    InstructionPanel,
    InstructionComplete,
    instructTrans,
    DealWork,
    ReplyList,
    ConnectionReport,
    Tab,
    TabItem,
    AttachUpload
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.descriptionArea.updateAutosize()
    })
  },
  computed: {
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
  methods: {
    resetHeight(dealType) {
      if (dealType === '12') {
        // 领导批示
        this.$store.commit('scrollTop', this.$refs.dealWork.offsetTop - 180)
      } else if (dealType === '3') {
        // 审核意见 auditing
        this.$store.commit('scrollTop', this.$refs.auditing.offsetTop - 180)
      } else if (dealType === '2') {
        //  拟办意见 insPanel
        this.$store.commit('scrollTop', this.$refs.insPanel.offsetTop - 180)
      } else {
        //  转办意见 trans
        this.$store.commit('scrollTop', this.$refs.trans.offsetTop - 180)
      }
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
        isEdit: false
      }
      this.$store.commit('setGisLocation', g)
      this.$router.push('/deal/GeolocationSelector')
    },
    toggleShowDesc() {
      this.showDesc = !this.showDesc
    },
    addInfoSuccess() { // 追加信息成功
      this.$emit('action-success')
    },
    initReplyList(list) { // 初始化追加信息
      if (list.length) {
        this.hasAddInfo = true
      } else {
        this.hasAddInfo = false
      }
    },
    async refreshAddInfo() { // 刷新追加和续报信息
      await this.$refs.replyList.loadAdditional()
      await this.$refs.continuePanel.getContinueData()
    }
  }
}
</script>
