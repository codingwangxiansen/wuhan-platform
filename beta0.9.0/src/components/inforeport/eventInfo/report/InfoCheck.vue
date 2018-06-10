<template>
 <div>
  	<div>
		<info-item :data="eventBase"
               @showFullScreen="showFullScreen"
               ></info-item>
    </div>
    <div class="add-info">
    	<div :class="orgClass" class="square-o" @click="expandOrg"><span>审批领导</span></div>
    	<div v-show="isExpandOrg">
  		<group title="上级" v-show="isSuperior">
  			<user-list label="主报领导" :users="eventBase.applyRrecord"></user-list>
  			<user-list label="抄报领导" :users="eventBase.applyRecordDtos"></user-list>
  		</group>
  		<group title="下级" v-show="!isSuperior">
  			<user-list label="审批领导" :users="eventBase.mainLeaders"></user-list>
  		</group>
  		</div>
	</div>
  	<group v-show="checkStatus">
  		<div class="sub-title">审核意见:</div>
      <x-textarea placeholder="请输入审核意见" :readonly="write" v-model="record.handleMsg" :rows="4" :max="100"></x-textarea>
  	</group>
	<group v-show="refuseStatus">
  		<div class="sub-title">退回原因:</div>
      <x-textarea placeholder="请输入退回原因" :readonly="write" v-model="record.handleMsg" :rows="4" :max="100"></x-textarea>
  	</group>

  <flexbox v-show="status1">
  <flexbox-item>
  <x-button type="theme" @click.native="CheckThrough">审核</x-button>
  </flexbox-item>
  <flexbox-item>
  <x-button type="warn" @click.native="Refuse">退回</x-button>
  </flexbox-item>
  </flexbox>

   <!--审核-确认-上报-->
   <flexbox v-show="save_check">
     <flexbox-item>
       <x-button type="theme" @click.native="saveCheck">确认</x-button>
     </flexbox-item>
     <flexbox-item>
       <x-button type="warn" @click.native="Cancel">取消</x-button>
     </flexbox-item>
   </flexbox>

  <br />
   <flexbox  v-show="status2">
  <flexbox-item>
  <x-button type="theme" @click.native="sendReport">上报</x-button>
  </flexbox-item>
  <flexbox-item>
  <x-button type="warn" @click.native="Cancel">取消</x-button>
  </flexbox-item>
  </flexbox>

<!--退回-确认-重报-->
   <flexbox  v-show="resend">
     <flexbox-item>
       <x-button type="theme" @click.native="resendReport">重报</x-button>
     </flexbox-item>
     <flexbox-item>
       <x-button type="warn" @click.native="Cancel">取消</x-button>
     </flexbox-item>
   </flexbox>
 </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
  .square-o{
    padding: 5px 10px;
  }
  .square-o span:first-child{
    margin-left: 7px;
  }
  .add-info{
    margin-bottom: 15px;
  }
  .sub-title{
    padding: 10px 15px;
    font-size: 16px;
  }
</style>
<script>
// 导入页面所需的标签
import { Cell, Group, XInput, XTextarea, XButton, Flexbox, FlexboxItem } from 'vux'
import Vue from 'vue'
import VueResource from 'vue-resource'
import { siteUrl } from '../../../../utils/common'
import InfoItem from '../../commoncompents/InfoItem'
import UserList from '../../../gsafetycomponents/UserList'

Vue.use(VueResource)

export default {
  data() {
    return {
      id: '',
      eventBase: {},
      record: {},
      org: {},
      orgClass: 'gs-plus-square-o',
      data: {},
      isExpandOrg: false,
      status1: true,
      status2: false,
      checkStatus: false,
      refuseStatus: false,
      save_check: false,
      write: false,
      isSuperior: true,
      resend: false
    }
  },
// 组件
  components: {
    Cell,
    XTextarea,
    XButton,
    XInput,
    Flexbox,
    FlexboxItem,
    Group,
    InfoItem,
    UserList
  },
  beforeRouteEnter(to, from, next) {
    next(
      (vm) => {
        vm.$store.commit('setHeaderTitle', '信息审核')  // 设置头部文字
      }
    )
  },
  created() {
    this.id = this.$router.history.current.params.id
    this.getEventBase(this.id)
  },
  methods: {
    getEventBase(val) {
      const URL = `${siteUrl}${this.$REST.EventInfo.CHECKVIEW}/${val}`
      this.$http.get(URL).then(
        function (response) {
          if (response.body.code === 200) {
            this.eventBase = response.body.response
            this.record = this.eventBase.recordDto
            if (this.eventBase.dealflag && this.eventBase.checkStatus) {
              this.checkStatus = true
            }
          }
        })
    },
    expandOrg() {
      this.isExpandOrg = !this.isExpandOrg
      if (this.isExpandOrg) {
        this.orgClass = 'gs-minus-square-o'
      } else {
        this.orgClass = 'gs-plus-square-o'
      }
    },
    saveCheck() {
      const that = this
      const saveUrl = siteUrl + this.$REST.EventInfo.CHECK
      this.$vux.confirm.show({
        title: '确认保存？',
        content: '',
        onConfirm() {
          that.loadingShow = true
          that.loadText = '保存中，请稍等...'
          that.data.mainObjectName = 'EVENT_INFO'
          that.data.mainObjectId = that.id
          that.data.id = that.record.id
          that.data.handleMsg = that.record.handleMsg
          that.$http.post(saveUrl, that.data).then((response) => {
            that.loadingShow = false
            if (response.status === 200) {
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
        // 退回
          if (that.refuseStatus) {
            that.resend = true
            that.status2 = false
          }
        // 审核
          if (that.checkStatus) {
            that.resend = false
            that.status2 = true
          }
          that.$vux.confirm.hide()
          that.save_check = false
          that.write = true
        }
      })
    },
    resendReport() {
      const that = this
      this.$vux.confirm.show({
        title: '确认重报？',
        content: '',
        onConfirm() {
          // that.alertShow('操作成功！')
          that.$vux.toast.text('操作成功', 'middle')
          that.$vux.confirm.hide()
          that.status1 = true
          that.save_check = false
          that.status2 = false
          that.write = false
          that.resend = false
        }
      })
    },
    CheckThrough() {
      this.checkStatus = true
      this.refuseStatus = false
      this.save_check = true
      this.status1 = false
      this.status2 = false
      this.data.handleStatus = 1
    },
    Refuse() {
      this.checkStatus = false
      this.refuseStatus = true
      this.save_check = true
      this.status1 = false
      this.status2 = false
      this.resend = false
      this.data.handleStatus = 0
    },
    sendReport() {
      const url = `${location.origin}${location.pathname}${this.$DEFAULT.REPORT.sendReport}/${this.id}`
      // let url = location.origin + htmlUrl +'/module/inforeport.html#/report/check/report'
      const options = { url, actionBarType: 1, title: '送审' }
      if (this.$gsafety) {
        this.$gsafety.openWindow(options)
      }
    },
    Cancel() {
      this.checkStatus = false
      this.refuseStatus = false
      this.status1 = true
      this.save_check = false
      this.status2 = false
      this.write = false
      this.resend = false
    },
    showFullScreen(imgs) { // 全屏查看图片
      this.$emit('showFullScreen', imgs)
    }
  }
}
</script>
