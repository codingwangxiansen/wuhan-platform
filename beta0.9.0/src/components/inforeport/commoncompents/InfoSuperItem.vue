<template>
  <div class="multItem">
    <div class="title">
      {{data.infoTitle}}
    </div>
    <div id="multiForm">
      <!--<event-popover :showFlag="ifShow" :linkTo="id" >

      </event-popover>-->
      <group  title="基本信息" class="ma-bottom">
        <!--<x-input title="事发地区:" :readonly="flag" :placeholder="data.distName" :show-clear="false"></x-input>-->
        <cell title="事发地点:" class="eventAd" :value="shortAddress" @click.native="openGeolocationSelector"></cell>
        <!-- TODO 做成二级菜单联动 -->
        <x-input title="事件类型:" :readonly="flag" :placeholder="data.eventTypeName" :show-clear="false"></x-input>
        <x-input title="事件等级:" :readonly="flag" :placeholder='data.eventLevelName' :show-clear="false"></x-input>
        <!--<x-input title="是否敏感:" :readonly="flag" :placeholder="data.sensitiveEvent==1?'是':'否'" :show-clear="false"></x-input>-->
        <!--<x-input title="事发时间:"  sensitiveEvent v-model='data.incidentDateStr' :show-clear="false"></x-input>-->
        <x-input title="事发时间:" :readonly="flag" :placeholder='data.incidentDateStr' :show-clear="false"></x-input>
        <x-input title="上报时间:" :readonly="flag" :placeholder='data.reportDateStr' :show-clear="false"></x-input>
        <!--<x-textarea title="采取措施:" readonly v-model='data.eventMeasures':show-clear="false"></x-textarea>-->
      </group>
      <group class="desc">
        <div class="weui-cells__title" slot="title" @click.prevent="isShowDesc = !isShowDesc">
          情况描述:
          <span class="arrow" :class="isShowDesc ? 'gs-caret-down' : 'gs-caret-up' "></span>
        </div>
        <x-textarea v-if="!flag" v-show="isShowDesc" :autosize="autoText" v-model='data.eventDescription'></x-textarea>
        <div v-if="flag" v-show="isShowDesc" class="area">{{data.eventDescription}}</div>
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

    <div v-show="showAllInfo">
      <group class="fileLoad"  title="附加信息">
        <span @click.prevent="isExpandOrg = !isExpandOrg" :class="isExpandOrg ? 'gs-caret-down' : 'gs-caret-up' "></span>
        <div class="add-info" v-show="isExpandOrg">
          <x-input title="单位:" :readonly="flag" v-model='data.reportOrgName' :show-clear="false"></x-input>
          <x-input title="姓名:" :readonly="flag" v-model='data.reportPerson' :show-clear="false"></x-input>
          <x-input title="电话:" :readonly="flag" v-model='data.reportPersonPhone' :show-clear="false"></x-input>
        </div>
      </group>
    </div>

    <group v-show="auditShow|| (instructions.length > 0) || isShowTrans || isShowWork" class="dealOption fileLoad" title="处置情况">
      <span @click.prevent="infoShow = !infoShow" :class="infoShow ? 'gs-caret-down' : 'gs-caret-up' "></span>
      <div class="mainInfo" v-show="infoShow">
      <!-- 审核-->
        <auditing-list v-if="auditShow" :list="pageAuditingList"></auditing-list>
        <!--拟办 当拟办记录数大于0是显示-->
        <instruction-panel v-if='instructions.length > 0' :data = "instructions">
        </instruction-panel>
        <!--转办-->
        <instruct-trans v-if="isShowTrans" :listTrans="data.trunToDisposeDtos" ></instruct-trans>
        <!--批示-->
        <deal-work  v-if="isShowWork" :listDeal="instList"></deal-work>
      </div>
    </group>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../styles/common.less";
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
  #multiForm .img-box {
    margin: 10px 0 0 10px;
  }
  .multItem {
    margin-top: 0.5em;
  }


  .upUnit .weui-cells__title {
    line-height: 1.2em;
  }

  #multiForm .vux-x-textarea:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  #multiForm .vux-x-textarea:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  div.lose {

    position: relative;
  }
  div.lose span {
    position: absolute;
    top: 0.6em;
    right: 1em;
  }
  div.lose .vux-x-input:after , .sub-title:after {
    content: " ";
    position: absolute;
    top: 0;
    width: 92%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
  }
  .collpic .weui-cells__title {
    line-height:1.6em;
    font-size: 1.1em;
    color: #b5bccd;
    padding-left: 27px;
  }
  .weui-cells__title {
    position: relative;
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
    font-size: 16px;
    font-weight: bold;
    background: #fff;
    line-height: 2em;
    position: relative;
    .linkBtn {
      position: absolute;
      bottom: -1.5em;
      font-size: 1.5em;
      right: 0.2em;
      z-index: 99;
      color: #575757;
    }
  }
  .unitBox > .weui-cells {
    background: #f0f3f7;
    margin-top:0;
  }
  .weui-cells .weui-cell_access .weui-cell__ft {
    text-align: left;
    padding-left: 20px;
  }
  .attach-img{
    text-align: center;
  }
  .weui-cell:before {
    width: 92%;
  }
  .vux-datetime>div{
    width: 5.5em;
    text-align: left;
  }

  .cellLose .weui-input{
    box-sizing: border-box;
    padding-right: 3em;
  }

  .weui-textarea {
    color: #a1a4a9;
  }
  .desc .weui-cells__title {
    font-size: 1em;
    padding-left: 1.5em;
  }
  .desc {
    div.area {
      margin: 5px 22px;
      border: 1px solid #d0d3d6;
      color: #444;
      padding: 5px;
    }

    span.arrow {
      float: right;
      font-size: 30px;
      color: #ddd;
    }
  }
</style>
<script>
  // 导入页面所需的标签
  import { Cell, Group, XInput, XTextarea, XButton, Datetime } from 'vux'
  import { fileserver } from '../../../utils/common'
  import AuditingList from './AuditingList'
  import InstructionPanel from '../eventInfo/deal/InstructionPanel'
  import instructTrans from './instructTrans'
  import DealWork from '../eventInfo/deal/DealWork'
  import AttachUpload from '../../mycomponents/AttachUpload'// 语音上传组件

  export default{
    name: 'InfoItem',
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
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
      auditingList: {
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
      }
    },
    data() {
      return {
        fileTitle: '附件信息',
        infoShow: false,
        autoText: true,
        dealShow: true,
        readFlag: true,
        imgCss: 'gs-caret-down',
        otherClass: 'gs-plus-square-o',
        isExpandInfo: false,
        expandFlag: true,
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
      AuditingList,
      InstructionPanel,
      instructTrans,
      DealWork,
      AttachUpload
    },
    created() {
      console.log(this.attachs)
      console.log(111)
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
      files() {
        const fileArr = []
        if (this.attachs) {
          if (this.attachs.length > 0) {
            this.attachs.forEach((attach) => {
              fileArr.push(attach)
            })
          }
        } else {
          this.infoTitle = '附件信息（暂无附件信息）'
        }
        return fileArr
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
          if (!this.data) {
            return false
          }
          if (!this.data.trunToDisposeDtos) {
            return false
          }
          if (this.data.trunToDisposeDtos.length > 0) {
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
      audios() {
        let audiosArr = []
        if (this.data.audioAttach) {
          audiosArr = JSON.parse(this.data.audioAttach)
        }
        return audiosArr
      },
      videos() {
        let videosArr = []
        if (this.data.videoAttach) {
          videosArr = JSON.parse(this.data.videoAttach)
        }
        return videosArr
      },
      pageAuditingList() {
        return this.auditingList
      },
      // 拟办信息列表
      instructions() {
        if (this.data.proposeDisposeDtos) {
          return this.data.proposeDisposeDtos
        }
        return []
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
          type: '',
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
      }
    }
  }
</script>
