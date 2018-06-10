<!--
	呈报领导场景,用户选择几个主要呈报机构、领导，编辑内容后上报

	页面可以新增领导批示意见

	用户选择机构，点击转办后发送给对应机构


 -->
<template>
  <div class="sendLead">
  	<box>
  	 <group title="选择呈报单位">
	   <div class="unit">
       	<checklist title="" :label-position="labelPosition" required
                  :options="orgList" v-model="selectOrgList" @on-change="change"></checklist>
       </div>
  	 </group>
     <leader-selector leaderType='2' v-model="selectLeadList" label="选择呈报领导"></leader-selector>

	 <!-- 	这里分享用户信息的2个图标	 -->
	 <!--
	 <x-switch title="微信通知" v-model="wechat"></x-switch>
	 <x-switch title="短信通知" v-model="cellphone"></x-switch>
	 -->
	    <divider></divider>
	    <!-- TODO 这里只能摆2个阿牛 -->
	  	<x-button type="default" action-type="button" @click.native="commit">呈报</x-button>
	  	<x-button type="default" action-type="button"  @click.native="share">去分享</x-button>
	</box>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
  .unit {
    overflow-y: scroll;
  }
  .leader {
    height:200px;
    overflow-y: scroll;

  }
  button.weui-btn, input.weui-btn {
    width: 95%;
    border-width: 0;
    outline: 0;
    -webkit-appearance: none;
    margin: 0px 10px;
    position: fixed;
    bottom: 0;
  }
  button.weui-btn_theme {
    bottom:3em;
  }
</style>
<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
import { ConfirmPlugin, Group, CellBox, Checklist, Cell, Divider, XButton, Box, XTextarea, XSwitch } from 'vux'
// import _ from 'lodash'
import { siteUrl } from '../../../../utils/common'
import LeaderSelector from '../../../gsafetycomponents/LeaderSelector'

Vue.use(ConfirmPlugin)
Vue.use(VueRouter)

export default {
  mounted() {
      /*
      *  setTimeout(() => {
      *    this.asyncList = ['A', 'B', 'C', 'D']
      *  }, 3000)
      * */
  },
  components: {
    ConfirmPlugin,
    Group,
    Checklist,
    Cell,
    Divider,
    XButton,
    CellBox,
    Box,
    XTextarea,
    LeaderSelector,
    XSwitch
  },
  beforeRouteEnter(to, from, next) {
      // 通过 `vm` 访问组件实例
    next((vm) => {
      vm.$store.commit('setHeaderTitle', '信息呈报') // 设置头部文字
      vm.changeId(vm.$router.history.current.params.id)
    })
  },

  methods: {
    change() {
//       console.log('change', val, label)
    },
    init() {

    },
//    为了避免在路由中操作参数，在这里定义一个函数修改this.id
    changeId(id) {
      this.id = id
    },
    /*
     * 提交呈报
     */
    commit() {
      const vm = this
      this.$vux.confirm.show({
        title: '确认呈报给领导？',
        content: '',
        onConfirm() {
            // alert('呈报成功')
          const url = `${siteUrl}/eventInfo/sendToBoss`
          const orgs = vm.selectOrgList.join(',')
          const leaders = vm.selectLeadList.join(',')
          const data = {
            mainObjectId: vm.id,
            recvId: orgs,
            userid: leaders
          }
          vm.$http.post(url, data).then(() => {
              // 返回码不正确时直接结束
            // alert('呈报成功')
            vm.$vux.toast.text('呈报成功', 'middle')
            vm.$router.go(-1)
            vm.showV = false
          })
        }
      })
    },
    /*
    *
    */
    share() {
      this.$router.push(`/report/editInfoShare/${this.id}`)
    },

    /*
    * 取消
    */
    goback() {
      this.$router.go(-1)
    },
    getList() {
//      const url = siteUrl
      const that = this
//        接口地址
      const geturl = ''
      this.$http.get(geturl).then((response) => {
        if (response.body.code === 200) {
//          this.viewData = response.body.response
          const units = []
          const res = response.body.response
//  单位循环 先获取res的属性值生成一个数组
          if (res) {
            const resValArr = Object.values(res)
            resValArr.forEach((value) => {
              const orgNameArr = Object.values(value.orgName)
              orgNameArr.forEach((nameVal) => {
                units.push(nameVal)
              })
            })
          }
//          单位
          that.unitsList = units
//          领导
          that.leaderList = []
        }
      })
    }
  },
  data() {
    return {
      fullValues: [],
      labelPosition: '',
      error: '',
      // [{key:'name',value:'省政府应急办',inlineDesc:'inlineDesc'}]
      orgList: [
        { key: 'A0002', value: '省政府应急办' },
        { key: 'A0004', value: '市委总值班室' }
      ],
// [ '省政府应急办', '省政府应急办值班室', '市委办公厅', '市委办公厅总值班室' ],
      leaderList: ['领导一', '领导二', '领导三'],
      selectOrgList: [],
      selectLeadList: [],
      comment: '',
      wechat: false,
      cellphone: false,
      id: ''
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
