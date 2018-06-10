<template>
  <div style="background:#f4f4f4">
    <!--begin导航-->
    <div>
     <!-- BEGIN 顶部按钮，点击后进入检索页面-->
     <!--
      <gsafety-app-search :options="saerchOption"></gsafety-app-search>
     -->
    </div>
    <div class="tabClass">
      <tab v-show="tabshow" :line-width="2">
        <tab-item v-for="(item,index) in taglist" :key="index" :selected="currentItem === item.groupCode"  @on-item-click="changeTab(item.groupCode)" animate>{{item.groupName}}</tab-item>
      </tab>
    </div>
    <!--end导航-->

    <!--begin列表数据-->
    <scroller height="-44" v-show="ishow"  lock-x scrollbar-y  use-pullup :pullup-config="pullup_config" @on-pullup-loading="refreshUp(currentItem)" ref="scroll1"
              use-pulldown :pulldown-config="pulldown_config" @on-pulldown-loading="refreshDown(currentItem)">
    <div>
      <!--begin效果图-->
      <div>
        <transition-page :options="promptDiagram"></transition-page>
      </div>
      <!--end效果图-->
      <!--begin置顶消息-->
      <div v-for=" item in topList">
        <title-cell :title="item.flowDto.flowTitle" @click.native="getDetail(item)"></title-cell>
      </div>
      <!--end置顶消息-->
      <div class="vux-reddot-s"  v-for="(x,index) in Objlist" :key="index">
        <push-cell :dataModel="x" @on-cell-click="goPage"></push-cell>
      </div>

        <!--&lt;!&ndash;begin列表浏览到底部begin&ndash;&gt;-->
        <!--<divider>我是有底线的</divider>-->
        <!--&lt;!&ndash;end列表浏览到底部begin&ndash;&gt;-->
    </div>
   </scroller>
    <!--end列表数据-->
    <div>
      <gsafety-bottom-popup :options="bottom_popup_options"></gsafety-bottom-popup>
    </div>
  </div>
</template>
<style lang="less" scoped="scoped">
  .vux-header .vux-header-left .left-arrow:before{
    border-color: #fff !important;
  }
  .vux-header .vux-header-left a{
    color: #fff !important;
    font-size: 16px;
  }
  .vux-header .vux-header-title, .vux-header h1{
    margin-left: 80px !important;
  }
  .vux-header .vux-header-right{
    top: 6px !important;
  }
  .searchBtn{
    background: transparent;
    border: 1px solid #8b0000;
    padding: 7px 10px;
    font-size: 16px;
    color: #fff !important;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .headSearch:before{
    position: absolute;
    margin-left: -20px;
    top: 14px;
    content: " ";
    width: 20px;
    height: 25px;
    border-bottom: 1px solid #fff;
    background: url("../../assets/image/icon/icon-search.png");
    background-size: 20px 20px;
    background-repeat: no-repeat;
  }
  .headSearch:after{
    position: absolute;
    margin-left: -20px;
    top: 14px;
    content: " ";
    width: 20px;
    height: 25px;
    border-bottom: 1px solid #fff;
    background: url("../../assets/image/icon/icon-voice.png");
    background-size: 14px 18px;
    background-repeat: no-repeat;
  }
  .headSearch input{
    border: none;
    background: none;
    height: 30px;
    border-bottom: 1px solid #fff;
    width: 100%;
  }
  .headSearch input:focus{
    border: none;
    background: transparent;
  }
  .headSearch input::-webkit-input-placeholder{
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin-left: 5px;
  }
  .ic_img{
    position:absolute; top:10px; left: 5px;
    width:15px;
    height:15px;
  }
  .weui_cell_bd>p{
    font-size:14px;
  }
  .vux-label-desc{
    padding-right:15px;
  }
  .weui_cell_bd.weui_cell_primary{
    padding-left:5px;
  }

  .vux-tab .vux-tab-item{
    font-size: 14px;
    font-family: "微软雅黑";
  }
  .vux-tab-ink-bar{
    background-color: #e55151;
  }

  .vux-label-desc{
    color: #333333;
    font-weight: bold;
  }
  .vux-no-group-title{
    margin-bottom: 5px;
  }
  .vux-header{
    background-color: #f65741 !important;
  }
  .tabClass{
    font-weight: bold;
  }
  .cellTopPart{
    width: 60px;
    line-height: 30px;
    text-align: center;
    color: #e45050;
    font-weight: bold;
    border: 1px solid #e45050;
    border-radius: 6px;
    padding-top: 5px;
  }
</style>
<script>
  // 导入页面所需的标签
  import { Tab, TabItem, Scroller, Cell, Search } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { appUrl } from '../../utils/common'
  import TitleCell from './../mycomponents/TitelCell'
  import PushCell from './PushCell'
  import TransitionPage from './../mycomponents/TransitionPage'
  import GsafetyBottomPopup from './../gsafetycomponents/GsafetyBottomPopup'
  import GsafetyAppSearch from './../gsafetycomponents/GsafetyAppSearch'
  // 启用请求组件
  Vue.use(VueResource)
  const URL_REUEST = `${appUrl}/rest/biz/message/push/get_pushlist`
  const GROUP_URL = `${appUrl}/rest/group/load`
  // const GET_URL = `${appUrl}/rest/biz/getUrl`
  /* global siteUrl */
  /* eslint no-undef: "error" */
  export default {
    // 数据模型
    data() {
      return {
        tabshow: false,
        group: this.$router.history.current.query.group,
        // 上方搜索栏打开检索页面配置
        saerchOption: { placeholder: '搜索信息', link: '' },
        // 传入DIALOG的参数
        bottom_popup_options: {
          show: false,
          items: [
            {
              label: '信息上报',
              link: '',
              iconType: 'icon-add'
            }]
        },
        headtitle: '信息接报2',
        taglist: [],
        ishow: true, // 是否显示滚动条
        Objlist: [], // 接受列表数据
        topList: [], // 接受置顶数据
        pageIndex: 0,
        currentItem: '', // 当前选中的分类选项
        // 滚动条上拉配置
        pullup_config: {
          content: '',
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
        // 滚动条状态
        statues: {
          pullupstatues: 'default'
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
    // 组件
    components: {
      Tab,
      TabItem,
      Scroller,
      Cell,
      PushCell,
      TitleCell,
      TransitionPage,
      GsafetyBottomPopup,
      Search,
      GsafetyAppSearch
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        if (vm.$router.history.current.query.group === 'NOTIFY') {
          vm.$store.commit('setHeaderTitle', '通知公告') // 设置头部文字
        } else {
          vm.$store.commit('setHeaderTitle', '我的消息') // 设置头部文字
        }
        vm.getGroup(vm.group)
      })
    },
    // vue实例创建后调用
    created() {
      // this.getGroup(this.group)
    },
    // 定义方法区
    methods: {
      getGroup(param) {
        const vm = this
        const data = param === undefined ? {} : { groupCode: param }
        this.$http.post(GROUP_URL, data).then(function (res) {
          const items = res.body.response.result
          this.saerchOption.link = res.body.response.searchLink
          console.log(this.saerchOption.link)
          console.log(items)
          vm.taglist = items
          if (vm.taglist.length > 1) {
            this.tabshow = true
            vm.changeTab(vm.taglist[0].groupCode)
          } else if (vm.taglist.length === 1) {
            this.tabshow = false
            vm.changeTab(vm.taglist[0].groupCode)
          } else {
            vm.promptDiagram.show = true
            vm.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png') // eslint-disable-line global-require
            vm.promptDiagram.content = '查询结果为空'
          }
        })
      },
      getDetail(x) {
        const options = { 'url ': x.flowDto.flowUrl }
        if (x.pushRead !== '1') {
          const url = `${siteUrl}/rest/cgibin/message/readstate/${x.pushId}`
          this.$http.get(url).then(() => {
            if (this.$gsafety) {
              this.$gsafety.openWindow(options)
            }
          })
        } else if (this.$gsafety) {
          this.$gsafety.openWindow(options)
        }
      },
      /*

       */
      loadData(group) {
        const vm = this
        // 添加加载效果图
        this.promptDiagram.show = true // 开启效果图
        this.promptDiagram.imgUrl = require('assets/image/loading.gif') // eslint-disable-line global-require
        this.promptDiagram.content = ''
        console.log(this.pageIndex)
        const data = { flowGroup: group, page: this.pageIndex }
        console.log(data)
        this.$http.post(URL_REUEST, data).then((response) => {
          const items = response.body.response
          console.log(items)
          // 加载默认消息
          vm.Objlist = vm.Objlist.concat(items.result)
          if (vm.Objlist.length > 0) {
            console.log('关闭效果图')
            vm.promptDiagram.show = false // 关闭效果图
            vm.ishow = true
          }
          if (vm.Objlist.length === 0) {
            // 没有数据用动态图提示
            console.log('没有数据')
            vm.promptDiagram.show = true
            vm.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png') // eslint-disable-line global-require
            vm.promptDiagram.content = '查询结果为空'
            // vm.$refs.scroll1.disablePullup() // 没有数据后禁止上拉事件以免向后退发请求
          }
          if (this.pageIndex === 0) {
            console.log('page为0重置滚动条高度')
            vm.$nextTick(() => {
              vm.$refs.scroll1.reset({ top: 0 })
            })
          }
          // 请求到数据后，将滚动条回到顶部
          vm.$nextTick(() => {
            vm.$refs.scroll1.reset()
          })
          this.pageIndex += 1
          vm.$refs.scroll1.donePullup()
          vm.$refs.scroll1.donePulldown()
        })
      },
      refreshUp(tab) {
        console.log('up')
        setTimeout(() => {
          this.loadData(tab)
        }, 2000)
      },
      refreshDown(tab) {
        console.log('down')
        setTimeout(() => {
          this.changeTab(tab)
        }, 1500)
      },
      changeTab(tab) {
        this.currentItem = tab
        console.log('change tab')
        this.Objlist = []
        this.pageIndex = 0
        this.loadData(tab)
      },
      // 进入响应页面
      goPage(data) {
        console.debug(data)
        if (data.pushRead !== '1') {
          /**
           * let url = appUrl + '/rest/cgibin/message/readstate/' + data.pushId
           *this.$http.get(url).then(function (res){
           *console.debug('go page after mark')
           *})
           */
        } else {
          console.debug('go page')
        }
        const r = data.flowDto.flowUrl
        this.$router.push(r)
      }
    }
  }
</script>
