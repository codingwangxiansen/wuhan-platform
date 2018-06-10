<template>
  <!-- 测试视频组件 -->
  <div>
    <div class="container" v-if="videoMask">
      <video-player  class="video-player-box"
                     ref="videoPlayer"
                     @click.native="closeVideoMask"
                     :options="playerOptions"
                     :playsinline="true"
                     customEventName="customstatechangedeventname"
                     @play="onPlayerPlay($event)"
                     @pause="onPlayerPause($event)"
                     @statechanged="playerStateChanged($event)"
                     @ready="playerReadied">
      </video-player>
      <span class="closeVideo"  @click="closeVideoMask">[关闭]</span>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'

  import 'vue-video-player/src/custom-theme.css'
  import VueVideoPlayer from 'vue-video-player'

  import { fileserver } from './../../utils/common'

  Vue.use(VueVideoPlayer)

  export default {
    data() {
      return {
        // 测试视频
        videoMask: false,
        playerOptions: {
          // videojs options
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: 'video/mp4',
            src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
          }],
          poster: "'/static/images/author.jpg"
        }
      }
    },
    components: {
      VueVideoPlayer
    },
    watch: {
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.playerOptions.sources[0].src = location.origin +
          vm.getAttachPath(vm.$store.state.VideoSrc)
        vm.videoMask = true
        console.log(vm.playerOptions.sources[0].src)
      })
    },
    methods: {
      // 测试测试
      // 关闭
      closeVideoMask() {
        this.videoMask = false
        this.onPlayerPause()
        this.$router.go(-1)
      },
      // listen event
      onPlayerPlay(player) {
        console.log('player play!', player)
        // console.log(this.playerOptions.sources[0].src)
        this.videoMask = true
      },
      onPlayerPause(player) {
        console.log('player pause!', player)
      },
      // ...player event

      // or listen state event
      playerStateChanged(playerCurrentState) {
        console.log('player current update state', playerCurrentState)
      },
      // player is ready
      playerReadied(player) {
        console.log(this.playerOptions.sources.src)
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      },
      playVideo(video) {
        this.videoMask = true
        console.log(video)
        console.log('我开始播放了')
        // location.origin + that.getAttachPath(val.attachPath)
      },
      getAttachPath(item) {
        return fileserver + item
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #000;
    top: 0;
    bottom: 0;
    z-index: 99999;
    .closeVideo {
      position: absolute;
      z-index: 100000;
      top: 0;
      color: #fff;
    }
  }
  .video-player-box {
    height: 100% !important;
  }
</style>
