<template>
  <div class="multItem">
    <div id="baseInfo">
      <div class="other">
        <table>
          <col width="25%">
          <col>
          <tr>
            <td>内容描述：</td>
            <td>{{data.eventDescription}}</td>
          </tr>
          <tr>
            <td>上报时间：</td>
            <td>{{data.updateTimeStr}}</td>
          </tr>
          <tr>
            <td>上报单位：</td>
            <td>{{data.reportOrgName}}</td>
          </tr>
          <tr>
            <td>上报人员：</td>
            <td>{{data.info.data.createPersonName}}</td>
          </tr>
        </table>
      </div>
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
    <deal-work :userId="userId"  v-if="isShowWork" :listDeal="instList"></deal-work>
    <!-- 审核-->
    <auditing-list @maskShow="showMask" v-if="auditShow" :userId="userId" :list="pageAuditingList" ref="setList" :backContent="backContent" :showOperation="showOperation"></auditing-list>
    <!--拟办 当拟办记录数大于0是显示-->
    <instruction-panel :userId="userId" v-if='instructions.length > 0' :data = "instructions">
    </instruction-panel>
    <!--转办  data.trunToDisposeDtos-->
    <instruct-trans :userId="userId" v-if="instructTrans.length > 0" :listTrans="loadTrans" ></instruct-trans>
    <!--</div>-->
    <!--</group>-->
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
  #baseInfo .img-box {
    margin: 10px 0 0 10px;
  }
  /*gs-list4*/
  #baseInfo {
  .weui-cell {
    padding: 8px 15px;
    font-size: 14px;
  }
  &>div {
      border-bottom: 1px solid #e2e2e2;
      border-top: 1px solid #e2e2e2;
      position: relative;
      margin: 15px 0;
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
  .gs-file-picture:before {
    position: absolute;
    z-index: 9;
    font-size: 15px;
    color: #333;
    top: 15px;
    left: 12px;
  }
  }

  .upUnit .weui-cells__title {
    line-height: 1.2em;
  }

  #baseInfo .vux-x-textarea:before{
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

  #baseInfo .vux-x-textarea:after{
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
    font-size: 20px;
    font-weight: bold;
    background: #fff;
    line-height: 2em;
    position: relative;
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
  .other {
    padding: 0 10px;
    background-color: #fff;
    font-size: 14px;
    color: #333;
  td {
      text-align: left;
      border: none;
    }
    tr > td:nth-child(2) {
      color: #666;
    }
    tr > td:nth-child(1) {
      vertical-align: top;
    }
  }
</style>
<script>
  // 导入页面所需的标签
  import { Cell, Group, XInput, XTextarea, XButton, Datetime } from 'vux'
  import { fileserver } from '../../../utils/common'
  import SlideImg from './slideImg'
  import AuditingList from './AuditingList'
  import InstructionPanel from '../eventInfo/deal/InstructionPanel'
  import instructTrans from './instructTrans'
  import DealWork from '../eventInfo/deal/DealWork'

  export default{
    name: 'InfoItem',
    props: {
      backContent: {
        type: String,
        default: ''
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
        default: false
      }
    },
    data() {
      return {
        fileTitle: '附件信息',
        fileContain: false,
        infoShow: false,
        autoText: true,
        dealShow: true,
        readFlag: true,
        imgCss: 'gs-caret-down',
        otherClass: 'gs-plus-square-o',
        isExpandInfo: false,
        expandFlag: false,
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
      SlideImg,
      AuditingList,
      InstructionPanel,
      instructTrans,
      DealWork
    },
    created() {
    },
    computed: {
      flag() {
        if (this.isEdit) {
          return false
        }
        return this.readFlag
      },
      files() {
        const imageArr = []
        if (this.attachs) {
          if (this.attachs.length > 0) {
            this.fileTitle = '附件信息'
            this.attachs.forEach((attach) => {
              imageArr.push(attach)
            })
          }
        } else {
          this.fileTitle = '附件信息（暂无附件信息）'
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
//    控制审核页面回复内容的设置
      setList() {
        this.$refs.setList.setList()
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
          isEdit: false
        }
        this.$store.commit('setGisLocation', g)
//      m.$store.state.gisLocation.isEdit
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
//    showMask
      showMask(obj) {
        console.log('222')
        this.$emit('maskShow', obj)
      }
    }
  }
</script>
