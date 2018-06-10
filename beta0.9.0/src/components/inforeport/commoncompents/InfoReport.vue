<template>
 <div>
  	<div>
		<info-item :data="eventBase" @showFullScreen="showFullScreen"></info-item>
    </div>
    <div class="add-info">
    	<div :class="orgClass" class="square-o" @click="expandOrg"><span>审批领导</span></div>
    	<div v-show="isExpandOrg">
  		<group title="上级" v-show="isSuperior">
  			<user-list label="主报领导" :users="eventBase.applyRrecord"></user-list>
  			<user-list label="抄报领导" :users="eventBase.applyRecordDtos"></user-list>
  		</group>
  		<group title="下级" v-show="!isSuperior">
  			<user-list label="审批领导" :users="eventBase.applyRrecord"></user-list>
  		</group>
  		</div>
	</div>
  	<group v-show="checkStatus" title="审核意见">
      <x-textarea readonly v-model="record.handleMsg" :rows="4"></x-textarea>
  	</group>
	  <group v-show="refuseStatus" title="退回原因">
      <x-textarea readonly v-model="record.handleMsg" :rows="4"></x-textarea>
  	</group>

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
  @import "../../../styles/common.less";
  .square-o{
    padding: 5px 10px;
  }
  .square-o span:first-child{
    margin-left: 7px;
  }
  .add-info{
    margin-bottom: 15px;
  }
</style>
<script>
// 导入页面所需的标签
import { Cell, Group, XInput, XTextarea, XButton, Flexbox, FlexboxItem } from 'vux'
import Vue from 'vue'
import VueResource from 'vue-resource'
import { siteUrl } from '../../../utils/common'
import InfoItem from './InfoItem'
import UserList from '../../gsafetycomponents/UserList'

Vue.use(VueResource)

export default {
  data() {
    return {
      id: '',
      eventBase: {},
      record: {},
      dataUser: {},
      orgClass: 'gs-plus-square-o',
      data: {},
      isExpandOrg: false,
      status2: true,
      checkStatus: true,
      refuseStatus: false,
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
        vm.$store.commit('setHeaderTitle', '信息上报')  // 设置头部文字
      }
    )
  },
  created() {
    this.id = this.$router.history.current.params.id
    this.getUser(this.getEventBase)
  },
  methods: {
    getUser(cb) {
      const URL = siteUrl + this.$REST.BASEDATA.DATAUSER
      const data = {}
      const that = this
      that.axios.post(URL, data)
        .then((response) => {
          if (response.data.code === 200) {
            that.dataUser = response.data.response
            cb()
          }
        })
        .catch(() => {
          console.log('error')
        })
    },
    getStatus() {
      if (this.eventBase.infoHandleStatus === 3 && this.dataUser.typeCode === 0) {
        this.status2 = false
        this.resend = false
      }
    },
    getEventBase() {
      const val = this.id
      const URL = `${siteUrl}${this.$REST.EventInfo.CHECKVIEW}/${val}`
      const that = this

      that.axios.get(URL)
        .then((response) => {
          if (response.data.code) {
            that.eventBase = response.data.response
            that.record = that.eventBase.recordDto
            that.getStatus()
            console.log(that.eventBase)
            if (that.record.handleStatus === 1) {
              that.checkStatus = true
              that.refuseStatus = false
            } else {
              that.checkStatus = false
              that.refuseStatus = true
            }
          }
        })
        .catch(() => {
          console.log('err')
        })

    /*  this.$http.get(URL).then(
        function(response){
          if(200 === response.body.code){
            this.eventBase = response.body.response
            this.record = this.eventBase.recordDto
            this.getStatus()
            console.log(this.eventBase)
            if(this.record.handleStatus=='1'){
              this.checkStatus = true
              this.refuseStatus = false
            }else{
              this.checkStatus = false
              this.refuseStatus = true
            }
          }
        }) */
    },
    expandOrg() {
      this.isExpandOrg = !this.isExpandOrg
      if (this.isExpandOrg) {
        this.orgClass = 'gs-minus-square-o'
      } else {
        this.orgClass = 'gs-plus-square-o'
      }
    },
    resendReport() {
      const that = this
      this.$vux.confirm.show({
        title: '确认重报？',
        content: '',
        onConfirm() {
          that.$vux.toast.text('操作成功！', 'middle')
          that.$vux.confirm.hide()
          that.status2 = false
          that.resend = false
        }
      })
    },
    sendReport() {
      const url = `${location.origin}${location.pathname}${this.$DEFAULT.REPORT.sendReport}/${this.id}`
      const options = { url, actionBarType: 1, title: '送审' }
      if (this.$gsafety) {
        this.$gsafety.openWindow(options)
      }
    },
    Cancel() {
      this.checkStatus = false
      this.refuseStatus = false
      this.status2 = false
      this.resend = false
    },
    showFullScreen(imgs) {  // 全屏查看图片
      this.$emit('showFullScreen', imgs)
    }
  }
}
</script>
