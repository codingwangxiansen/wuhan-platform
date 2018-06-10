<template>
  <div class="SwiperMask" @click="bigHide">
    <swiper :options="swiperOptionA" ref="mySwiper">
      <swiper-slide class="showa" v-for="(img,index) in imgs" :key="index">
        <img :src="getAttachPath(img.attachPath)" alt="">
      </swiper-slide>
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
  </div>
</template>
<style lang="less" scoped>
  .SwiperMask {
    width: 100%;
    height: 100%;
    background-color: #1f1919;
    position: fixed;
    top: 0;
    z-index: 10001;
  }
  /*
  */
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
</style>
<script>
// import config from 'src/config'// 全局配置
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import { fileserver } from './../../../../utils/common'

Vue.use(VueAwesomeSwiper)

export default {
  data() {
    return {
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
      imgs: [],
      imgIndex: ''
    }
  },
  computed: {
    swiper() {
//      获取到轮播组件里面的
      return this.$refs.mySwiper.swiper
    }
  },
  beforeRouteEnter(to, from, next) {
    next(
      (vm) => {
        vm.imgs = vm.$store.state.imgSrc
        vm.imgIndex = vm.$router.history.current.params.index
        document.getElementById('mainView').setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1, user-scalable=yes')
//        调用，每次进入的时候滑到哪个图片上
        vm.swiper.slideTo(vm.imgIndex, 500, false)
      }
    )
  },
  beforeRouteLeave(to, from, next) {
    document.getElementById('mainView').setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=0')
    next()
  },
  methods: {
    getAttachPath(item) {
      return fileserver + item
    },
    bigHide() {
      this.$router.go(-1)
    }
  }
}
</script>
