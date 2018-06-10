<template>
  <div>
    <!-- 点击后进入检索页面-->
    <gsafety-app-search :options="saerchOption"  :r="searchRouter"></gsafety-app-search>

    <scroller :height="scrollH" lock-x scrollbar-y use-pullup
              :pullup-config="pullup_config"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0, true)">
      <div>
        <!--begin效果图-->
        <div>
          <transition-page :options="promptDiagram"></transition-page>
        </div>
        <!--end效果图-->
        <!-- 机构 按钮-->
        <group title="武汉市政务交流平台">
          <cell v-for="(x,index) in orgs" :key="index" :title="x.orgName" value="" is-link @click.native="jumpOrgView(x.orgCode)"></cell>
        </group>

        <!--  通信录列表 -->
        <div class="vux-reddot-s" v-for="x in users">
          <communicate-cell :data="x"></communicate-cell>
        </div>
      </div>
    </scroller>
  </div>
</template>

<style lang="less" scoped>

</style>

<script>
  import {
    Scroller,
    Cell,
    Group
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { appUrl } from '../../utils/common'
  import GsafetyAppSearch from './../gsafetycomponents/GsafetyAppSearch'
  import TransitionPage from './../mycomponents/TransitionPage'
  import CommunicateCell from './../mycomponents/UserListChild'

  const URL_REUEST = `${appUrl}/app/communicate/findOrgs`


  Vue.use(VueResource)

  export default {
    // 组件
    components: {
      Cell,
      Group,
      Scroller,
      CommunicateCell,
      GsafetyAppSearch,
      TransitionPage
    },
    // 数据模型
    data() {
      return {
        scrollH: '-90',
        searchRouter: '',
        orgs: [],
        users: [],
        saerchOption: { placeholder: '可按手机号、拼音、名字、机构查询', link: '' },
        pullup_config: {
          content: '',
          downContent: '',
          upContent: '',
          loadingContent: '没有更多数据',
          hight: 60
        },
        pulldown_config: {
          content: '',
          downContent: '松开刷新',
          upContent: '松开刷新',
          loadingContent: '数据加载中...',
          hight: 60
        },
        // 提示图
        promptDiagram: {
          show: false,
          imgUrl: '',
          content: '',
          myColor: {
            type: String,
            default: '#e45050'
          }
        }
      }
    },
  // 页面加载
    created() {
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (vm.$store.state.projectType === 'mini') {
          vm.scrollH = '-42'
        }
        vm.searchRouter = '/CommunicateQueryAll'
        vm.loadPage(0)
        vm.$store.commit('setHeaderTitle', '通讯录') // 设置头部文字
      })
    },
    beforeCreate() {
      const that = this
      this.$nextTick(() => {
        that.$store.dispatch('showPageLoading')
      })
    },
  // 方法
    methods: {
      /**
       * 加载数据
       * @param pageIndex 页数
       * @param reload 是否重新加载
       */
      loadPage(pageIndex) {
        const that = this
        // 如果是第一页，则重置页面列表
        if (pageIndex === 0) {
          this.pageIndex = 0
          this.orgs = []
          this.users = []
          // 添加加载效果图
          this.promptDiagram.show = true // 开启效果图
          this.promptDiagram.imgUrl = require('assets/image/loading.gif')
          this.promptDiagram.content = ''
        }
        const url = URL_REUEST

        const data = {}
        this.$http.post(url, data).then(function (res) {
          const code = res.body.code
          if (code === 200) {
            that.promptDiagram.show = false
            that.$store.dispatch('hidePageLoading')
            Array.from(res.body.response.list, x => this.orgs.push(x)
          )
          } else {
            // console.error(res)
          }
          this.$refs.scroll1.donePullup()
          this.$refs.scroll1.donePulldown()
          this.$nextTick(() => { this.$refs.scroll1.reset() })
        })
      },
      jumpOrgView(orgCode) {
        const r = `/communicate/CommunicateOrgUser/${orgCode}`
        this.$router.push(r)
        this.id = orgCode
        this.searchRouter = '/CommunicateQueryAll'
        this.loadPage(0)
      }
    }
  }
</script>
