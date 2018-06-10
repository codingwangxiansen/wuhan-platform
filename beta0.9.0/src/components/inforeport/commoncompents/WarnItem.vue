<template>
  <div class="multItem">
    <div class="baseInfo">
      <router-link :to="{path:'/report/editWaringInfo/' + data.eventInfoId}"
                   v-show="showEdit && isWatch"
                   class="linkBtn">
        <i class="gs-pencil-square-o"></i>
        <div>编辑</div>
      </router-link>
      <!--预警信息-->
      <div class="warning">
        <table>
          <col width="25%">
          <col>
          <tr>
            <td>影响范围：</td>
            <td>{{baseData.incidence}}</td>
          </tr>
          <tr>
            <td>预警级别：</td>
            <td>{{baseData.levelName}}</td>
          </tr>
          <tr>
            <td>预警时限：</td>
            <td>
              <p>{{baseData.bdateStr}}</p>
              <p>{{baseData.edateStr}}</p>
            </td>
          </tr>
          <tr>
            <td>发布人员：</td>
            <td>{{baseData.createPersonName}}</td>
          </tr>
        </table>
      </div>
      <group v-if="baseData.contents">
        <div class="warning-event-title" slot="title">预警事项：</div>
        <div class="warning-event">
          {{baseData.contents}}
        </div>
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
      <instruction-complete :showEdit="showEdit" :userId="userId"
                            v-if='completeList.length > 0'
                            :data = "completeInfo"
                            :showOperation="showOperation">
      </instruction-complete>

      <div class="baseInfo">
        <group :title="fileTitle"  class="collpic gs-file-picture">
          <i class="icon" v-show="attachs.length" @click.prevent="expandFlag = !expandFlag" :class="expandFlag ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
          <div v-show="expandFlag">
            <attach-upload :attachs="files" :canUpload="false"></attach-upload>
          </div>
        </group>
      </div>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../styles/common.less";
  .fileContain{
    padding: 5px 16px 0 16px;
    text-indent: 2em;
  }
  .tabNav {
    width:100%;
    position: relative;
    z-index: 100;
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
    font-size: 16px;
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
    position: relative;
    .linkBtn{
      position: absolute;
      top: 20px;
      right: 10px;
      width: 80px;
      z-index: 1;
      text-align: center;
      color: #333;
      i{
        font-size: 2em;
      }

      div{
        letter-spacing: 3px;
      }
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
    .weui-cell {
      padding: 8px 15px;
      font-size: 14px;
    }
    &>div {
      border-bottom: 1px solid #e2e2e2;
      border-top: 1px solid #e2e2e2;
      position: relative;
      margin: 5px 0;
      &.warning{
        margin: 0;
        padding: 5px 10px;
        background-color: #fff;
        font-size: 14px;
        color: #333;
        tr > td:nth-child(2) {
          color: #666;
        }
        tr > td:nth-child(1) {
          vertical-align: top;
        }
      }
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

    .gs-event_note:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 12px;
      left: 12px;
    }
  }
  .upUnit .weui-cells__title {
    line-height: 1.2em;
  }

  .baseInfo .vux-x-textarea:before{
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

  .baseInfo .vux-x-textarea:after{
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
  .collpic .weui-cells__title {
    line-height:1.6em;
    font-size: 1.1em;
    color: #b5bccd;
    padding-left: 27px;
  }
  .weui-cells__title {
    position: relative;
  }
  .warning-event-title{
    position: relative;
    background: #fff;
    padding: 0.5em 10px;
    font-size: 14px;
    color: #333;
    line-height: 24px;
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
  .unitBox > .weui-cells {
    background: #f0f3f7;
    margin-top:0;
  }
  .weui-cells .weui-cell_access .weui-cell__ft {
    text-align: left;
    padding-left: 20px;
  }
  .detail-img {
    width: 125px;
    height: 125px;
    display: inline-block;
    margin-left: 0.5em;
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


  .warning-event{
    padding: 10px;
  }
</style>
<script>
  // 导入页面所需的标签 setList
  import { Cell, Group, XInput, XTextarea, XButton, Datetime, Tab, TabItem } from 'vux'
  import { fileserver } from '../../../utils/common'
  import SlideImg from './slideImg'
  import AuditingList from './AuditingList'
  import InstructionPanel from '../eventInfo/deal/InstructionPanel'
  import ConnectionReport from '../eventInfo/report/ConnectionReport'
  import InstructionComplete from '../eventInfo/deal/InstructionComplete'
  import instructTrans from './instructTrans'
  import DealWork from '../eventInfo/deal/DealWork'
  import ReplyList from './ReplyList'
  import AttachUpload from '../../mycomponents/AttachUpload'
  import ReferenceList from './ReferenceList'

  export default{
    name: 'WarnItem',
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
        // 视频的
        videoPath: '',
        fileTitle: '附件信息',
        currentDetailItem: 'detailInfo',
        fileContain: true,
        infoShow: false,
        autoText: true,
        dealShow: true,
        readFlag: true,
        imgCss: 'gs-caret-down',
        otherClass: 'gs-plus-square-o',
        isExpandInfo: false,
        expandFlag: false,
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
      instructTrans,
      DealWork,
      ReplyList,
      ReferenceList,
      Tab,
      TabItem,
      ConnectionReport,
      InstructionComplete,
      AttachUpload
    },
    created() {
    },
    watch: {
      $route(to, from) {
        if (from.fullPath === '/deal') {
          this.expandFlag = false
        }
      }
    },
    computed: {
      baseData() {
        if (this.data.info.data) {
          return this.data.info.data
        }
        return {}
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
        if (this.attachs.length) {
          this.fileTitle = '附件信息'
          const attachArr = this.attachs
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
      getDetail(item) {
        const that = this
        that.currentDetailItem = item
      },
//    控制审核页面回复内容的设置
      setList() {
        this.$refs.setList.setList()
      },
      setListPanel() {
        this.$refs.setListPanel.setList()
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
