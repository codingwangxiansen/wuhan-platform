<!-- 找回密码场景 -->
<template>
 	<div>
 			<!--
 		<div style="margin: 10px;overflow: hidden;">
	      <masker style="border-radius: 2px;" color="F9C90C" :opacity="0.8">
	        <div class="m-img" style="background-image:url()"></div>
	        <div slot="content" class="m-title">
	         	 重置密码
	          <br/>
	          <span class="m-time"></span>
	        </div>
	      </masker>
	    </div>
 			-->
	    <!-- step 1 -->
	    <div v-show="step=='1'">
	  		<group class="loginTop" title="">
	      		<x-input title="手机号:"  v-model='data.tel' placeholder='请输入注册时使用的手机号'></x-input>
	    	</group>
	    	<box gap="10px 10px">
	      		<x-button v-show='data.tel != ""' type="theme" @click.native="getUsers">下一步</x-button>
	    	</box>
	    </div>

    	<!-- step 2 -->
    	<div v-show="step=='2'">
	  		<group title="检测手机号">
	  			<x-input title="手机号:" type="tel"  v-model='data.tel' readonly></x-input>
	  			<cell title="状态:" :is-loading="loading" :value="vcodeOptions.authentication"></cell>
	  			<!--
	      		<checklist title="" :options="commonList" v-model="data.userids" :max="1" ></checklist>
	  			-->
	    	</group>
	    	<box gap="10px 10px">
	      		<x-button type="theme" v-show="commonList.length > 0 && !loading"
	      			@click.native="getQrcode" :show-loading='vcodeOptions.loading'
	      			:disabled="vcodeOptions.disabled">获取验证码</x-button>
	      		<x-button type="default" @click.native="step = '1'">上一步</x-button>
	    	</box>
    	</div>
    	<!-- step 3 -->
    	<div v-show="step=='3'">
	  		<group class="loginTop" title="">
	  			<x-input title="手机号:"  v-model='data.tel' readonly></x-input>
	  			<cell title="状态:" :value="vcodeOptions.authentication"></cell>
	  			<!--
	      		<checklist title="" :options="commonList" v-model="data.userids" :max="1" disabled></checklist>
	  			-->
	  			<x-input title="输入验证码:"  v-model='data.icode'></x-input>
	    	</group>
	    	<box gap="10px 10px" >
	      		<x-button type="theme" @click.native="findPwd" :show-loading="resetOptions.loading"
	      			:disabled="resetOptions.disabled">重置密码</x-button>
	      		<!--
	      		<x-button type="default" @click.native="step = '2'">上一步</x-button>
	      		-->
	    	</box>
    	</div>
    	<!-- step 4 -->
    	<div v-show="step=='4'">
	  		<group title="重置密码">
	  			<x-input title="新密码:" type="password"  v-model='data.pwd' :readonly='close'></x-input>
	  			<x-input title="确认密码:" type="password"  v-model='data.rpwd' :readonly='close'></x-input>
	    	</group>
	    	<box gap="10px 10px" >
	      		<x-button v-show='data.pwd != "" & data.rpwd != "" && !close' type="theme"
	      			:show-loading="resetOptions.loading"
	      			@click.native="updatePwd">重置</x-button>
	      		<x-button type="default" v-show='close' disabled>已重置</x-button>
	    	</box>
    	</div>
    	<!-- tips -->
    	<div v-transfer-dom>
	      <x-dialog v-model="showDialogStyle" hide-on-blur
	      	:dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
	        <p style="color:#fff;text-align:center;" @click="closePage">
	          <span style="font-size:30px;">您的密码修改成功！</span>
	          <br>
	          <br>
	          <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
	        </p>
	      </x-dialog>
	    </div>
  	</div>
</template>
<style lang="less" scoped>

.m-img {
  padding-bottom: 33%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}
.m-title {
  color: #fff;
  text-align: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, .5);
  font-weight: 500;
  font-size: 16px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}
.m-time {
  font-size: 12px;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
  display: inline-block;
  margin-top: 5px;
}
</style>
<script>
import {
    Cell,
    Group,
    XInput,
    XButton,
    Box,
    Masker,
    Checklist,
    XDialog,
    TransferDomDirective as TransferDom
} from 'vux'
import Vue from 'vue'
import VueResource from 'vue-resource'
import { appUrl } from '../../utils/common'


  // 启用请求组件
Vue.use(VueResource)

export default {
  // 数据模型
  data() {
    return {
      // 拟办操作显示
      data: {
        tel: '',
        userids: [],
        vcode: '',
        icode: '',
        pwd: '',
        rpwd: '',
        id: ''
      },
      commonList: [],
      step: '1',
      showDialogStyle: false,
      close: false,
      loading: false,
      vcodeOptions: {
        loading: false,
        authentication: null,
        disabled: false
      },
      resetOptions: {
        loading: false,
        disabled: false
      }
    }
  },
      // 组件
  components: {
    Cell,
    Group,
    XInput,
    XButton,
    Box,
    Masker,
    Checklist,
    XDialog
  },
  directives: {
    TransferDom
  },
  // vue实例创建后调用
  created() {

  },
  beforeRouteEnter(to, from, next) {
    next(
      (vm) => {
        vm.$store.commit('setHeaderTitle', '重置密码')  // 设置头部文字
        vm.fetchData()
      }
    )
  },

  computed: {
    // 与父组件通信用属性
    current: {
      get() {
        return new Date()
      }
    }
  },

  methods: {
    fetchData() {
      this.getUsers()
    },
  //  通过手机号查找用户信息
    getUsers() {
      const that = this
      if (!that.data.tel) {
        return
      }
      const URL = `${appUrl}/passwordexchange/getuserinfo?tel=${that.data.tel}`

    // 留一个交互效果
      that.loading = true
      that.authentication = null

      that.axios.get(URL)
          .then((res) => {
            // 查找用户
            that.commonList = []

            res.data.userinfos.forEach(
          ({ userid, username }) => {
            that.commonList.push({ key: userid, value: username, inlineDesc: '' })
            that.data.userids.push(userid)
          }
          )
          // 跳转到下一步
            that.step = '2'

            setTimeout(() => {
              that.loading = false
              that.vcodeOptions.authentication = '已认证'
            }, 1000)
          })
          .catch((res) => {
              // 拉取用户列表失败时
            console.error('error', res)
            this.$vux.confirm.show({
              title: '无效的手机号',
              content: '请确认输入了正确的手机号'
            })
          })
    },
    // 发送验证码，到手机上
    getQrcode() {
      console.debug('getQrcode')
      const that = this
      const URL = `${appUrl}/passwordexchange/exchangecode`

      that.vcodeOptions.loading = true  // 给出一个点击效果
      that.vcodeOptions.disabled = true // 给出一个点击效果

      that.axios.post(URL, that.data)
          .then((res) => {
            that.data.vcode = res.data.vcode  // 获取验证码暂存前端
            that.data.id = res.data.id  // 获取验证码暂存前端

            setTimeout(() => {
              that.step = '3'
              that.vcodeOptions.loading = false
              that.vcodeOptions.disabled = false
            }, 1000)
          })
          .catch(() => {
            console.log('error')
            that.vcodeOptions.loading = false
            that.vcodeOptions.disabled = false
          })
    },
    // 进入重置密码页面，验证手机注册码，直接在前端比对验证码
    findPwd() {
      const that = this

      that.resetOptions.loading = true
      that.resetOptions.disabled = true
      // 增加一个延时过度效果
      setTimeout(() => {
        if (that.data.vcode === that.data.icode) {
          that.step = '4'
        } else {
          that.$vux.toast.text('验证码错误!', 'middle')
        }

        that.resetOptions.loading = false
        that.resetOptions.disabled = false
      }, 1000)
    },
    // 更新密码
    updatePwd() {
      const that = this

      if (that.data.pwd !== that.data.rpwd) {
        that.$vux.toast.text('2次输入密码不一致！', 'middle')
        return
      }

      // 正则匹配密码
      const patt = /^[A-Za-z0-9]{8,16}$/
      if (!patt.test(that.data.pwd)) {
        that.$vux.toast.text('密码不合法！应为8-16位字母数字组合', 'middle')
        return
      }

      const URL = `${appUrl}/passwordexchange/exchangepassword`

      that.resetOptions.loading = true

      that.axios.post(URL, that.data)
          .then(() => {
            // 设置一个交互效果
            setTimeout(() => {
              that.resetOptions.loading = false
              that.showDialogStyle = true
              that.close = true
            }, 1000)
          })
          .catch(() => {
            console.log('error')
          })
    },
    // 修改成功，关闭页面
    closePage() {
      this.showDialogStyle = false
      this.close = true
      // this.$router.go(-1)
    }
  }
}
</script>
