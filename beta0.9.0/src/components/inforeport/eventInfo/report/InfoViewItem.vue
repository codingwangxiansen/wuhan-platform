<template>
  <div class="multItem">
    <div id="baseInfo">
      <!--常规信息-->
      <group title="基本信息" class="ma-bottom gs-list4" v-show="data.infoType === 'emergency'">
        <i class="icon" @click.prevent="infoShow = !infoShow" :class="infoShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
        <div class="contain" v-show="infoShow">
          <x-input title="事件类型:" :readonly="flag" :value="data.eventTypeName" :show-clear="false"></x-input>
          <cell title=":" class="eventAd" :value="shortAddress" @click.native="openGeolocationSelector"></cell>
          <x-input title="事发时间:" :readonly="flag" :value='data.incidentDateStr' :show-clear="false"></x-input>
          <!--<x-input title="事发地区:" :readonly="flag" :value='data.distName' :show-clear="false"></x-input>-->
        </div>
      </group>
      <group title="情况描述" class="desc gs-file-text2" v-show="data.infoType === 'emergency'">
        <i class="icon" @click.prevent="fileContain = !fileContain" :class="fileContain ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
        <div class="fileContain" v-show="fileContain">
          <x-textarea v-if="!flag" v-show="isShowDesc" :autosize="autoText" v-model='data.eventDescription'></x-textarea>
          <div v-if="flag" v-show="isShowDesc" class="area">{{data.eventDescription}}</div>
        </div>
      </group>
      <div class="baseInfo">
        <group :title="fileTitle"  class="collpic gs-file-picture">
          <i class="icon" @click.prevent="expandFlag = !expandFlag" :class="expandFlag ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
          <div v-show="expandFlag">
            <attach-upload
              :attachs="files"
              :canUpload="false"></attach-upload>
          </div>
        </group>
      </div>
    </div>
    <!--拟办 当拟办记录数大于0是显示-->
    <instruction-panel
      :userId="userId"
      v-if='instructions.length > 0'
      :data = "instructions"
      :showOperation="showOperation">
    </instruction-panel>
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
    <!--领导批示-->
    <div ref="dealWork">
      <deal-work
        :userId="userId"
        v-if="isShowWork"
        :listDeal="instList"
      ></deal-work>
    </div>
    <!-- 转办-->
    <instruct-trans
      :userId="userId"
      v-if="instructTrans.length > 0"
      :listTrans="loadTrans"
    ></instruct-trans>
    <!--转办  data.trunToDisposeDtos-->
        <!--</div>-->
    <!--</group>-->
  </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
  .excelBox {
    background: #fff;
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
  #baseInfo .img-box {
    margin: 10px 0 0 10px;
  }
  /*gs-list4*/
  #baseInfo {
    .gs-file-picture:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 12px;
      left: 12px;
    }
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
      margin: 10px 0;
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
      top: 12px;
      left: 8px;
    }
    .gs-file-text2:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 15px;
      left: 12px;
    }
  }
  div.lose {
    position: relative;
  }
  div.lose span {
    position: absolute;
    top: 0.6em;
    right: 1em;
  }
  .gs-arrow-down3:before {
    position: absolute;
    right: 0;
    margin-right: 2em;
    color: #dadbdf;
    margin-top: 0.4em;
  }
  .gs-arrow-up3:before {
    position: absolute;
    right: 0;
    color: #dadbdf;
    margin-top: 0.4em;
    margin-right: 2em;
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
  .detail-img {
    width: 30%;
    height: 100px;
    display: inline-block;
    margin-left: 0.5em;
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
  import { Cell, Group, XInput, XTextarea, XButton, Datetime } from 'vux'
  import { fileserver } from '../../../../utils/common'
  import InfoViewAuditingList from './InfoViewAuditingList'
  import InstructionPanel from '../../eventInfo/deal/InstructionPanel'
  import instructTrans from '../../commoncompents/instructTrans'
  import DealWork from '../../eventInfo/deal/DealWork'
  import AttachUpload from '../../../mycomponents/AttachUpload'// 语音上传组件

  export default{
    name: 'InfoItem',
    props: {
      showEdit: {
        type: Boolean,
        default: true
      },
      isWatch: {
      //   是否是查看的页面
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
        fileTitle: '附件信息',
        fileContain: true,
        showAudioPart: true,
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
        isShowDesc: true
      }
    },
    components: {
      Cell,
      Group,
      XInput,
      XTextarea,
      XButton,
      Datetime,
      InfoViewAuditingList,
      InstructionPanel,
      instructTrans,
      DealWork,
      AttachUpload
    },
    created() {
      if (this.$store.state.projectType === 'mini') {
        this.showAudioPart = false
      }
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
      flag() {
        if (this.isEdit) {
          return false
        }
        return this.readFlag
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
        const fileArr = []
        if (this.data.attachs) {
          this.infoTitle = '附件信息'
          const attachArr = JSON.parse(this.data.attachs)
          attachArr.forEach((attach) => {
            fileArr.push(attach)
          })
        } else {
          this.infoTitle = '附件信息（暂无附件信息）'
        }
        return fileArr
      },
      pageAuditingList() {
        return this.auditingList
      },
      // 拟办信息列表
      instructions() {
        return this.instructionPanel
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
        vm => vm.editData()
      )
    },
    methods: {
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
//      m.$store.state.gisLocation.isEdit
        this.$router.push('/deal/GeolocationSelector')
      },
      toggleShowDesc() {
        this.showDesc = !this.showDesc
      }
    }
  }
</script>
