<template>
  <div>
    <div>
      <!-- 点击后进入检索页面-->
      <gsafety-app-search :options="saerchOption" :r="searchRouter"></gsafety-app-search>

      <!-- 机构 分组 按钮-->
      <group>
        <cell title="政务通讯录" value="" is-link link="/communicate/CommunicateOrg">
          <img class="title-img" slot="icon" src="../../assets/image/icon/zwtxl.png">
        </cell>
      </group>
    </div>
    <scroller class="communicate-content" lock-x scrollbar-y :height="scrollH"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0)">
      <div>
        <!--begin效果图-->
        <div>
          <transition-page :options="promptDiagram"></transition-page>
        </div>
        <!--end效果图-->
        <!--  通信录列表 -->
        <div class="vux-reddot-s" v-for="x in communicateList">
          <communicate-cell :data="x"></communicate-cell>
        </div>
      </div>
    </scroller>
  </div>
</template>

<style lang="less" scoped>
  @import "../../styles/common.less";
  @import "../../styles/communicate.less";
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
  import CommunicateCell from './../mycomponents/UserListChild'
  import TransitionPage from './../mycomponents/TransitionPage'

  Vue.use(VueResource)
  const URL_REUEST = `${appUrl}/app/communicate/getOrgUsers`

  export default {
    // 组件
    components: {
      Cell,
      Group,
      CommunicateCell,
      Scroller,
      GsafetyAppSearch,
      TransitionPage
    },
    // 数据模型
    data() {
      return {
        scrollH: '-106',
        value: '机构',
        searchRouter: '',
        actionType: 'Communicate',
        communicateList: [{ name: '李杰', headship: '市长秘书', mobile: '13878956325' }],
        saerchOption: { placeholder: '可以按手机号、拼音、名字、机构查询', link: '' },
        resultUrlGroup: '',
        pulldown_config: {
          content: '',
          downContent: '刷新',
          upContent: '刷新',
          loadingContent: '加载中...',
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
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        vm.loadPage(0)
        if (vm.$store.state.projectType === 'mini') {
          vm.scrollH = '-64'
        }
        vm.$store.commit('setHeaderTitle', '通讯录') // 设置头部文字
        // 加载数据
      })
    },
    beforeCreate() {
      const that = this
      this.$nextTick(() => {
        that.$store.dispatch('showPageLoading')
      })
    },
    // 页面加载
    created() {
      this.searchRouter = '/CommunicateQueryAll'
// eslint-disable-next-line max-len
//      this.saerchOption.link = location.origin + htmlUrl + this.$COMMUNICATE.Communicate.QUERY_ALL_URL
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
          this.communicateList = []
          // 添加加载效果图
          this.promptDiagram.show = true // 开启效果图
          this.promptDiagram.imgUrl = require('assets/image/loading.gif')
          this.promptDiagram.content = ''
        }

        const url = URL_REUEST
        const data = {}
        console.log(url)
        this.$http.post(url, data).then(function (res) {
          const code = res.body.code
          if (code === 200) {
            that.promptDiagram.show = false
            that.$store.dispatch('hidePageLoading')
            const items = res.body.response
            this.communicateList = this.communicateList.concat(items.list)
          } else {
            console.error(res)
          }
          this.$refs.scroll1.donePulldown()
          this.$nextTick(() => {
            this.$refs.scroll1.reset()
          })
        })
      }
    }
  }
</script>
