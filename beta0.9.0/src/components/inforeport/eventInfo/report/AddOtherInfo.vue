<template>
  <div class="ma-round">
    <form @submit.prevent="submit" id="multiForm">
      <group title="基本信息" titleColor="" class="ma-bottom">
        <x-input title="信息标题:" placeholder="必填" v-model='data.title' :show-clear="false" text-align="left" :max="36"></x-input>
        <x-textarea v-model="data.contents" :max="500" :rows="5" placeholder="信息描述(必填)"></x-textarea>
      </group>
      <group class="fileUpload">
        <attach-upload
          :attachs="attachs"
          @on-action-success ="actionSuccess"
          :showAudioPart="showAudioPart"
        ></attach-upload>
      </group>
      <box class="positionBtn btn-group">
        <button class="inline-btn" @click="reportEvent" type="button">我要上报</button>
      </box>
    </form>
  </div>
</template>

<style lang="less" scoped>
  .positionBtn {
    position: fixed;
    bottom: 0;
    width: 95%;
    background: #ededed;
    padding: 10px;
    z-index: 99;
  }

  .ma-round {
    background: #EDEDED;
  }

  .ma-bottom {
    overflow: hidden;
  }
</style>
<script>
  import {
    XInput,
    XTextarea,
    Group,
    Box
  } from 'vux'
  import { siteUrl } from '../../../../utils/common'
  import AttachUpload from '../../../mycomponents/AttachUpload'

  export default {
    name: 'AddInfo',
    // 数据模型
    data() {
      return {
        attachs: [],
        showAudioPart: false,
        submitStatus: false,
        orgClass: 'gs-plus-square-o',
        otherClass: 'gs-plus-square-o',
        data: {},
        saveUrl: '',
        imgMaxSum: '3',
        loadingShow: false,
        contents: ''
      }
    },
    // 组件
    components: {
      XInput,
      XTextarea,
      Group,
      Box,
      AttachUpload
    },

    computed: {
      // 与父组件通信用属性
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.$store.commit('setHeaderTitle', '新增其他信息')  // 设置头部文字
        vm.init()
      })
    },
    // vue实例挂着后调用
    mounted() {

    },
    created() {
    },
    watch: {
    },
    // 定义方法区
    methods: {
      actionSuccess(attachId) {
        this.data.attachId = attachId
      },
//        获取当前时间
      getTime() {
        const date = new Date()
        const seperator1 = '-'
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = `0${month}`
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = `0${strDate}`
        }
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
//        const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        const currentdate = `${year}${seperator1}${month}${seperator1}${strDate} ${hour}:${minute}`
        return currentdate
      },
      init() {
        // 通过 `vm` 访问组件实例
        this.attachs = []
        this.title = ''
        this.contents = ''
        this.data = {}
      },
      submit() {
        const that = this
        const data = this.data
        this.validation(this.data)
        if (this.submitStatus) {
          this.$vux.confirm.show({
            title: '确认保存？',
            content: '',
            onConfirm() {
              const URL = `${siteUrl}/additionalInfo/save`
              that.axios.postData(URL, data, (response) => {
                if (response.code === 200) {
                  that.$router.go(-1)
                  that.$vux.toast.text('保存成功', 'middle')
                  that.$vux.confirm.hide()
                } else if (response.message) {
                  that.$vux.toast.text(response.message, 'middle')
                }
              }, () => {
                that.$vux.toast.text('操作失败', 'middle')
                that.$vux.confirm.hide()
              })
            }
          })
        }
      },
      validation(val) {
        if (!val.title || !val.title.trim()) {
          this.$vux.toast.text('请输入信息标题', 'middle')
          this.submitStatus = false
          return false
        } else if (!val.contents || !val.contents.trim()) {
          this.$vux.toast.text('请输入信息描述', 'middle')
          this.submitStatus = false
          return false
        }
        this.submitStatus = true
        return true
      },
      //
      reportEvent() {
        const that = this
        const data = this.data
        if (!this.validation(this.data)) return
        const URL = `${siteUrl}/additionalInfo/sendsave`
        this.$vux.confirm.show({
          title: '确认上报？',
          content: '',
          onConfirm() {
            that.axios.postData(URL, data, (response) => {
              if (response.code === 200) {
                const url = `${siteUrl}/eventdispose/report`
                that.data.mainObjectId = response.response.eventInfoId
                that.axios.postData(url, that.data, (res) => {
                  if (res.code === 200) {
                    that.$vux.toast.text('上报成功', 'middle')
                    that.$router.go(-1)
                  } else {
                    that.$vux.toast.text(response.message, 'middle')
                  }
                })
              } else {
                that.$vux.toast.text(response.message, 'middle')
              }
            })
          }
        })
      }
    }
  }
</script>
