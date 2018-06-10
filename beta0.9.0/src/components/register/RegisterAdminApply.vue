<template>
 	<div>
  		<group class="loginTop" title="管理员审核">
      		<x-input title="用户姓名:"  v-model='data.userName' :show-clear="false" readonly></x-input>
      		<x-input title="用户单位:"  placeholder="必填"   v-model='data.userOrgName' :show-clear="false" readonly></x-input>
      		<x-input title="用户职务:"  placeholder="必填"   v-model='data.userProf' :show-clear="false" readonly></x-input>
      		<x-input title="用户登录名:"  placeholder="必填"   v-model='data.userLoginname' :show-clear="false" readonly></x-input>
      		<!--
      		<x-input title="用户密码:"  placeholder="*8-16位,必须含字母和数字" v-model='data.userPwd' :show-clear="false" readonly></x-input>
      		-->
    	</group>
    	<group class="loginTel" title="联系方式">
        	<x-input title="手机号码:"  placeholder="必填" v-model='data.userCellPhone' :show-clear="false" keyboard="number" is-type="china-mobile" readonly></x-input>
        	<x-input title="办公电话:"  placeholder="必填" v-model='data.userTel' :show-clear="false" keyboard="number" readonly></x-input>
        	<x-input title="邮箱:" v-model='data.uesrEmail' :show-clear="false" is-type="email" readonly></x-input>
        	<x-input title="QQ:" v-model='data.userQq' :show-clear="false" keyboard="number" readonly></x-input>
        	<x-input title="微信号:" v-model='data.userWechat' :show-clear="false" readonly></x-input>
    	</group>
    	<box gap="10px 10px">
      		<x-button v-show="'9' == data.applyResult" type="theme" @click.native="confirmApply">审核通过</x-button>
      		<x-button v-show="'1' == data.applyResult" type="default" >已审核</x-button>
      		<x-button type="default" @click.native="$router.go(-1)">取消</x-button>
    	</box>
  	</div>
</template>
<style lang="less" scoped>
.unitName {
	padding-left: 0.6em;
}

.loginTop .weui-cells__title + .weui-cells {
}

.loginTel .weui-cells__title + .weui-cells {
    height: 230px;
    margin-bottom: 40px;
}

.loginTel .weui-label {
	text-align: right;
}

.weui-cells:before {
    display: none;
}
</style>
<script>
import {
Group,
XInput,
XButton,
Box
} from 'vux'
import Vue from 'vue'
import VueResource from 'vue-resource'
import { siteUrl } from '../../utils/common'


// 启用请求组件
Vue.use(VueResource)

export default {
// 数据模型
  data() {
    return {
      // 拟办操作显示
      data: {
        id: ''
      }
    }
  },
  // 组件
  components: {
    Group,
    XInput,
    XButton,
    Box
  },
  // vue实例创建后调用
  created() {

  },
  beforeRouteEnter(to, from, next) {
    next(
      vm => vm.loadData()
    )
  },
  computed: {
  },
  methods: {
  // 加载数据
    loadData() {
      this.id = this.$router.history.current.params.id
      const URL = `${siteUrl}/basregisterlist/findOne/${this.id}`
      const vm = this
      vm.axios.get(URL)
      .then((response) => {
        if (response.data.code === 200) {
          vm.data = response.data.response
        }
      })
      .catch(() => {
      })
    },
    // 用户确认审核
    confirmApply() {
      const vm = this
      vm.$vux.confirm.show({
        title: '确认提交？',
        content: '',
        onConfirm() {
          vm.submitApply()
        }
      })
    },
    //  提交审核？
    submitApply() {
      const URL = `${siteUrl}/basregisterlist/applySuccess/${this.id}`
      const vm = this
      vm.axios.get(URL)
      .then((response) => {
        if (response.data.code === 200) {
          vm.$vux.toast.text('操作成功', 'middle')
          vm.$router.go(-1)
        }
      })
      .catch(() => {
      })
    }
  }
}
</script>
