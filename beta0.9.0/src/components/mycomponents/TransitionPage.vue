<template >
  <div v-show="options.show" class="transitionContent">
    <div v-if="isOnline">
      <img :src="options.imgUrl">
      <h3 :style="{color: options.myColor}">{{options.content}}</h3>
    </div>
    <div class="offline-txt" v-else>
      <p>网络加载错误</p>
      <a @click="retryNet">点击刷新页面</a>
    </div>
  </div>
</template>
<style>
  .transitionContent{
    text-align: center;
    height: 668px;
    position: absolute;
    width: 100%;;
    background: #fff;
  }

  .transitionContent img{
    width: 50%;
    margin-top: 100px;
  }

  .offline-txt{
    text-align: center;
    line-height: 30px;
    margin-top: 20%;
  }

  .offline-txt p{
    font-size: 25px;
    color: #bbbbbb;
  }

  .offline-txt a{
    color: #03A9F4;
  }
</style>
<script>
  import { pageController } from '../../utils/common'

  export default{
    name: 'TransitionPage',
    props: ['options'],
    data() {
      return {
        isOnline: true
      }
    },
    created() {
      pageController.initOffline(this.offLineAction)
    },
    methods: {
      offLineAction(offlineStatus) {
        if (offlineStatus) {
          this.isOnline = false
          alert('当前状态为离线状态，请检查网络设置！')
        } else {
          this.isOnline = true
          alert('网络已连接！')
        }
      },
      retryNet() {
        location.reload(true)
      }
    }
  }

</script>
