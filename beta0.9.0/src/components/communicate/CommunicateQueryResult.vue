<template>
  <div class="communicateSearch">
    <div class="header" @click="close">
      <x-header :left-options="{showBack:false,backText:''}">
        <div class="selectHeader" slot>
          <input class="" type="search" v-model="search"
                 disabled="true" placeholder="请输入姓名或关键字"/></div>
      </x-header>
    </div>
    <scroller height="-46" lock-x scrollbar-y use-pullup
              :class="scrollH? 'mini' : ''"
              :pullup-config="pullup_config"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0, search)">
      <div>
        <!--begin效果图-->
        <div>
          <transition-page :options="promptDiagram"></transition-page>
        </div>
        <!--end效果图-->
        <!-- 机构 按钮-->
        <!--<cell v-for="(x,index) in orgs" :key="index" :title="x.orgName" value="" is-link @click.native="jumpOrgView(x.orgCode)"></cell>-->
        <!--  通信录列表 -->
        <div class="vux-reddot-s" v-for="x in orgs">
          <org-cell :data="x"></org-cell>
        </div>
        <div class="vux-reddot-s" v-for="x in communicateList">
          <communicate-cell :data="x"></communicate-cell>
        </div>
      </div>
    </scroller>
  </div>
</template>

<style lang="less">
  .mini {
    margin-top: 46px;
  }
</style>

<script>

  import {
    Scroller,
    Cell,
    XHeader
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { appUrl } from '../../utils/common'
  import CommunicateCell from './../mycomponents/UserListChild'
  import OrgCell from './components/OrgCell.vue'
  import TransitionPage from './../mycomponents/TransitionPage'

  const URL_REUEST = `${appUrl}/app/communicate/getQueryResult`

  Vue.use(VueResource)

  export default {
    // 组件
    components: {
      CommunicateCell,
      Scroller,
      Cell,
      TransitionPage,
      OrgCell,
      XHeader
    },
    // 数据模型
    data() {
      return {
        scrollH: false,
        keyWord: '',
        // 搜索内容
        search: '',
        communicateList: [{ name: '李杰', headship: '市长秘书', mobile: '13878956325' }],
        orgs: [],
        pullup_config: {
          content: '',
          downContent: '没有更多数据',
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
        //        判断头部是否隐藏，假如不隐藏
        if (vm.$store.state.projectType === 'mini') {
          vm.scrollH = true
        }
        vm.init()
      })
    },
    // 方法
    methods: {
      /**
       * 加载数据,按关键字查询
       *
       * @param pageIndex 页数
       * @param eppType 类型
       * @param reload 是否重新加载
       */
      init() {
        // 读取关键字，查询列表
        const hrefUrl = location.href
        const urlArr = hrefUrl.split('?')
        this.search = decodeURI(urlArr[urlArr.length - 1])
        // 加载数据
        this.loadPage(0, this.search)
      },
      loadPage(pageIndex, keyWord) {
        // 如果是第一页，则重置页面列表
        if (pageIndex === 0) {
          this.pageIndex = 0
          this.orgs = []
          this.communicateList = []
          this.promptDiagram.show = true // 开启效果图
          this.promptDiagram.imgUrl = require('assets/image/loading.gif')
          this.promptDiagram.content = ''
        }
        const url = `${URL_REUEST}?page=${pageIndex}`
        const data = { keyWord }
        this.$http.post(url, data).then(function (res) {
          const code = res.body.code
          if (code === 200) {
            const items = res.body.response
            this.communicateList = this.communicateList.concat(items.list)
            this.orgs = this.orgs.concat(items.orgs)
          }
          if (this.communicateList.length > 0 || this.orgs.length > 0) {
            this.promptDiagram.show = false // 关闭效果图
          } else if (this.orgs.length <= 0 && this.communicateList.length <= 0) {
            // 添加加载效果图
            this.promptDiagram.show = true // 开启效果图
            this.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png')
            this.promptDiagram.content = '暂无数据！'
          } else if (this.communicateList.length < 10) {
            this.$refs.scroll1.disablePullup()
          }
          this.$refs.scroll1.donePullup()
          this.$refs.scroll1.donePulldown()
          this.$nextTick(() => { this.$refs.scroll1.reset({ top: 0 }) })
        })
      },
      jumpOrgView(orgCode) {
        const r = `/communicate/CommunicateOrgUser/${orgCode}`
        this.$router.push(r)
      },
      /**
       * 关闭当前activity
       */
      close() {
        if (this.$gsafety) {
          this.$gsafety.closeWindow()
        }
      },
      /**
       * 返回上页activity
       */
      back() {
        if (this.$gsafety) {
          this.$gsafety.closeWindow()
        }
      }
    }

  }
</script>
