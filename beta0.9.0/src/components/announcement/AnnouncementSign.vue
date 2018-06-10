<template>
  <div class="ckecked">
    <div  @click="select(checked.eventDisposeId)" class="selectMain">
      <!--名字-->
      <!--<div class="telName" @click.stop="call">{{checked.createUserName}}</div>-->
      <!--标题-->
      <div class="rel-inf">
        <label>通知事项：</label>
        <span class="release">{{checked.infoTitle}}</span>
      </div>
      <div :class="isShowCss(checked.recvOrgNames)">
        <div class="nNames instr-content"></div>
        <div class="yNames instr-content">
          <label>接收单位：</label>
          <span class="connect-info" >{{checked.recvOrgNames}}</span>
        </div>
      </div>
      <!--接收人
      <div :class="isShowCss(checked.recvPersonNames)">
        <div class="nNames instr-content"></div>
        <div class="yNames instr-content">
          <label>接收人：</label>
          <span class="connect-info" >{{checked.recvPersonNames}}</span>
        </div>
      </div>
      -->
      <!--判断是否签收 -->
      <div v-if="checked.isSign === '1'">
        <div :class="isInstrCss(checked.readStatus)" class="infoBack">
          <span class="setBefore"></span>
          <span class="setState">{{readStatusStr}}</span>
        </div>
      </div>
    </div>
    <div class="instr-content" style="width: 100%;">
      <!--<label>办理单位：</label>-->
      <!-- <span class="connect-info connet-color color-width-left" >{{checked.disposeOrgName}}</span> -->
      <!--<label>办理时间：</label>-->
      <label>发送时间：</label>
      <span class="connect-info connet-color color-width-left" >{{checked.disposeTimeStr}}</span>
    </div>
     <!--签收状态-->
    <div class="instr-content" v-if="checked.receiptWait != 0">
      <label>签收情况：</label>{{checked.receiptOk}}/{{checked.receiptTotal}}已签收
    </div>
    <div class="instr-content" v-if="checked.receiptWait === 0">
      <label>签收情况：</label><label>全部已签收</label>
    </div>
  </div>
</template>
<style type="less" scoped>
  .head {
    color: #fff;
    background-color: #0094ff;
    text-align: center;
    font-weight: 700;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  .nNames{
    display: none;
  }
  .yName{

  }
  .color-width-left{
    width: 50% !important;
    color: #7f7f7f !important;
  }
  .color-width-right{
    width: 45% !important;
    color: #7f7f7f !important;
    font-size: 12px;
    text-align: right;
  }
  .rel-info {
    display: block;
    position: relative;
    height:2em;
    width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rel-inf {
    overflow: hidden;
    width: 23em;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .setState {
    color: #fff;
    font-weight: 700;
    position: absolute;
    -webkit-transform: rotate(66deg);
    transform: rotate(45deg);
    right: 0;
    top: 8px;
    font-size: 0.5em;
  }
  .telName {
    font-size: 1.2em;
    line-height: 2em;
    display: inline-block;
  }

  .selectMain {
    position: relative;
  }
  .infoBack {
    width: 3em;
    height: 3em;
    background-color: #f00;
    position: absolute !important;
    top: -3px;
    right: -15px;
    border-radius: 0 20px 0 0;
  }
  .sendBefore {
    background-color: #f00;
  }
  .sendAfter {
    background-color: #3787de;
  }
  .banJieAfter {
    background-color: #899098;
  }
  .setBefore {
    position: absolute;
    border: 1.5em solid #fff;
    border-right-color: transparent;
    border-top-color: transparent;
    left: -1px;
    bottom: -1px;

  }


  .vux-popup-dialog {
    height: 94% !important;
  }
  .instr-content {
    line-height: 20px;
    font-size: 14px;
    color: #555;
    width: 25em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .undone{
      color: red;
    }
  }

  .backAct {
    margin-left: 0.4em;
  }
  .isBack {
    margin-left: 0.5em;
    position: relative;
    color:#34669c;
  }
  .instr-cell {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    background: #fff;
  }
  .leader-info {
    text-align: right;
    margin-right: 20px;

  }
  .rel-info {
    display: block;
    position: relative;
    height:2em;
    width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .i-release {
    color: #454545;
    margin: 0 20px 0 6px;
  }
  .weui-btn_theme {
    background-color: #0b6694;
  }
  .release {
    font-size: 16px;
  }
  .connect-info{
    color: #00a0e9;
    display: inline-block;
    position: relative;
    z-index: 9;
    vertical-align: top;
  }
  .actBtn {
    text-align: right;
    text-align: right;
    position: absolute;
    width: 50%;
    right: 0;
    bottom: 0em;
  }
  .actBtn button.weui-btn,.actBtn input.weui-btn {
    width: 40%;
    display: inline-block;
    height: 2em;
    line-height: 2em;
    font-size: 1em;
  }
  .telPhone {
    margin-left: 1em;
  }
  .creatName {
    /*float: left;*/
    margin-left: 0.4em;
    font-size: 1em;
    color: #34669c;
  }
  .isOwnSend {
    display: none;
  }
</style>
<script>
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import TransitionPage from './../mycomponents/TransitionPage'

  Vue.use(VueResource)

  export default {
    props: ['checked', 'userId'],
    // 组件
    components: {
      TransitionPage
    },
    // 数据模型
    data() {
      return {
        readStatusSt: '',
        tel: '15634562275'
      }
    },
    computed: {
      readStatusStr() {
        if (this.checked.readStatus === '0') {
          return '未签收'
        } else if (this.checked.readStatus === '1') {
          return '已签收'
        }
        return '办结'
      }
    },
    created() {

    },
    // 方法
    methods: {
      toBack(one) {
        this.$emit('on-callback-click', one)
      },
      select(id) {
        this.$emit('on-select-click', id, this.checked.readStatus, this.checked.isSign)
      },
      call() {
        window.location.href = `tel:${this.tel}`
      },
      relInfo(id) {
        this.$emit('on-info-click', id)
      },
      isInstrCss(status) {
        let classNam
        if (status === '0') {
          classNam = 'sendBefore'
        } else if (status === '1') {
          classNam = 'sendAfter'
        } else {
          classNam = 'banJieAfter'
        }
        return classNam
      },
      isOwnSendCss(status) {
        let classNam
        if (status === '2') {
          classNam = 'isOwnSend'
          // classNam = ''
        } else {
          classNam = ''
        }
        return classNam
      },
      isShowCss(status) {
        let classNam
        if (status) {
          classNam = 'yNames'
        } else {
          classNam = 'nNames'
        }
        return classNam
      }
    }
  }
</script>
