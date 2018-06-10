<template>
  <div>
    <div v-show="isSend">
      <group title="上级" v-show="isSuperior">
        <user-selector v-model="sendCheck.mainLeaders" label="主报领导"></user-selector>
        <user-selector v-model="sendCheck.subLeaders" label="抄报领导"></user-selector>
      </group>
      <group title="下级" v-show="!isSuperior">
        <user-selector v-model="sendCheck.mainLeaders" label="审批领导"></user-selector>
      </group>
      <check-way @on-item-click="chooseNoticeWay" :way="sendWay" label="送审方式"></check-way>
    </div>
    <div v-show="isReport">
      <group title="上报机构">
        <org-selector v-model="sendCheck.mainOrgs" label="上报单位"></org-selector>
      </group>
      <check-way @on-item-click="chooseNoticeWay" :way="reportWay" label="上报方式"></check-way>
    </div>
    <div v-show="isFeedback">
     <group title="反馈上报">
        <user-selector v-model="sendCheck.mainLeaders" label="领导姓名"></user-selector>
      </group>
      <check-way @on-item-click="chooseNoticeWay" :way="reportWay" label="上报方式"></check-way>
    </div>
    <x-button class="btn-confirm" type="theme" @click.native="send">确认</x-button>
  </div>
</template>

<style lang="less" scoped>
  .btn-confirm{
    margin-top: 15px;
  }
</style>
<script>
  import { Group, Checker, CheckerItem, XButton, ConfirmPlugin } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import CheckWay from '../../../gsafetycomponents/CheckWay.vue'
  import UserSelector from '../../../gsafetycomponents/UserSelector'
  import OrgSelector from '../../../gsafetycomponents/OrgSelector.vue'

  // 启用请求组件
  Vue.use(VueResource)
  Vue.use(ConfirmPlugin)

  export default {
    // 数据模型
    data() {
      return {
        id: '',
        type: '',
        isSuperior: true,
        submitStatus: false,
        sendCheck: {
          mainLeaders: [],
          subLeaders: [],
          mainOrgs: []
        },
        sendWay: [
          { key: 'wechat', value: '微信送审' },
          { key: 'message', value: '短信送审' }
        ],
        reportWay: [
          { key: 'wechat', value: '微信上报' },
          { key: 'message', value: '短信上报' }
        ],
        isSend: true,
        isReport: false,
        isFeedback: false,
        comfirmTitle: '确认送审？',
        load: '送审中，请稍等...',
        data: {
          mainObjectName: '',
          mainObjectId: '',
          handleUser: '',
          ccLeader: '',
          recvId: '',
          smsNotice: '1',
          weixinNotice: '1',
          recvType: '1'
        },
        comfirmUrl: ''
      }
    },
    // 组件
    components: {
      Group,
      Checker,
      CheckerItem,
      CheckWay,
      UserSelector,
      OrgSelector,
      XButton,
      ConfirmPlugin
    },
    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
          vm.$store.commit('setHeaderTitle', '信息报送')  // 设置头部文字
        }
      )
    },
    // vue实例创建后调用
    created() {
      this.type = this.$router.history.current.params.type
      this.id = this.$router.history.current.params.id
      this.init(this.type)
    },
    // 定义方法区
    methods: {
      init(val) {
        if (val === 'report') {
          this.isSend = false
          this.isReport = true
          this.isFeedback = false
          this.comfirmTitle = '确认上报？'
          this.load = '上报中，请稍等...'
          this.data.recvType = '2'
          this.data.mainObjectName = 'EVENT_INFO'
          this.data.mainObjectId = this.id
          this.comfirmUrl = siteUrl + this.$REST.EventInfo.REPORT
        } else if (val === 'send') {
          this.isSend = true
          this.isReport = false
          this.isFeedback = false
          this.data.mainObjectName = 'EVENT_INFO'
          this.data.mainObjectId = this.id
          this.comfirmUrl = siteUrl + this.$REST.EventInfo.SENDCHECK
        } else if (val === 'feedback') {
          this.isSend = false
          this.isReport = false
          this.isFeedback = true
          this.comfirmTitle = '确认上报？'
          this.load = '上报中，请稍等...'
          this.comfirmUrl = ''
        }
      },
      chooseNoticeWay(keys) {
        this.data.smsNotice = '0'
        this.data.weixinNotice = '0'
        if (keys) {
          const keyValue = Object.values(keys)
          keyValue.forEach((value) => {
            if (value === 'message') {
              this.data.smsNotice = '1'
            }
            if (value === 'wechat') {
              this.data.weixinNotice = '1'
            }
          })
        }
      },
      conv() {
        if (this.isSend) {
          this.data.handleUser = this.convertUser(this.sendCheck.mainLeaders)
          this.data.ccLeader = this.convertUser(this.sendCheck.subLeaders)
        } else if (this.isReport) {
          this.data.recvId = this.convertUser(this.sendCheck.mainOrgs)
        }
      },
      send() {
        const that = this
        this.validateInfo()
        if (this.submitStatus) {
          that.$vux.confirm.show({
            title: this.comfirmTitle,
            content: '',
            onConfirm() {
              that.loadingShow = true
              that.loadText = that.load
              that.conv()
              // let url = siteUrl + this.$REST.EventInfo.SENDCHECK
              that.$http.post(that.comfirmUrl, that.data).then((response) => {
                that.loadingShow = false
                if (response.status === 200) {
                  this.$gsafety.closeWindow()
                  this.$gsafety.closeWindow(response.status)
                  // that.alertShow('操作成功')
                  that.$vux.toast.text('操作成功', 'middle')
                  that.$vux.confirm.hide()
                }
              }, () => {
                that.$vux.confirm.hide()
                that.loadingShow = false
                // that.alertShow('操作失败')
                that.$vux.toast.text('操作失败', 'middle')
              })
            }
          })
        }
      },
      convertUser(val) {
        let a = ''
        if (val) {
          const valueArr = Object.values(val)
          valueArr.forEach((value) => {
            a += `${value},`
          })
        }
        return a
      },
      validateInfo() {
        this.submitStatus = true
      }
    }
  }
</script>
