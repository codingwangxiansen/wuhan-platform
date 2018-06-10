<!--
  预案检索结果页，列表不带分类栏
-->
<template>
  <div style="background:#f4f4f4">
    <!-- begin search top
      点击这个栏目的任何位置都会在app中返回上一个页面
    -->
    <div>
      <div class="resultPage" @click="close">
        <x-header :left-options="{showBack:true,backText:''}">
          <div class="headSearch" slot><input class="" type="search" v-model="search" disabled="true"/></div>
        </x-header>
      </div>
    </div>
    <!-- end search top-->
    <!-- begin search list-->
    <scroller height="-90"  lock-x scrollbar-y  use-pullup :pullup-config="pullup_config" @on-pullup-loading="refreshUp()" ref="scroll1"
              use-pulldown :pulldown-config="pulldown_config" @on-pulldown-loading="refreshDown()">
      <div>
        <div>
          <transition-page :options="promptDiagram"></transition-page>
        </div>
        <div>
          <div class="vux-reddot-s" v-for="x in expertList" >
            <list-child :dataModel="x"></list-child>
          </div>
        </div>
      </div>
    </scroller>
    <!-- end search list-->
  </div>
</template>
<style lang="less" scoped="scoped">

</style>
<script>
  // 导入页面所需的标签
  import { Scroller, XHeader } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../utils/common'
  import ListChild from './../mycomponents/Listchild'
  import TransitionPage from './../mycomponents/TransitionPage'

  // 启用请求组件
  Vue.use(VueResource)
  // 查询请求地址
  const URL_REUEST = `${siteUrl}/rest/biz/query`
  export default {
    // 组件
    components: {
      XHeader,
      Scroller,
      ListChild,
      TransitionPage
    },
    // 数据模型
    data() {
      return {
        // 搜索内容
        search: '',
        expertList: [],
        viewUrl: '',
        pageIndex: 0,
        // 滚动条上拉配置
        pullup_config: {
          content: '刷新',
          downContent: '',
          upContent: '',
          loadingContent: '加载中...',
          hight: 60
        },
        // 滚动条下拉配置
        pulldown_config: {
          content: '刷新',
          downContent: '',
          upContent: '',
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
        vm.$store.commit('setHeaderTitle', '我的消息') // 设置头部文字
      })
    },
    // vue实例创建后调用
    created() {
      // 读取关键字，查询列表
      if (this.search !== null) {
        this.search = ''
      }
      this.search = this.$route.query.search
      this.loadData(this.search)
    },
    // 定义方法区
    methods: {
      /**
       * 加载数据,按关键字查询
       *
       * @param pageIndex 页数
       * @param keyWord 查询条件
       * @param reload 是否重新加载
       */
      loadData(keyWord) {
        // 添加加载效果图
        this.promptDiagram.show = true // 开启效果图
        this.promptDiagram.imgUrl = require('assets/image/loading.gif') // eslint-disable-line global-require
        this.promptDiagram.content = ''
        const url = URL_REUEST
        const data = { keyWords: keyWord, page: this.pageIndex }
        this.$http.post(url, data).then((res) => {
          const code = res.body.code
          this.viewUrl = res.body.response.searchLink
          if (code === 200) {
            console.log(res.body.response.list)
            Array.from(res.body.response.list, (x) => {
              this.expertList.push(x)
              return this.expertList
            })
          } else {
            console.error(res)
          }
          if (this.expertList.length > 0) {
            console.log('关闭效果图')
            this.promptDiagram.show = false // 关闭效果图
            this.ishow = true
          }
          if (this.expertList.length === 0) {
            // 没有数据用动态图提示
            console.log('没有数据')
            this.promptDiagram.show = true
            this.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png') // eslint-disable-line global-require
            this.promptDiagram.content = '查询结果为空'
          }

          if (this.pageIndex === 0) {
            console.log('page为0重置滚动条高度')
            this.$nextTick(() => {
              this.$refs.scroll1.reset({ top: 0 })
            })
          }
          // 请求到数据后，将滚动条回到顶部
          this.$nextTick(() => {
            this.$refs.scroll1.reset()
          })
          this.pageIndex += 1
          this.$refs.scroll1.donePullup()
          this.$refs.scroll1.donePulldown()
        })
      },
      refreshUp() {
        console.log('up')
        const keyWord = this.search
        setTimeout(() => { this.loadData(keyWord) }, 2000)
      },
      refreshDown() {
        console.log('down')
        const keyWord = this.search
        setTimeout(() => { this.loadPage(keyWord) }, 1500)
      },
      loadPage() {
        const keyWord = this.search
        this.pageIndex = 0
        this.expertList = []
        this.loadData(keyWord)
      },
      /**
       * 关闭当前activity
       */
      close() {
        if (this.$gsafety) {
          this.$gsafety.closeWindow()
        }
      }
    }
  }
</script>
