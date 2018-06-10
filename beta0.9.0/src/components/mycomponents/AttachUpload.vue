<!-- 附件上传组件  接收配置参数  更改组件引用页面的附件ID -->
<template>
  <div>
    <ul class="img-box clearfix weui_uploader_bd weui_uploader_files">
      <li class="weui_uploader_file" v-if="canUpload">
        <a class="add-btn gs-add2" @click="addFile">
        </a>
      </li>
      <li v-for="(image,index) in images"
          @click="expandBig(index)"
          class="weui_uploader_file">
        <img :src="image.attachPath | serverAttachPath">
        <a v-if="canUpload" @click.stop="deleteAttach(image.id)" class="deleteImg">
          <img src="../../assets/image/weixin/eventInfo/delete_img.png" />
        </a>
      </li>
      <li v-for="(video,index) in videos" class="weui_uploader_file">
        <div class="video-content">
          <div class="video-icon" @click="showVideo(video)">
            <i class="gs-play_arrow"></i>
          </div>
        </div>
        <a v-if="canUpload" @click.stop="deleteAttach(video.id)" class="deleteImg">
          <img src="../../assets/image/weixin/eventInfo/delete_img.png" />
        </a>
      </li>
      <li v-for="(otherFile,index) in otherFiles"
          @click="showOtherFile(otherFile)"
          class="weui_uploader_file file-li">
        <div class="file-content">
          <i :class="getFileIconCss(otherFile.suffix)"></i>
          <p class="file-name-line">{{otherFile.name}}</p>
        </div>
        <a v-if="canUpload" @click.stop="deleteAttach(otherFile.id)" class="deleteImg">
          <img src="../../assets/image/weixin/eventInfo/delete_img.png" />
        </a>
      </li>
    </ul>
    <popup v-show="fileShow" class="addPop">
      <div @click="chooseImg">上传图片</div>
      <div @click="chooseVideo" v-if="showAudioPart">上传视频</div>
      <div @click="chooseOtherFile" v-if="showAudioPart">上传文件</div>
      <div @click="cancel">取消</div>
    </popup>
  </div>
</template>
<style lang="less" scoped>
  @import '../../styles/weui-upload.less';
  .img-box {
    margin: 0 !important;
  }
  .addPop.vux-popup-dialog {
    background: #e2e2e2;
    > div {
      line-height: 40px;
      border-bottom: 1px solid #e2e2e2;
      text-align: center;
      background: #fff;
    }
    > div:nth-last-child(1) {
      border-bottom: none;
      margin-top: 5px;
    }
  }
  div.gs-add_a_photo {
    width: 70px;
    height: 70px;
    border: 1px solid #e8e8e8;
    position: relative;
  }
  .video-content{
    height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .video-icon{
    width: 80%;
    height: 80%;
    background: #ddd;
    border-radius: 50%;
    margin-top: 11%;
    font-size: 40px;
    text-align: center;
    color: #666;
  }
  div.gs-add_a_photo:before {
    font-size: 3em;
    position: absolute;
    color: #8e8e8e;
    top: 2px;
    left: 9px;
  }
  div.gs-add_a_photo::after {
    content: '\4E0A\4F20\56FE\7247';
    color: #8e8e8e;
    position: absolute;
    font-size: 0.7em;
    left: 1em;
    bottom: 0.5em;
  }
  .add-btn {
    width: 70px;
    height: 70px;
    display: inline-block;
    border: 1px solid #ccc;
    color: #ccc;
    font-size: 67px;
    font-weight: 100;
    margin: 0;
  }

  .file-li{
    border: 1px solid #ccc;
    .file-content{
      text-align: center;
      padding-top: 20%;
      i{
        font-size: 32px;
      }

      .file-name-line{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 22px;
      }
    }
  }
</style>
<script>
  import { Popup } from 'vux'
  import { fileserver } from '../../utils/common'

  export default {
    name: 'AttachUpload',
    props: {
      attachs: { // 附件数组 包含视频、音频以及其他附件
        type: Array,
        default() {
          return []
        }
      },
      canUpload: { // 是否显示上传按钮
        type: Boolean,
        default: true
      },
      maxFileSize: { // 最大的文件大小 单位--M
        type: Number,
        default: 10
      },
      maxFileNum: { // 最大的文件上传数 单位--个
        type: Number,
        default: 5
      }
    },
    components: {
      Popup
    },
    data() {
      return {
        videoPath: '',
        fileShow: false
      }
    },
    computed: {
      showAudioPart() {
        return this.$store.state.projectType === 'app'
      },
      images() { // 图片文件对象
        const images = []
        if (this.attachs && this.attachs.length) {
          this.attachs.forEach((attach) => {
            if (attach.attachType === 'img') {
              images.push(attach)
            }
          })
        }
        return images
      },
      videos() { // 视频文件对象
        const videos = []
        if (this.attachs && this.attachs.length) {
          this.attachs.forEach((attach) => {
            if (attach.attachType === 'video') {
              videos.push(attach)
            }
          })
        }
        return videos
      },
      otherFiles() { // 其他文件对象
        const otherFiles = []
        if (this.attachs && this.attachs.length) {
          this.fileTitle = '附件信息'
          this.attachs.forEach((attach) => {
            if (attach.attachType === 'other') {
              otherFiles.push(attach)
            }
          })
        }
        return otherFiles
      },
      attachsNum() { // 文件个数
        return this.attachs.length
      },
      attachId() { // 文件IDS
        const attachId = []
        if (this.attachs && this.attachs.length) {
          this.attachs.forEach((attach) => {
            attachId.push(attach.id)
          })
        }
        return attachId
      }
    },
    filters: {
      serverAttachPath(item) {
        return fileserver + item
      }
    },
    methods: {
      addFile() {
        this.fileShow = true
      },
      cancel() {
        this.fileShow = false
      },
      chooseImg() { // 选择图片上传
        if (this.attachsNum < parseInt(this.maxFileNum, 10)) {
          const options = {}
          this.$gsafety.chooseImage(options, (res) => {
            if (res) {
              if (this.$store.state.projectType === 'mini') {
                this.$vux.loading.show({
                  text: 'Loading'
                })
              }
              const localImgUrl = res.url  // 安卓那边返回图片路径
              let imgSrc
              if (localImgUrl.indexOf('storage') > -1) {
                const start = localImgUrl.indexOf('storage')
                imgSrc = localImgUrl.substring(start + 7, localImgUrl.length)
              } else {
                imgSrc = localImgUrl
              }
              const jsonObj = { localId: imgSrc }
              this.$gsafety.uploadImage(jsonObj, (ress) => {
                if (ress.id) {
                  const image = {
                    id: ress.id, // 安卓那边返回图片数据库里面的id
                    attachType: 'img',
                    attachPath: ress.attachPath
                  }
                  this.attachs.push(image)
                  this.actionSuccess()
                  this.actionSuccesslocal()
                  this.$vux.loading.hide()
                  this.$vux.toast.text('图片上传成功', 'middle')
                } else {
                  this.$vux.loading.hide()
                  this.$vux.toast.text('上传图片失败', 'middle')
                }
              })
            }
          })
          this.fileShow = false
        } else {
          alert(`最多只能上传${this.maxFileNum}个附件`)
          this.fileShow = false
        }
      },
      chooseVideo() {
        if (this.attachsNum < parseInt(this.maxFileNum, 10)) {
          if (this.$store.state.projectType === 'mini') {
            this.$vux.loading.show({
              text: 'Loading'
            })
          }
          this.$gsafety.startVideo(
            (res) => {
              this.attachs.push(res)
              this.actionSuccess()
              this.$vux.loading.hide()
              this.$vux.toast.text('视频上传成功', 'middle')
            },
            // 取消
            () => {
              this.$vux.loading.hide()
            }
          )
          this.fileShow = false
        } else {
          alert(`最多只能上传${this.maxFileNum}个附件`)
          this.fileShow = false
        }
      },
//      chooseAudio() {  // 点击录制音频
//        const that = this
//        that.$vux.loading.show({
//          text: 'Loading'
//        })
//        this.$gsafety.startVoice(
//          (res) => {
//            that.audios.push(res)
//            that.$vux.loading.hide()
//          },
//          // 取消
//          () => {
//            that.$vux.loading.hide()
//          }
//        )
//      },
      chooseOtherFile() {
        if (this.attachsNum < parseInt(this.maxFileNum, 10)) {
          this.$gsafety.chooseFile((res) => {
            if (res) {
              if (res.size && res.size > this.maxFileSize) {
                this.$vux.toast.show({
                  text: '文件大小过大!'
                })
                return false
              }
              this.$vux.loading.show({
                text: 'Loading'
              })
              const attachTotalUrl = res.url
              let attachUrl
              if (attachTotalUrl.indexOf('storage') > -1) {
                const start = attachTotalUrl.indexOf('storage')
                attachUrl = attachTotalUrl.substring(start + 7, attachTotalUrl.length)
              } else {
                attachUrl = attachTotalUrl
              }
              const jsonObj = { localId: attachUrl }
              this.$gsafety.uploadFile(jsonObj, (ress) => {
                if (ress.id) {
                  const otherAttach = {
                    id: ress.id, // 安卓那边返回文件数据库里面的id
                    name: ress.name, // 文件名
                    attachType: 'other',
                    attachPath: ress.attachPath // 安卓那边返回文件服务端路径
                  }
                  this.attachs.push(otherAttach)
                  this.actionSuccess()
                  this.$vux.loading.hide()
                  this.$vux.toast.text('文件上传成功', 'middle')
                } else {
                  this.$vux.loading.hide()
                  this.$vux.toast.text('上传文件失败', 'middle')
                }
              })
            }
            return false
          })
          this.fileShow = false
        } else {
          alert(`最多只能上传${this.maxFileNum}个文件`)
          this.fileShow = false
        }
      },
      expandBig(index) { // 放大查看图片
        this.$store.commit('setBigSrc', this.images)
        // 进入小程序的时候
        // this.images 图片数组
        if (this.$store.state.projectType === 'mini') {
          // 第一个参数是当前图片的路径，第二个参数是一个数组、
          const imgsArr = Object.values(this.images)
          const imgsPath = []
          imgsArr.forEach((val) => {
            // val.attachPath
            imgsPath.push(location.origin + this.getAttachPath(val.attachPath))
          })
          this.$gsafety.previewImage(
            imgsPath[index],
            imgsPath
          )
          return
        }
        this.$router.push(`/instruct/bigImg/${index}`)
      },
      showVideo(video) { // 新页面操作视频附件
        if (this.$store.state.projectType === 'mini') {
          this.$gsafety.navigateTo('../fileView/fileView', {
            param: video
          }, () => {})
        } else {
          this.$router.push({
            name: 'AttachView',
            params: {
              attach: video
            }
          })
        }
      },
      showOtherFile(file) { // 新页面操作文件附件
        if (this.$store.state.projectType === 'mini') {
          this.$gsafety.navigateTo('../fileView/fileView', {
            param: file
          }, () => {})
        } else {
          this.$router.push({
            name: 'AttachView',
            params: {
              attach: file
            }
          })
        }
      },
//      playVideo(video) { // 播放视频
//        if (this.$store.state.projectType === 'mini') {
//          this.videoPath = video.attachPath
//          this.$store.commit('setVideo', this.videoPath)
//          this.$router.push('/instruct/playVideo')
//          return
//        }
//        const videoObj = {
//          id: video.id,
//          attachType: 'video',
//          path: video.attachPath
//        }
//        this.$gsafety.playVideo(videoObj)
//      },
//      openFile(file) {
//        if (this.$store.state.projectType === 'mini') {
//          this.$vux.toast.text('小程序不支持非音视频附件下载', 'middle')
//        }
//        const attachUrl = file.attachPath
//        this.$gsafety.openFile({
//          localId: attachUrl
//        })
//      },
      getFileIconCss(suffix) {
        switch (suffix) {
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
      },
      getAttachPath(item) {
        return fileserver + item
      },
      deleteAttach(id) {
        this.attachs.forEach((attach, index) => {
          if (attach.id === id) {
            this.attachs.splice(index, 1)
          }
        })
        this.actionSuccess()
      },
      actionSuccess() { // 上传或者删除附件成功
        this.$emit('on-action-success', this.attachId)
      },
      actionSuccesslocal() { // 上传或者删除附件成功
        this.$emit('on-local-success', this.attachId, this.attachs)
      }
    }
  }
</script>
