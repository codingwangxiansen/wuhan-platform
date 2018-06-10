<template>
  <div class="transInfo">
    <popup v-model="showV" class="popContainer">
      <div class="head">
        <span class="headBtnL" @click="HandleCancel">取消</span>
        <div class="headTitle">{{title}}</div>
        <span class="headBtnR" @click="handleCommit">✔ 确定</span>
      </div>
      <box gap="10px 10px">
        <div class="popup0">
          <group>
            <x-textarea ref="descriptionArea" autosize readonly :value="disposeDescription" placeholder=""></x-textarea>
          </group>
          <group>
            <x-textarea v-model="backContent" placeholder="此处输入回复内容"></x-textarea>
          </group>
          <group title="附件上传" class="fileUpload">
            <attach-upload
              :attachs="attachs"
              @on-local-success ="actionSuccess"
              :showAudioPart="showAudioPart"
            >
            </attach-upload>
          </group>
        </div>
      </box>
    </popup>
  </div>
</template>
<style type="less" scoped>
  .vux-popup-dialog {
    height: 94% !important;
  }
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

</style>
<script>
  import { Cell, Scroller, XButton, Flexbox, FlexboxItem, Group, XTextarea, Box, Popup, ConfirmPlugin } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl, pageUtils } from '../../../../utils/common'
  import TransitionPage from '../../../mycomponents/TransitionPage'
  import InstructItem from './InstructItem'
  import AttachUpload from '../../../mycomponents/AttachUpload'

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
      Popup,
      ConfirmPlugin,
      AttachUpload
    },
    // 数据模型
    data() {
      return {
        // 附件数组，所有的
        attachs: [],
        attachId: [], // 传给服务端的附件ID
        showV: false,
        disposeDescription: '测试信息',
        backContent: '',
        title: '',
        comfirmTitle: '确认回复？',
        load: '恢复中，请稍后....',
        imgMaxSum: '3',
        showAudioPart: true,
        maxFileSize: 30 // 文件的最大大小 单位M
      }
    },
    created() {
    },
    // 方法
    methods: {
      actionSuccess(attachId, attachs) {
        this.attachs = attachs
        this.attachId = attachId
      },
      showPop(obj) {
        this.showV = true
        this.disposeDescription = obj
        this.$nextTick(() => {
          this.$refs.descriptionArea.updateAutosize()
        })
        if (this.popMsg.disposeType === '7') {
          this.title = '转办'
        } else if (this.popMsg.disposeType === '13') {
          this.title = '督办'
        }
      },
      init() {
        this.backContent = ''
        this.attachs = []
      },
      HandleCancel() {
        this.showV = false
        this.backContent = ''
      },
      handleCommit() {
        if (!this.backContent) {
          this.$vux.toast.text('回复内容不能为空', 'middle')
          return false
        }
        const that = this
        this.showV = true
        const url = `${siteUrl}/eventdispose/assign/reply`
        const data = this.popMsg.watchObj
        data.opinionContent = that.backContent
        data.attachId = this.attachId
        that.$vux.confirm.show({
          title: this.comfirmTitle,
          content: '',
          onConfirm() {
            that.loadingShow = true
            that.loadText = that.load
            that.$http.post(url, data).then((response) => {
              that.loadingShow = false
              if (response.status === 200) {
//                $gsafety.closeWindow()
                that.$emit('backChange')
                that.$vux.toast.text('回复成功！', 'middle')
                that.$vux.confirm.hide()
                that.init()
                that.showV = false
                that.backContent = ''
              }
            }, () => {
              that.$vux.confirm.hide()
              that.loadingShow = false
              this.showV = false
              that.$vux.toast.text('回复失败！', 'middle')
            })
          }
        })
        return false
      },
      saveData(name, obj) {
        pageUtils.setlocalStorage(name, obj)
      }
    }
  }
</script>
