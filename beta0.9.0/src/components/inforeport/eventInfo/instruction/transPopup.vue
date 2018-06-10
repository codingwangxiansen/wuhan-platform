<template>
  <div class="transInfo">
    <popup v-model="showV" class="popContainer">
      <div class="head">
        <span class="headBtnL" @click="HandleCancel">取消</span>
        <div class="headTitle">{{title}}</div>
        <span class="headBtnR"   @click="handleCommit">✔ 确定</span>
      </div>
      <box gap="10px 10px">
        <div class="popup0">
          <group>
            <x-textarea readonly v-model="handleMessage" placeholder=""></x-textarea>
          </group>
          <group>
            <x-textarea v-model="backContent" placeholder="对此消息进行回复"></x-textarea>
          </group>
        </div>
      </box>
    </popup>
  </div>
</template>
<style type="less" scoped>
  /*@import "../../../styles/common.less";*/
  .head {
    color: #444;
    background-color: #f2f2f2;
    text-align: center;
    font-weight: 700;
    line-height: 56px;
    font-size: 16px;
  }
  .headTitle {
    display: inline-block;
  }
  .headBtnL {
    float: left;
    color: #a5a4a4;
    font-weight: normal;
    padding: 0 1em;
  }

  .headBtnR{
    float: right;
    color: #0faaff;
    font-weight: normal;
    padding: 0 1em;

  }

  .vux-popup-dialog {
    height: 94% !important;
  }
</style>
<script>
  import { Cell, Scroller, XButton, Flexbox, FlexboxItem, Group, XTextarea, Box, Popup } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import TransitionPage from '../../../mycomponents/TransitionPage'
  import InstructItem from './InstructItem'

  Vue.use(VueResource)

  export default {
    props: ['popMsg'],
    // 组件
    components: {
      Flexbox,
      FlexboxItem,
      Cell,
      Scroller,
      XButton,
      InstructItem,
      TransitionPage,
      Group,
      XTextarea,
      Box,
      Popup
    },
    // 数据模型
    data() {
      return {
        showV: false,
        handleMessage: '测试信息',
        backContent: ''
      }
    },
    created() {
    },
    // 方法
    methods: {
      showPop(r) {
        this.showV = true
        this.handleMessage = r
      },
      HandleCancel() {
        this.showV = false
      },
      handleCommit() {
        const that = this
        this.showV = false
//          obj  transactId,infoId /eventInfo/transact/feedbackTransact
        const url = `${siteUrl}/eventInfo/transact/feedbackTransact`
        const data = this.popMsg.watchObj
        data.opinionContent = that.backContent
        this.$http.post(url, data).then(() => {
          that.backContent = ''
        })
        that.$emit('backChange', that.backContent)
      }
    }
  }
</script>
