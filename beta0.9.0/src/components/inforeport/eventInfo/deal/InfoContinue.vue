<!-- 拟办提交组件	 -->
<template>
  <popup v-model="show" class="popContainer">
    <div class="head">
      <span class="headBtnL" @click="cancel">取消</span>
      <div class="headTitle">信息续报</div>
      <span class="headBtnR" @click="commit">✔ 发送续报</span>
    </div>
    <box gap="10px 10px" class="transContent">
      <div class="popup0">
        <group>
          <x-textarea :rows="3" v-model="eventDescription" placeholder=""></x-textarea>
        </group>
        <group class="fileUpload">
          <attach-upload
            :attachs ="attachs"
            @on-action-success ="actionSuccess"
          >
          </attach-upload>
        </group>
      </div>
    </box>
  </popup>
</template>
<style lang="less" scoped>
  .fileUpload {
    margin-top: -20px;
  }
  .transContent {
    height: 80%;
    overflow: scroll;
  }

  .popContainer {
    height: 45% !important;
  }

  .head {
    color: #444;
    background-color: #f2f2f2;
    text-align: center;
    font-weight: 500;
    line-height: 45px;
    font-size: 16px;
    z-index: 99;
    span {
      font-size: 14px;
    }
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

  .headBtnR {
    float: right;
    color: #0faaff;
    font-weight: normal;
    padding: 0 1em;

  }
</style>
<script>
  import { Box, Popup, Group, Cell, XButton, XTextarea, Checklist } from 'vux'
  import { siteUrl } from '../../../../utils/common'
  import OrgCheckList from '../../commoncompents/OrgCheckList'
  import LeaderSelector from '../../../gsafetycomponents/LeaderSelector'
  import AttachUpload from '../../../mycomponents/AttachUpload'

  export default {
    name: 'EventTrans',
    props: ['value', 'type', 'eventInfoId'],
    data() {
      return {
        showAudioPart: false,
        targets: [],
        attachs: [],
        submitStatus: false,
        eventDescription: '',
        imgMaxSum: '3',
        data: {}
      }
    },
    computed: {
      show: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {
      show: 'clear'
    },
    components: {
      Box,
      Popup,
      Group,
      Cell,
      XButton,
      OrgCheckList,
      XTextarea,
      siteUrl,
      LeaderSelector,
      AttachUpload,
      Checklist
    },
    //
    methods: {
      // 新附件上传
      actionSuccess(attachId) {
        this.data.attachId = attachId
      },
      cancel() {
        this.show = false
        // this.eventDescription = ''
        this.$store.commit('setDealWindow', '')
      },
      //
      clear() {
        console.log('tttt')
        this.targets = []
        this.attachs = []
        this.trunTo = ['5']
        this.serverIds = []
        if (this.$refs.orgSel) {
          this.$refs.orgSel.init()
        }
      },
      setData() {
        const that = this
        that.data.eventInfoId = this.eventInfoId
        that.data.eventDescription = this.eventDescription
        return that.data
      },
      commit() {
        const that = this
        const data = that.setData()
        this.validation(data)
        if (this.submitStatus) {
          this.$vux.confirm.show({
            title: '确认上报？',
            content: '',
            onConfirm() {
              const URL = `${siteUrl}/eventdispose/report/again`
              that.axios.postData(URL, data, (response) => {
                if (response.code === 200) {
                  that.$vux.toast.text('续报成功', 'middle')
                  that.show = false
                  that.$vux.confirm.hide()
                  that.cancel()
                  that.eventDescription = ''
                  that.$emit('addContinue')
                } else if (response.message) {
                  that.$vux.toast.text(response.message, 'middle')
                }
              })
            }
          })
        }
      },
      validation(val) {
        if (!val.eventDescription || !val.eventDescription.trim()) {
          this.$vux.toast.text('请输入续报内容', 'middle')
          this.submitStatus = false
          return false
        }
        this.submitStatus = true
        return true
      }
    }
  }
</script>
