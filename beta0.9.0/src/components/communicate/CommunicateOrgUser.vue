<template>
  <div class="orgUserPage">
    <group :title="orgItem.name">
      <div class="orgInfo" v-if="isOrgEntity(orgItem.orgEntity)&&orgItem.tel">
        <p style="color: #999;">值班电话：</p>
        <a @click="linkTo(orgItem.tel)"
           v-for="(item, index) in orgItem.tel"
           :key="index"
           :href="'tel:'+item">{{item}}</a>
      </div>
      <div class="orgInfo" v-if="isOrgEntity(orgItem.orgEntity)&&orgItem.fax">
        <p style="color: #999;"><span>传</span><span class="pull-right">真：</span></p>
        <a @click="linkTo(orgItem.fax)"
           v-for="(item, index) in orgItem.fax"
           :key="index"
           :href="'tel:' + item">{{item}}</a>
      </div>
      <scroller :height="scrollH" lock-x scrollbar-y use-pullup
                :pullup-config="pullup_config"
                ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
                @on-pulldown-loading="loadPage(0)">
        <div>
          <!--begin效果图-->
          <div>
            <!--无数据时，底部的内容隐藏-->
            <!--<transition-page :options="promptDiagram"></transition-page>-->
          </div>
          <!--end效果图-->
          <!-- 机构 按钮-->
          <cell v-for="(x,index) in orgs" :key="index" :title="x.orgName" value="" is-link @click.native="jumpOrgView(x.orgCode)"></cell>
          <!--  通信录列表 -->
          <div class="vux-reddot-s" v-for="x in communicateList">
            <communicate-cell :data="x"></communicate-cell>
          </div>
        </div>
      </scroller>
    </group>
  </div>
</template>

<style lang="less" scoped>
  .orgInfo {
    line-height: 40px;
    padding: 0 15px;
    background-color: #f2f2f2;
    /*border-bottom: 1px solid #ccc;*/
    > p {
      width: 70px;
      display: inline-block;
    }
    a {
      margin-left: 5px;
    }
  }
  .orgUserPage .xs-container:after {
    content: " ";
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    left: 0px;
  }
  .lTitlePart{
    font-size: 13px;
    font-family: "幼圆";
  }
</style>

<script>

  import {
    Scroller,
    Cell,
    Group,
    XInput
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { appUrl } from '../../utils/common'
  import CommunicateCell from './../mycomponents/UserListChild'
  import TransitionPage from './../mycomponents/TransitionPage'

  const URL_REUEST = `${appUrl}/app/communicate/getOrgUsersByOrgCode/`

  Vue.use(VueResource)

  export default {
    // 组件
    components: {
      CommunicateCell,
      Cell,
      Group,
      Scroller,
      TransitionPage,
      XInput
    },
    // 数据模型
    data() {
      return {
        scrollH: '-68',
        id: this.$router.history.current.params.orgCode,
        orgItem: '',
        orgs: [],
        communicateList: [{ name: '李杰', headship: '市长秘书', mobile: '13878956325' }],
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
        //        判断头部是否隐藏,假如不隐藏
        if (vm.$store.state.projectType === 'mini') {
          vm.scrollH = '-86'
        }
        // 加载数据
        vm.init()
      })
    },
    watch: {
      $route(to, from) {
        if (to.name === from.name) {
          this.init()
        }
      }
    },
    // 方法
    methods: {
      linkTo(mobile) {
        if (!mobile) {
          alert('没有联系方式')
        }
        return false
      },
      isOrgEntity(value) {
        if (value === '1') {
          return true
        }
        return false
      },
      /**
       * 加载数据
       * @param pageIndex 页数
       * @param reload 是否重新加载
       */
      init() {
        this.id = this.$router.history.current.params.orgCode
        this.loadPage(0)
      },
      loadPage(pageIndex) {
//        let that = this
        // 如果是第一页，则重置页面列表
        if (pageIndex === 0) {
          this.pageIndex = 0
          this.orgs = []
          this.communicateList = []
        }
        const url = URL_REUEST + this.id
        this.$http.get(url).then(function (res) {
          const code = res.body.code
          if (code === 200) {
            this.communicateList = []
            this.orgs = []
            Array.from(res.body.response.list, x => this.communicateList.push(x))
            Array.from(res.body.response.orgs, x => this.orgs.push(x))
            if (this.communicateList.length > 0 || this.orgs.length > 0) {
              this.promptDiagram.show = false // 关闭效果图
            } else if (this.orgs.length <= 0 && this.communicateList.length <= 0) {
              // 添加加载效果图
              this.promptDiagram.show = true // 开启效果图
              this.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png')
              this.promptDiagram.content = '该机构暂时没有人员！'
//              this.$refs.scroll1.disablePullup() // 没有数据后禁止上拉事件以免向后退发请求
            } else if (this.communicateList.length < 10) {
              this.$refs.scroll1.disablePullup()
            }

            this.orgItem = res.body.response.orgItem
            if (this.orgItem.tel) {
              this.orgItem.tel = this.orgItem.tel.split(',')
            }
            if (this.orgItem.fax) {
              this.orgItem.fax = this.orgItem.fax.split(',')
            }
          }
          this.$refs.scroll1.donePullup()
          this.$refs.scroll1.donePulldown()
          this.$nextTick(() => {
            // $refs.scrollerEvent.reset({top:0})
            this.$refs.scroll1.reset({ top: 0 })
          })
        })
      },
      jumpOrgView(orgCode) {
        const r = `/communicate/CommunicateOrgUser/${orgCode}`
        this.$router.push(r)
        this.id = orgCode
        this.loadPage(0)
      }
    }
  }
</script>
