<template>
  <div class="transInfo">
    <box gap="10px 10px">
      <group title="修改手机号">
        <x-input title="原手机号:" readonly v-model='oldPhone' :show-clear="false" text-align="left"></x-input>
        <x-input title="新手机号:" :max='11' keyboard="number" is-type="china-mobile" placeholder="必填" v-model='newPhone' :show-clear="false" text-align="left"></x-input>
        <x-button class="changeVcode" type="theme" :disabled="disabled" @click.native="validationPhone">{{btntxt}}</x-button>
        <x-input title="输入验证码:" :max='4' v-model='code' :show-clear="false"></x-input>
        <x-button type="default" class="submitbtn" @click.native="validateCode">确定</x-button>
      </group>
    </box>
  </div>
</template>
<style lang="less" scoped>

  @import "../../styles/common.less";
  .submitbtn{
    position: fixed;
    bottom: 10px;
    width: 95% !important;
  }
  .changeVcode{
    z-index: 600;
    width: 140px !important;
    position: absolute;
    right: 0px;
  }
  .tips {
    color: red;
    text-align: right;
    border-top: 1px solid #eff0f2;
    margin: 0 15px;
  }
  .weui-cell:before {
    right:15px;
  }
</style>
<script>
  import {
    Cell,
    Scroller,
    XButton,
    Flexbox,
    FlexboxItem,
    Group,
    XTextarea,
    Box,
    Popup,
    XInput
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../utils/common'

  Vue.use(VueResource)

  export default {
    props: ['popMsg'],
    // 组件
    components: {
      Flexbox,
      FlexboxItem,
      Cell,
      Scroller,
      XButton,
      Group,
      XTextarea,
      Box,
      Popup,
      XInput
    },
    // 数据模型
    data() {
      return {
        disabled: false,
        oldPhone: this.$router.history.current.params.id,
        newPhone: '',
        code: '',
        vcode: '00000000',
        tip: false,
        btntxt: '获取验证码',
        user: this.$store.state.user
      }
    },
    created() {
      this.$store.commit('setHeaderTitle', '修改手机号') // 设置头部文字
    },
    // 方法
    methods: {
//    用户审核
      updatephone() {
        const data = {
          id: this.user.id,
          mobileTel: this.newPhone
        }
        // console.log(param)
        const that = this
        that.$vux.confirm.show({
          title: '确认修改？',
          content: '',
          onConfirm() {
            const url = `${siteUrl}/basregisterlist/user/updateuserphone`
            that.axios.post(url, data)
              .then((response) => {
                if (response.data.code === 200) {
                  that.user.tel = that.newPhone
                  that.setUser(that.user)
                  that.$vux.toast.text('修改成功！', 'middle')
                  that.$router.go(-1)
                } else {
                  that.$vux.toast.text('修改失败！', 'middle')
                }
              })
              .catch(() => {
                that.$vux.toast.text('修改失败', 'middle')
              })
          }
        })
      },
//      修改密码
      cancel() {
        this.$router.go(-1)
      },
      validationPhone() {
        const that = this
        const userCellPhone = that.newPhone
        if (!userCellPhone) {
          that.$vux.toast.text('请输入手机号！', 'middle')
        } else {
          const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
          if (!reg.test(userCellPhone)) {
            that.$vux.toast.text('手机格式不正确', 'middle')
          } else if (userCellPhone === that.oldPhone) {
            that.$vux.toast.text('手机号与原号码一致', 'middle')
          } else {
            that.time = 60
            that.fetch()
          }
        }
      },
      /**
       * 倒计时60秒，再次获取验证码
       */
      timer() {
        if (this.time > 0) {
          this.time--
          this.btntxt = `${this.time}s后重新获取`
          setTimeout(this.timer, 1000)
        } else {
          this.time = 0
          this.btntxt = '获取验证码'
          this.disabled = false
        }
      },
      /*
       *  获取二维码
       */
      fetch() {
        // 进入验证码输入流程
        const that = this
        const url = `${siteUrl}/basregisterlist/generateCode`
        that.axios.post(url, { mobile: this.newPhone,
          type: 'CHANGE_PHONE' })
          .then((response) => {
            console.debug(response)
            const data = response.data
            if (data.code === 200) {
              that.disabled = true
              that.timer()
              that.vcode = data.response.code
            } else {
              that.$vux.toast.text(response.data.message, 'middle')
            }
          })
          .catch(() => {
            // 失败时
            that.$vux.toast.text('获取验证码失败，请稍后再试', 'middle')
          })
      },
      /*
       * 校验手机验证码
       */
      validateCode() {
        if (this.code === this.vcode) {
          // 弹出toast提示，2秒后进入注册
          this.updatephone()
        } else {
          // 什么也不做
          this.$vux.toast.text('验证码错误', 'middle')
        }
      },
      setUser(userInfo) {
        this.$store.commit('setUser', userInfo)
      }
    }
  }
</script>
