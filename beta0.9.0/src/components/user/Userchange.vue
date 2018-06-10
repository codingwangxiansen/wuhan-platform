<template>
  <div class="userchange">
    <group title="登录信息" class="longininfo">
      <x-input title="用户登录名:" readonly v-model='currentUser.loginname' :show-clear="false"></x-input>
      <x-input title="用户密码:" readonly v-model='userpwd' :show-clear="false"></x-input>
    </group>
    <group title="个人信息" class="userinfo">
      <x-input title="单位名称:" readonly v-model='currentUser.orgName' :show-clear="false"></x-input>
      <x-input title="处所科室:" readonly v-model='currentUser.department' :show-clear="false"></x-input>
      <x-input title="用户姓名:" readonly v-model='currentUser.username' :show-clear="false"></x-input>
      <x-input title="用户职务:" readonly v-model='currentUser.position' :show-clear="false"></x-input>
      <x-input title="手机号码:" readonly v-model='currentUser.tel' :show-clear="false"></x-input>
      <x-input title="办公电话:" readonly v-model='currentUser.officeTel' :show-clear="false"></x-input>
      <x-input title="邮箱:" readonly  v-model='currentUser.email' :show-clear="false"></x-input>
      <x-input title="QQ:" readonly  v-model='currentUser.qq' :show-clear="false"></x-input>
      <!-- <x-input title="微信号:" readonly v-show="currentUser.wechat" v-model='currentUser.wechat' :show-clear="false"></x-input> -->
    </group>
    <group title="微信信息" class="userinfo" v-if="currentUser.weChartUser">
      <div class="wechat-img">
        <img :src="headimgurl" alt="">
      </div>
      <p class="wechat-name">{{nickname}}</p>
    </group>
    <group title="常用功能" class="commonUser">
      <cell title="修改信息" link="/user/userinfo" is-link></cell>
      <cell title="重置密码" link="/user/findPwd" is-link></cell>
      <cell title="帮助" @click.native="openHelp" is-link></cell>
      <!--<cell title="我的消息" link="/push" is-link></cell>-->
      <!-- <cell title="帮助" class="help-title" :link='helpLink' is-link></cell> -->
      <!--<a></a>-->
      <cell title="联系我们" link="/user/about" is-link></cell>
    </group>
    <box class="positionBtn">
      <x-button type="default" @click.native="logout">退出系统</x-button>
    </box>
  </div>
</template>
<style lang="less" scoped>
  @import "../../styles/common.less";
  .commonUser {
    margin-bottom: 60px;
  }

  .wechat-img{
    padding: 10px;
    margin-top: 10px;
    text-align: center;
    img{
      width: 100px;
      border-radius: 50%;
    }
  }

  .wechat-name{
    line-height: 30px;
    text-align: center;
    margin-bottom: 10px;
  }

  .positionBtn {
    position: fixed;
    bottom: 0;
    width: 95%;
    background: #ededed;
    padding: 10px;
    z-index: 99;
  }
  .help-title{
    letter-spacing: 1.8rem;
  }
</style>
<script>
  import {
      XButton,
      XInput,
      Group,
      Box,
      Cell
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import config from 'src/config'

  Vue.use(VueResource)

  export default {
    // 组件
    components: {
      XButton,
      XInput,
      Group,
      Box,
      Cell
    },
    // 数据模型
    data() {
      return {
        check: '',
        currentUser: {},
        helpLink: '',
        userpwd: '●●●●●●'
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        vm.$store.commit('setHeaderTitle', '个人中心') // 设置头部文字
      })
    },
    created() {
      this.currentUser = this.$store.state.user
      this.helpLink = `${config.helpLink}`
    },
    computed: {
      showTransAdmin() {
        if (this.$store.state.user.auditStatus === '1') {
          return true
        }
        return false
      },
      headimgurl() {
        if (this.currentUser.weChartUser) {
          return this.currentUser.weChartUser.headimgurl
        }
        return ''
      },
      nickname() {
        if (this.currentUser.weChartUser) {
          return this.currentUser.weChartUser.nickname
        }
        return ''
      }
    },
    // 方法
    methods: {
      logout() {
        const that = this
        that.$vux.confirm.show({
          title: '确认退出？',
          content: '',
          onConfirm() {
            that.$vux.confirm.hide()
            // 调用安卓退出登录方法
            that.$gsafety.closeWeb()
          }
        })
      },
      openHelp() {
        const that = this
        that.$gsafety.openWindow({
          // url: 'http://mp.weixin.qq.com/s?__biz=MzU3MjUwNDQ2Nw==&mid=100000010&idx=1&sn=e5db04a8f50800d7501e5b0b0cfd05c4&scene=19#wechat_redirect'
          url: 'https://whyj.gsafetyweixinsupport.cn/help/%E5%B8%AE%E5%8A%A9%E6%89%8B%E5%86%8Chtml/app%E7%AE%80%E6%98%8E%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.htm'
        })
      }
    }
  }
</script>
