<template>
  <div>
    <div class="main-business-header" v-if="headShow">
      <x-header
        v-show="headerOption.showHeader"
        :left-options="headerOption.leftOptions"
        :right-options="headerOption.rightOptions"
        @on-click-more="rightClick">
        <div class="app-header">{{headerOption.title}}</div>
        <a class="header-right-btn"
           @click="rightClick"
           v-show="headerOption.headerRightIcon==='add'"
           slot="right">
          <i class="gs-add2"></i>
        </a>
        <a class="header-right-btn"
           @click="rightClick"
           v-show="headerOption.headerRightIcon==='setting'"
           slot="right">
          <i class="gs-settings"></i>
        </a>
        <a class="header-right-btn"
           @click="rightClick"
           v-show="headerOption.headerRightIcon==='share'"
           slot="right">
          <i class="gs-share-alt"></i>
        </a>
        <a class="header-right-btn"
           @click="rightClick"
           v-show="headerOption.headerRightIcon==='print'"
           slot="right">
          <i class="gs-print"></i>
        </a>
      </x-header>
    </div>

    <div class="main-business-content">
      <page-loading class="loading-progress" :class="{'hideHead' : !headShow}"></page-loading>
      <transition :name="transitionName">
        <keep-alive>
          <router-view class="child-view"
                       :class="headShow ? '' : 'hideHead'"
                       ref="routerVm">
          </router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import "styles/common.less";
  @import "styles/resetCommon.less";
  .main-business-header{
    position: fixed;
    width: 100%;
    top:0;
    z-index: 10000;
  }
  .main-business-content{
    /*margin-top: 46px;*/
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  /* 上面是为了保证滑动的时候不出现抖动情况 */
  .child-view {
    position: absolute;
    z-index: 1;
    left:0;
    top: 48px;
    height: calc(~"100vh - 48px");
    width: 100%;
    transition: all .5s cubic-bezier(.55,0,.1,1);
    background-color: #f2f2f2;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .child-view.hideHead {
    top:0;
    height: 100%;
  }
  /* 当child-view的内容过多时会撑开child-view使得内部能够滚动 */
  .slide-left-enter {
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
    transition-delay: .5s;
    -webkit-transition-delay: .5s;
  }
  .slide-left-leave-active {
    opacity: 1;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
    transition-delay: 0s;
    -webkit-transition-delay: 0s;
  }
  .slide-right-leave-active {
    opacity: 1;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
    transition-delay: 0s;
    -webkit-transition-delay: 0s;
  }
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
    transition-delay: .5s;
    -webkit-transition-delay: .5s;
  }
  .slide-enter-active {
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
  }
  .slide-leave-active {
    -webkit-transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .app-header{
    font-weight: bold;
    letter-spacing: 1px;
  }

  .header-right-btn{
    font-size: 20px;
  }

  .gs-add2{
    font-size: 20px;
  }

  .SwiperMask {
    width: 100%;
    height: 100%;
    background-color: #1f1919;
    position: fixed;
    top: 0;
    z-index: 10001;
  }
  .swiper-slide img {
    width: 100%;
    border-radius: 1rem;
  }

  .SwiperMask {
    .swiper-container {
      /*margin-top: 8em;*/
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      img {
        border-radius: inherit;
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
  .swiper-slide {
    text-align: center;
    font-size: 38px;
    font-weight: 700;
    background-color: #000;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width:100% !important;
  }
  .swiper-button-prev{
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
    line-height: 2rem;
    color: #fff;
    background-color: #4c4c4c;
    background-image:none;
  }
  .swiper-button-next,.swiper-button-prev{
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
    line-height: 2rem;
    color: #fff;
    background-color: #4c4c4c;
    background-image:none;
  }

  .loading-progress {
    margin-top: 45px;
    width: 100%;
    &.hideHead{
      margin-top: 0;
    }
  }
</style>

<script>
  import config from 'src/config'// 全局配置
  import Vue from 'vue'
  import { XHeader, AlertPlugin, ConfirmPlugin, LoadingPlugin, XTextarea, XButton, ToastPlugin } from 'vux'
  import VueAwesomeSwiper from 'vue-awesome-swiper'
  import 'video.js/dist/video-js.css'
  /* eslint import/no-extraneous-dependencies: 0 */
  import 'swiper/dist/css/swiper.css'
  import PageLoading from 'components/gsafetycomponents/PageLoading'
  import { getGsafety, pageUtils } from './utils/common'

  Vue.use(VueAwesomeSwiper)
  Vue.use(AlertPlugin)
  Vue.use(ConfirmPlugin)
  Vue.use(LoadingPlugin)
  Vue.use(ToastPlugin)

  export default {
    data() {
      return {
//          判断头部是否存在
        headShow: true,
        transitionName: '',
        headerOption: this.$store.state.headerOption,
        imgs: [], // 全屏展示的图片
        isShowFullScreenImg: false, // 全屏展示图片
        fileServer: config.fileServer, // 配置文件路径
        swiperOptionA: { // 图片滑动组件配置
          pagination: {
            el: '.swiper-pagination',
            notNextTick: true,
            // swiper configs 所有的配置同swiper官方api配置
            autoplay: 3000,
            // direction : 'vertical',
            effect: 'coverflow',
            grabCursor: true,
            setWrapperSize: true,
            // autoHeight: true,
            // paginationType:"bullets",
            pagination: '.swiper-pagination',
            paginationClickable: true,
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            mousewheelControl: true,
            observeParents: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        allowBack: this.$store.state.allowBack
      }
    },
    watch: {
      // 更新页面所在位置，用于判断是前进页还是后退页
      $route(to, from) {
        if (to && from) {
          const toPath = to.path
          const fromPath = from.path
          let count = parseInt(sessionStorage.getItem('count'), 0)
          // 如果是导航页或者没有初始记录
          if (Number.isNaN(count)) {
            count = 1
            this.transitionName = 'slide-right'
          } else {
            count += 1
            const fromCount = parseInt(sessionStorage.getItem(fromPath), 0)
            const toCount = parseInt(sessionStorage.getItem(toPath), 0)
            if (toCount < fromCount && fromCount < count) {
              this.transitionName = 'slide-left'
              count = toCount
            } else {
              this.transitionName = 'slide-right'
            }
            if (pageUtils.showNav(toPath)) {
              count = 1
            }
          }
          sessionStorage.setItem(toPath, count)
          sessionStorage.setItem('count', count)
        }
      }
    },
    // 所有页面更新都会触发此函数
    updated() {
    },
    mounted() {
      window.onpopstate = () => { // 点击手机回退按钮触发的事件
        if (!this.$store.state.allowBack) { // 如果页面不回退
          history.go(1)
          this.goBackCb()
        }
      }
    },
    created() {
//        初始化头部是存在的
      this.headShow = true

      //      cookie
//      获取问号后面的
      const content = pageUtils.GetRequest().token
      const channel = pageUtils.GetRequest().channel
//      如果有token， 就给原有的usertoken重新赋值
      if (content) {
//        先获取usertoken
        const userToken = pageUtils.getCookie('userToken')
//        删除usertoken
        pageUtils.delCookie('userToken', userToken)
//        再给usertoken重新赋值
        pageUtils.setCookie('userToken', content)
      }
// 有token没有chanel会没有头部， 判断url后面是否带有？+参数 如果存在token值，并且chanel值不是app并且
// channel有值 有channel但是没有赋值，会是string类型 没有channel会是undefined类型
      const enterMini = (channel !== 'app' && channel !== 'undefined') || !channel
      if (content && enterMini) { // 微信小程序应用
        this.headShow = false
//        给全局变量值到时候判断是小程序还是app
        this.$store.commit('setProjectType', 'mini')
        pageUtils.setCookie('token', content)
        Vue.prototype.$gsafety = getGsafety('mini')
        const vm = this
        const c = '/geminirest/miniapp/config'
        const data = {
          url: location.href
        }
        vm.axios.post(c, data)
          .then((response) => {
            if (response.data.code === 200) {
              vm.data = response.data.response
              wx.config({
                debug: vm.data.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，
                // 若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: vm.data.appId, // 必填，公众号的唯一标识
                timestamp: vm.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: vm.data.nonceStr, // 必填，生成签名的随机串
                signature: vm.data.signature, // 必填，签名
                jsApiList: ['chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表
              })
            }
          })
          .catch(() => {
          })
      } else { // 安卓应用
        Vue.prototype.$gsafety = getGsafety('app')
      }
    },
    components: {
      XHeader,
      PageLoading,
      XTextarea,
      XButton
    },
    computed: {
    },
    methods: {
      rightClick() {
        const routerVm = this.$refs.routerVm
        if (typeof routerVm.headerRightClick === 'function') {
          routerVm.headerRightClick()
        }
      },
      hideFullScreenImg() {
        this.isShowFullScreenImg = false
        this.$store.commit('setAllowBack', true)
      },
      showFullScreenImg(imgs) {
        this.imgs = imgs
        this.isShowFullScreenImg = true
        this.$store.commit('setAllowBack', false)
      },
      goBackCb() { // 点击手机返回按钮页面不回退的回调
        this.hideFullScreenImg()
      }
    }
  }
</script>
