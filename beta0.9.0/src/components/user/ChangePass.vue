<template>
  <div class="transInfo">
    <box gap="10px 10px">
      <group title="修改密码">
        <x-input title="原始密码:"  placeholder="必填" v-model='beforePass' :show-clear="false" text-align="right"></x-input>
        <x-input title="新密码:" placeholder="必填" v-model='newPass' :show-clear="false" text-align="right"></x-input>
        <x-input title="确认密码:" placeholder="必填" v-model='agreePass' :show-clear="false" text-align="right"></x-input>
        <!--提示-->
        <p class="tips" v-show="tip"><span>*</span> 请与新密码保值一致</p>

        <x-button type="theme" @click.native="agree">
          确定
        </x-button>
        <x-button type="warn" @click.native="cancel">
          取消
        </x-button>
      </group>
    </box>
  </div>
</template>
<style lang="less" scoped>

  @import "../../styles/common.less";

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
        beforePass: '',
        newPass: '',
        agreePass: '',
        tip: false
      }
    },
    created() {
    },
    // 方法
    methods: {
//    用户审核
      agree() {
        const that = this
        const data = {
          oldPwd: this.beforePass,
          password: this.newPass,
          newPassword: this.agreePass
        }
        if (this.newPass === this.agreePass) {
//            console.log('密码一致')
          this.tip = false
        } else {
          this.tip = true
          return
        }
        that.$vux.confirm.show({
          title: '确认修改？',
          content: '',
          onConfirm() {
            const url = `${siteUrl}/basedata/user/updatePwd`
            that.axios.post(url, data)
              .then((response) => {
                that.$vux.toast.text(response.data.message, 'middle')
                that.$vux.confirm.hide()
                if (response.data.code === 200) {
                  that.$router.push('/')
                }
              })
              .catch(() => {
                that.$vux.toast.text('修改失败', 'middle')
                that.$vux.confirm.hide()
              })
          }
        })
      },
//      修改密码
      cancel() {
        this.$router.go(-1)
      }
    }
  }
</script>
