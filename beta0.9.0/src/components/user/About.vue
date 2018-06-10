<template>
  <div class="register">
    <group>
        <x-input title="技术支持:" readonly v-model='data.company' :show-clear="false"></x-input>
        <x-input title="联系人员:" readonly v-model='data.userName' :show-clear="false"></x-input>
        <x-input title="联系电话:" @click.native="openPhone(data.phone)" readonly v-model='data.phone' :show-clear="false"></x-input>
        <x-input title="邮箱:" readonly v-model='data.email' :show-clear="false"></x-input>
    </group>

    <group>
      <x-input title="责任单位:" readonly v-model='data.unit' :show-clear="false"></x-input>
      <x-input title="联系电话1:" @click.native="openPhone(data.mobile)" readonly v-model='data.mobile' :href="'tel:' + data.mobile" :show-clear="false"></x-input>
      <x-input title="联系电话2:" @click.native="openPhone(data.mobile2)" readonly v-model='data.mobile2' :href="'tel:' + data.mobile2" :show-clear="false"></x-input>
      <!--<x-input title="邮箱:" readonly v-model='data.email' :show-clear="false"></x-input>-->
    </group>
    <divider>Copyright &copy; 武汉市应急办</divider>
  </div>
</template>

<style lang="less" scoped>
  .register .vux-divider {
    position: fixed;
    bottom: 0;
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
  import OrgSelector from '../gsafetycomponents/OrgSelector.vue'
  import OrgCheckList from '../inforeport/commoncompents/OrgCheckList'

  export default {
      // 数据模型
    data() {
      return {
        data: {
          company: '北京辰安科技股份有限公司',
          userName: '王雨辉',
          phone: '18971053947',
          email: 'wangyuhui@gsafety.com',
          unit: '武汉市政府应急办',
          mobile: '82826101',
          mobile2: '82826102'
        }
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
        vm.$store.commit('setHeaderTitle', '联系我们') // 设置头部文字
      })
    },
    // vue实例创建后调用
    created() {
    },
    // 定义方法区
    methods: {
      openPhone(tel) {
        window.location.href = `tel:${tel}`
      }
    }
  }
</script>
