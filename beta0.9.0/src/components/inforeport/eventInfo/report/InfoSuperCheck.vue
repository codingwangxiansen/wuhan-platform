<template>
 <div>
    <div>
      <info-item :data="eventBase" :attachs="attachs"></info-item>
      <!--
      <approve-info :data="sub" :record="record"></approve-info>
      -->
    </div>
	<!--
    <div>
      <div :class="orgCurrentClass" class="square-o" @click="expandCurrentOrg"><span>本级审批领导</span></div>
      <div v-show="isExpandCurrentOrg">
        <group title="上级" v-show="isSuperior">
          <user-list label="主报领导" :users="sup.applyRrecord"></user-list>
          <user-list label="抄报领导" :users="sup.applyRecordDtos"></user-list>
        </group>
      </div>
      <group v-show="checkStatus">
        <div class="sub-title">审核意见:</div>
        <x-textarea placeholder="请输入审核意见" :readonly="write" v-model="superCheck.handleMsg" :rows="4" :max="100"></x-textarea>
      </group>
      <group v-show="refuseStatus">
        <div class="sub-title">退回原因:</div>
        <x-textarea placeholder="请输入退回原因" :readonly="write" v-model="superCheck.handleMsg" :rows="4" :max="100"></x-textarea>
      </group>
    </div>
	-->
<!--
  <flexbox v-show="status1">
  <flexbox-item>
  <x-button type="primary" @click.native="CheckThrough">审核</x-button>
  </flexbox-item>
  <flexbox-item>
  <x-button type="warn" @click.native="Refuse">退回</x-button>
  </flexbox-item>
  </flexbox>
-->

   <!--审核-确认-上报-->
<!--
   <flexbox v-show="save_check">
     <flexbox-item>
       <x-button type="primary" @click.native="saveCheck">确认</x-button>
     </flexbox-item>
     <flexbox-item>
       <x-button type="warn" @click.native="Cancel">取消</x-button>
     </flexbox-item>
   </flexbox>

  </br>
   <flexbox  v-show="status2">
  <flexbox-item>
  <x-button type="primary" @click.native="sendReport">上报</x-button>
  </flexbox-item>
  <flexbox-item>
  <x-button type="warn" @click.native="Cancel">取消</x-button>
  </flexbox-item>
  </flexbox>
-->

<!--退回-确认-重报-->
<!--
   <flexbox  v-show="resend">
     <flexbox-item>
       <x-button type="primary" @click.native="resendReport">重报</x-button>
     </flexbox-item>
     <flexbox-item>
       <x-button type="warn" @click.native="Cancel">取消</x-button>
     </flexbox-item>
   </flexbox>
-->
 </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
  .square-o{
    padding: 10px 10px;
  }
  .square-o span:first-child{
    margin-left: 7px;
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
import ApproveInfo from '../../../gsafetycomponents/ApproveInfo'

Vue.use(VueResource)

export default {
  data() {
    return {
      id: '',
      eventBase: {},
      record: {},
      superCheck: {},
      attachs: [],
      orgClass: 'gs-plus-square-o',
      orgCurrentClass: 'gs-plus-square-o',
      data: {},
      isExpandOrg: false,
      isExpandCurrentOrg: false,
      status1: true,
      status2: false,
      checkStatus: false,
      refuseStatus: false,
      save_check: false,
      write: false,
      isSuperior: true,
      resend: false,
      sub: {
        applyRrecord: [],
        applyRecordDtos: []
      },
      sup: {
        applyRrecord: [],
        applyRecordDtos: []
      }

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
    UserList,
    ApproveInfo
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
            if (this.eventBase.recordDto) {
              this.record = this.eventBase.recordDto
              this.convertUsers(this.eventBase)
            }
            if (this.eventBase.attachExist) {
              this.attachs = JSON.parse(this.eventBase.attachId)
            }
            if (this.eventBase.dealflag && this.eventBase.checkStatus) {
              this.checkStatus = true
            }
          }
        })
    },
    convertUsers(data) {
      // 主报
      if (data.applyRrecord) {
        const valueAtrr = Object.values(data.applyRrecord)
        valueAtrr.forEach((value) => {
          // 上级
          if (value.userTypeCode === 1) {
            this.sup.applyRrecord.push(value)
          } else {
            this.sub.applyRrecord.push(value)
          }
        })
      }
      // 抄报
      if (data.applyRecordDtos) {
        const valueDtos = Object.values(data.applyRecordDtos)
        valueDtos.forEach((value) => {
          if (value.userTypeCode === 1) {
            this.sup.applyRecordDtos.push(value)
          } else {
            this.sub.applyRecordDtos.push(value)
          }
        })
      }
    },
    expandOrg() {
      this.isExpandOrg = !this.isExpandOrg
      if (this.isExpandOrg) {
        this.orgClass = 'gs-minus-square-o'
      } else {
        this.orgClass = 'gs-plus-square-o'
      }
    },
    expandCurrentOrg() {
      this.isExpandCurrentOrg = !this.isExpandCurrentOrg
      if (this.isExpandCurrentOrg) {
        this.orgCurrentClass = 'gs-minus-square-o'
      } else {
        this.orgCurrentClass = 'gs-plus-square-o'
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
          // 上级审核内容
          that.data.id = that.sup.applyRrecord[0].id
          that.data.handleMsg = that.superCheck.handleMsg
          that.$http.post(saveUrl, that.data).then((response) => {
            console.log(response)
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
    }
  }
}
</script>
