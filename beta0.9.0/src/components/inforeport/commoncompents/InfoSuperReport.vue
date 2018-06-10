<template>
  <div>
    <div>
      <info-item :data="eventBase" @showFullScreen="showFullScreen"></info-item>
      <approve-info :data="sub" :record="record"></approve-info>
      <approve-info :data="sup" :record="supRecord"></approve-info>
    </div>

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
</style>
<script>
// 导入页面所需的标签
import { Cell, Group, XInput, XTextarea, XButton, Flexbox, FlexboxItem } from 'vux'
import Vue from 'vue'
import VueResource from 'vue-resource'
import { siteUrl } from '../../../utils/common'
import InfoItem from './InfoItem'
import UserList from '../../gsafetycomponents/UserList'
import ApproveInfo from '../../gsafetycomponents/ApproveInfo'

Vue.use(VueResource)

export default {
  data() {
    return {
      id: '',
      eventBase: {},
      dataUser: {},
      orgClass: 'gs-plus-square-o',
      data: {},
      isExpandOrg: false,
      status2: true,
      refuseStatus: false,
      isSuperior: true,
      resend: false,
      record: {},
      supRecord: {},
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
      this.$http.post(URL, data).then((response) => {
        console.log(response)
        if (response.body.code === 200) {
          this.dataUser = response.body.response
          cb()
        }
      })
    },
    getStatus() {
      if (this.eventBase.infoHandleStatus === 3 && this.dataUser.typeCode === 0) {
        this.status2 = false
        this.resend = false
      }
    },
    convertUsers(data) {
      // 主报
      if (data.applyRrecord) {
        const recordArr = Object.values(data.applyRrecord)
        recordArr.forEach((value) => {
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
        const DtosArr = Object.values(data.applyRecordDtos)
        DtosArr.forEach((value) => {
          // 上级
          if (value.userTypeCode === 1) {
            this.sup.applyRecordDtos.push(value)
          } else {
            this.sub.applyRecordDtos.push(value)
          }
        })
      }
      this.record = this.sub.applyRrecord[0]
      this.supRecord = this.sup.applyRrecord[0]
    },
    getEventBase() {
      const val = this.id
      const URL = `${siteUrl}${this.$REST.EventInfo.CHECKVIEW}/${val}`
      this.$http.get(URL).then(
        function (response) {
          if (response.body.code === 200) {
            this.eventBase = response.body.response
            this.getStatus()
            this.convertUsers(this.eventBase)
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
      this.refuseStatus = false
      this.status2 = false
      this.resend = false
    },
    showFullScreen(imgs) { // 全屏查看图片
      this.$emit('showFullScreen', imgs)
    }
  }
}
</script>
