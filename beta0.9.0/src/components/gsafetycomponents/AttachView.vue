
<!-- 附件查看页 支持其他应用打开，下载到本地和分享 -->
<template>
  <div>
    <div class="attach-page">
      <div class="attach-content">
        <div class="attach-icon">
          <i :class="getFileIconCss(attach)"></i>
        </div>
        <p class="attach-name">{{attach.name}}</p>
      </div>
      <div class="attach-btn-group">
        <x-button @click.native="openFileByApp(attach)">其他应用打开</x-button>
        <x-button @click.native="downFile(attach)">保存到本地</x-button>
        <x-button @click.native="weixinFriends(attach)">分享</x-button>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .attach-page{
    height: 100%;
    background: #ffffff;
  }
.attach-content{
  text-align: center;
  padding: 60px 0;
  .attach-icon i{
    font-size: 150px;
  }
  .attach-name{
    line-height: 60px;
    font-size: 22px;
    font-weight: bold;
  }
}

  .attach-btn-group{
    position: absolute;
    width: 100%;
  }
</style>
<script>
  import { XButton } from 'vux'

  export default {
    components: {
      XButton
    },
    name: 'AttachView',
    data() {
      return {
        attach: {}
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.$store.commit('setHeaderTitle', '附件查看')  // 设置头部文字
        vm.attach = vm.$route.params.attach
      })
    },
    methods: {
      getFileIconCss(attach) {
        switch (attach.attachType) {
          case 'img':
            return 'gs-image'
          case 'video':
            return 'gs-file-video'
          case 'other':
            switch (attach.suffix) {
              case 'jpg':
                return 'gs-image'
              case 'txt':
                return 'gs-file'
              case 'pdf':
                return 'gs-file-pdf-o'
              case 'doc':
                return 'gs-file-word-o'
              case 'docx':
                return 'gs-file-word-o'
              default:
                return 'gs-file'
            }
          default:
            return 'gs-file'
        }
      },
      openFileByApp(attach) {
        switch (attach.attachType) {
          case 'video':
            this.playVideo(attach)
            break
          case 'other':
            this.openFile(attach)
            break
          default:
            this.openFile(attach)
            break
        }
      },
      playVideo(video) { // 播放视频
        if (this.$store.state.projectType === 'mini') {
          this.videoPath = video.attachPath
          this.$store.commit('setVideo', this.videoPath)
          this.$router.push('/instruct/playVideo')
          return
        }
        const videoObj = {
          id: video.id,
          attachType: 'video',
          path: video.attachPath
        }
        this.$gsafety.playVideo(videoObj)
      },
      openFile(file) {
        if (this.$store.state.projectType === 'mini') {
          this.$vux.toast.text('小程序不支持非音视频附件下载', 'middle')
          return
        }
        const attachUrl = file.attachPath
        this.$gsafety.openFile({
          localId: attachUrl
        })
      },
      downFile(file) {
        if (this.$store.state.projectType === 'mini') {
          this.$vux.toast.text('小程序暂不支持', 'middle')
          return
        }
        this.$gsafety.downloadFile(file.attachPath)
      },
      weixinFriends(file) {
        if (this.$store.state.projectType === 'mini') {
          this.$vux.toast.text('小程序暂不支持', 'middle')
          return
        }
        const contentType = 1
        const type = 0
        const webpageUrl = file.attachPath
        const title = '武汉市应急管理平台'
        const description = file.name
        this.$gsafety.weixinFriends(contentType, type, webpageUrl, title, description)
      }
    }
  }
</script>
