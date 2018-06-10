<template>

  <div>
    <contact-detail :user="orgUser"></contact-detail>
    <group class="detail-info-part">
      <!--:inline-desc="orgUser.mobileTel"-->
      <cell  v-if="orgUser.mobileTel" title="手机：">
        <a :href="'tel:' + orgUser.mobileTel">{{orgUser.mobileTel}}</a>
      </cell>
      <cell  v-if="orgUser.officeTel" title="座机：">
        <a :href="'tel:' + orgUser.officeTel">{{orgUser.officeTel}}</a>
      </cell>
    </group>
  </div>
</template>

<style lang="less" scoped>
</style>

<script>
  import Vue from 'vue'
  import {
    Group,
    Cell
  } from 'vux'
  import VueResource from 'vue-resource'
  import { appUrl } from '../../utils/common'
  import ContactDetail from './../mycomponents/ContactDetail'

  Vue.use(VueResource)
  const URL_REUEST = `${appUrl}/app/communicate/getOrgUserDetailById/`

  export default {
    // 组件
    components: {
      ContactDetail,
      Group,
      Cell
    },
    name: 'CommunicateView',
    // 数据模型
    data() {
      return {
        id: this.$router.history.current.params.id,
        orgUser: {},
        islink: true,
        imgUrl: '../static/faceBig.png'
      }
    },
    watch: {
    },
  // vue实例创建后调用
    created() {
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 加载数据
        vm.id = vm.$router.history.current.params.id
        vm.getOrgUser(vm.id)
      })
    },
  // 定义方法区
    methods: {
      getOrgUser(id) {
        const url = URL_REUEST + id
        this.$http.get(url).then(
          function (response) {
            if (response.body.code === 200) {
              this.orgUser = response.body.response
            }
          })
      }
    }
  }
</script>
