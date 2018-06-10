<template>
  <div class="register">
    <group class="loginTop" title="登录信息">
      <x-input title="用户登录名:"  placeholder="必填"   v-model='dataUser.userLoginname' :show-clear="false"></x-input>
      <x-input title="用户密码:"  placeholder="*8-16位,必须含字母和数字" v-model='dataUser.userPwd' :show-clear="false"></x-input>
    </group>
    <group class="loginTel" title="个人信息">
        <org-check-list class="unitName" v-model="orgs" label="单位名称:" :maxLength="1" valid="all"></org-check-list>
        <x-input title="处所科室:" placeholder="必填，例如：某某处、某某科" v-model='dataUser.applyMsg' :show-clear="false"></x-input>
        <x-input title="用户姓名:" placeholder="必填" v-model='dataUser.userName' :show-clear="false"></x-input>
        <x-input title="用户职务:"  placeholder="必填，例如：主任、副主任、处长、值班员等"   v-model='dataUser.userProf' :show-clear="false"></x-input>
        <x-input title="手机号码:"  placeholder="必填" v-model='dataUser.userCellPhone' :show-clear="false" keyboard="number" is-type="china-mobile"></x-input>
        <x-input title="办公电话:"  placeholder="必填" v-model='dataUser.userTel' :show-clear="false" keyboard="number" ></x-input>
        <x-input title="邮箱:" v-model='dataUser.uesrEmail' :show-clear="false" is-type="email"></x-input>
        <x-input title="QQ:" v-model='dataUser.userQq' :show-clear="false" keyboard="number" ></x-input>
    </group>
    <!-- 获取验证码  -->
    <!-- <box gap="10px 10px"> -->
    <!-- </box> -->
    <!-- 短信验证码校验注册-->
    <div>
      <group class="loginTel" title="">
        <x-button class="registerVcode" type="theme" :disabled="disabled" @click.native="validationPhone">{{btntxt}}</x-button>
        <x-input title="输入验证码:" :max='4' v-model='vcode.input' :show-clear="false"></x-input>
      </group>
      <box gap="10px 10px">
        <x-button type="default" @click.native="validateCode">注   册</x-button>
      </box>
    </div>
    <divider>Copyright &copy; 武汉市应急办</divider>
  </div>
</template>
<style lang="less" scoped>
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
  .registerVcode {
    width: 140px;
    position: absolute;
    right: 0px;
    z-index: 600;
  }
</style>
<script>
  import {
    PopupRadio,
    XInput,
    Group,
    XButton,
    Box,
    Divider
    } from 'vux'
  import { siteUrl } from '../../utils/common'
  import OrgSelector from '../gsafetycomponents/OrgSelector.vue'
  import OrgCheckList from '../inforeport/commoncompents/OrgCheckList'

  export default {
      // 数据模型
    data() {
      return {
        disabled: false,
        time: 60,
        btntxt: '获取验证码',
        submitStatus: false,
        dataUser: {
          sex: '0'
        },
        message: '',
        orgs: [],
        options: [{ key: '0', value: '男' }, { key: '1', value: '女' }],
        section: 'default', // default-默认 input-输入验证码 confirm-确认
        vcode: { input: '', dest: '000000000' }
      }
    },
    // 组件
    components: {
      PopupRadio,
      XInput,
      Group,
      XButton,
      OrgSelector,
      OrgCheckList,
      Box,
      Divider
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        vm.$store.commit('setHeaderTitle', '用户注册') // 设置头部文字
      })
    },
    // vue实例创建后调用
    created() {
    },
    // 定义方法区
    methods: {
      register() {
        const that = this
        this.dataUser.userOrgCode = this.convertUser(this.orgs)
        const data = that.dataUser
        this.submitStatus = this.validation(data)
        const URL = `${siteUrl}/basregisterlist/add?registerChannel=APP`
        if (this.submitStatus) {
          this.$vux.confirm.show({
            title: '是否确认注册？',
            content: '',
            onConfirm() {
              that.$http.post(URL, data).then((response) => {
                console.log(response)
                if (response.body.code === 200) {
                  that.$vux.toast.show({
                    text: '注册成功！',
                    onHide() {
                      that.$gsafety.closeWindow(response.body.code)
                      that.$vux.confirm.hide()
                      if (wx.miniProgram) {
                        wx.miniProgram.navigateBack(1)
                      }
                    }
                  })
                } else if (response.body.message) {
                  that.$vux.toast.text(response.body.message, 'middle')
                }
              }, () => {
                that.$vux.toast.text('操作失败', 'middle')
                that.$vux.confirm.hide()
              })
            }
          })
        }
      },
      convertUser(val) {
        return val[0]
      },
      validation(data) {
        if (!data.userLoginname) {
          this.$vux.toast.text('请输入用户登录名！', 'middle')
          return false
        }
        if (!data.userPwd) {
          this.$vux.toast.text('请输入用户密码！', 'middle')
          return false
        }
        const regex = '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$'
        const reg = new RegExp(regex)
        if (!reg.test(data.userPwd)) {
          if (data.userPwd.length < 8 || data.userPwd.length > 16) {
            this.$vux.toast.text('用户密码输入不正确，必须为8-16位！', 'middle')
          } else {
            this.$vux.toast.text('用户密码输入不正确，必须为英文和数字的组合！', 'middle')
          }
          return false
        }
        if (!data.userOrgCode) {
          this.$vux.toast.text('单位尚未选择，请选择！', 'middle')
          return false
        }
        if (!data.applyMsg) {
          this.$vux.toast.text('二级部门尚未选择，请选择！', 'middle')
          return false
        }
        if (!data.userName) {
          this.$vux.toast.text('请输入用户姓名！', 'middle')
          return false
        }
        if (!data.userProf) {
          this.$vux.toast.text('请输入用户职务！', 'middle')
          return false
        }
        if (!data.userCellPhone) {
          this.$vux.toast.text('请输入手机号！', 'middle')
          return false
        }
        if (!data.userTel) {
          this.$vux.toast.text('请输入办公电话！', 'middle')
          return false
        }
        return true
      },
      /**
       * 获取验证码前验证手机号格式
       */
      validationPhone() {
        const that = this
        const userCellPhone = that.dataUser.userCellPhone
        console.log(userCellPhone)
        if (!userCellPhone) {
          that.$vux.toast.text('请输入手机号！', 'middle')
        } else {
          const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
          if (!reg.test(userCellPhone)) {
            that.$vux.toast.text('手机格式不正确', 'middle')
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
        that.axios.post(url, { mobile: this.dataUser.userCellPhone,
          loginname: this.dataUser.userLoginname,
          email: this.dataUser.uesrEmail,
          type: 'REGISTER' })
          .then((response) => {
            console.debug(response)
            const data = response.data
            if (data.code === 200) {
              that.disabled = true
              that.timer()
              that.vcode.dest = data.response.code
              this.section = 'input'
              console.log(this.section)
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
        if (this.vcode.input === this.vcode.dest) {
          // 弹出toast提示，2秒后进入注册
          this.register()
        } else {
          // 什么也不做
          this.$vux.toast.text('验证码错误', 'middle')
        }
      }
    }
  }
</script>
