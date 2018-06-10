<!--
	呈报领导场景,用户选择几个主要呈报机构、领导，编辑内容后上报

	页面可以新增领导批示意见

	用户选择机构，点击转办后发送给对应机构
 -->
<template>
  <div class="infoTarget">
  	<box gap="10px 10px">
      <group title="信息上报">
        <cell title="默认上报单位" value="武汉市应急办" ></cell>
        <!-- <org-check-list ref="clearLead" v-model="selectOrgList" label="选择上报单位"></org-check-list> -->
        <!-- <leader-selector ref="userSelect" v-model="selectLeadList" label="选择上报领导" leaderType="1"></leader-selector> -->
      </group>
	    <divider></divider>
	  	<x-button mini type="theme" @click.native="commit">确定</x-button>
	  	<x-button mini type="default" @click.native="goback">取消</x-button>
	</box>
  </div>
</template>
<script>
import { ConfirmPlugin, Group, CellBox, Divider, XButton, Box, Cell } from 'vux'
import { siteUrl } from '../../../../utils/common'
import LeaderSelector from '../../../gsafetycomponents/LeaderSelector.vue'
// import OrgSelector from '../gsafetycomponents/OrgSelector.vue'
import OrgCheckList from '../../commoncompents/OrgCheckList.vue'

export default {
  mounted() {
/* setTimeout(() => {
    this.asyncList = ['A', 'B', 'C', 'D']
  }, 3000) */
  },
  components: {
    ConfirmPlugin,
    Group,
    Divider,
    XButton,
    CellBox,
    Box,
    LeaderSelector,
    OrgCheckList,
    Cell
  },
  beforeRouteEnter(to, from, next) {
    next(
      (vm) => {
        vm.$store.commit('setHeaderTitle', '信息上报')  // 设置头部文字
        vm.data.mainObjectId = vm.$router.history.current.params.id
        console.log(vm.$router.history.current.params)
        console.log(1111)
        console.log(vm.data.mainObjectId)
        vm.init()
      }
    )
  },
  created() {
  },
  methods: {
    change() {
    },
    init() {
      this.data.recvId = ''
      this.data.userid = ''
      this.$refs.clearLead.init()
      this.$refs.userSelect.init()
    },
    conv() {
      this.data.recvId = this.selectOrgList.join(',')
      this.data.userid = this.selectLeadList.join(',')
    },
    /* 提交呈报 */
    commit() {
      const that = this
      console.log('提交提交提交')
      that.$vux.confirm.show({
        title: '确认上报？',
        content: '',
        onConfirm() {
          that.conv()
          const url = `${siteUrl}/eventdispose/report`
          that.$http.post(url, that.data).then((response) => {
            console.log(response)
            if (response.status === 200) {
              // that.alertShow('上报成功')
              that.$vux.toast.text('上报成功', 'middle')
              that.$router.go(-2)
            }
          }, () => {
            that.$vux.confirm.hide()
            // that.alertShow('操作失败')
            that.$vux.toast.text('操作失败', 'middle')
          })
        }
      })
    },
    /* 取消 */
    goback() {
      this.$router.go(-1)
    }
  },
  data() {
    return {
      fullValues: [],
      labelPosition: '',
      error: '',
      selectOrgList: [],
      selectLeadList: [],
      comment: '',
      sendLeader: false,
      data: {
        mainObjectName: 'EVENT_INFO',
        mainObjectId: '',
        recvId: '',
        userid: ''
      }
    }
  }
}
</script>

<style scoped>
.error {
  padding-left: 15px;
  line-height: 28px;
  color: #888;
  font-size: 12px;
}
</style>
