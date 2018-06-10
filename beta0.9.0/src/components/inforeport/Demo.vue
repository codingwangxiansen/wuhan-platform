<template>
  <div>
    this is demo1
    <!--<div class="hello">-->
    <!--<h1>{{ msg }}</h1>-->
    <!--&lt;!&ndash;管道形式进行过滤，验证条件。&ndash;&gt;-->
    <!--<x-input v-model="tel" v-validate="'required|mobile'" name="mobile" type="text"-->
    <!--placeholder="手机号（必填）"></x-input>-->
    <!--<p v-show="warns.has('mobile')" class="errors">-->
    <!--{{ warns.first('mobile') }}-->
    <!--</p>-->
    <!--&lt;!&ndash;邮箱&ndash;&gt;-->
    <!--<x-input v-validate="'required|email'" name="email" type="text"-->
    <!--placeholder="邮箱（必填）"></x-input>-->
    <!--<p v-show="warns.has('email')" class="errors">-->
    <!--{{ warns.first('email') }}-->
    <!--</p>-->
    <!--&lt;!&ndash;密码&ndash;&gt;-->
    <!--<x-input v-validate="'required|password'" name="password" type="text"-->
    <!--placeholder="密码（必填）"></x-input>-->
    <!--<p v-show="warns.has('password')" class="errors">-->
    <!--{{ warns.first('password') }}-->
    <!--</p>-->
    <!--<x-button @click.native='Submit'>提交验证</x-button>-->
    <!--</div>-->
    <!--<group title="机构树">-->
    <!--<org-check-list v-model="selectOrg" label="接收单位" :maxLength="20"></org-check-list>-->
    <!--</group>-->
    <!--<group title="领导列表">-->
    <!--<radio title="type" v-model="type" :options="['1', '2', '3']" @on-change="changeLeaderType"></radio>-->
    <!--<leader-selector :leaderType='type' v-model="users" label="送审领导" :defaultSelect="defaultSelect"></leader-selector>-->
    <!--</group>-->
    <!--<group title="附件选择">-->
      <!--<img-upload-->
        <!--:localIds="fileOptions.localIds"-->
        <!--:serverIds="fileOptions.serverIds"-->
        <!--:imgMaxSum="fileOptions.imgMaxSum"-->
        <!--@on-choose-img="chooseImg"-->
        <!--@on-delete-img="deleteImg"-->
        <!--@on-choose-video="chooseVideo"-->
        <!--@on-choose-file="chooseOtherFile"></img-upload>-->
      <!--&lt;!&ndash;<image-chooser @image-upload="onImageUploaded"></image-chooser>&ndash;&gt;-->
      <!--&lt;!&ndash;<div v-for="s in sids">{{s}}</div>&ndash;&gt;-->
    <!--</group>-->
    <!--<group title="微信分享">-->
    <!--<x-button type="primary" text="分享给好友" @click.native="weixinFriends"></x-button>-->
    <!--<x-button type="primary" text="分享文本" @click.native="weixinFriendsText"></x-button>-->
    <!--<x-button type="primary" text="微信图片" @click.native="weixinChooseImage2"></x-button>-->
    <!--{{serverId}}-->
    <!--</group>-->
    <!--<group title="视频录制/播放">-->
    <!--<x-button type="primary" text="录制视频" @click.native="recordVideo"></x-button>-->
    <!--<x-button type="primary" text="播放视频" @click.native="playVideo"></x-button>-->
    <!--</group>-->
    <!--&lt;!&ndash;<group title="音频录制/播放">&ndash;&gt;-->
    <!--&lt;!&ndash;<x-button type="primary" text="录制音频" @click.native="startVoice"></x-button>&ndash;&gt;-->
    <!--&lt;!&ndash;<x-button type="primary" text="播放音频" @click.native="playVoice"></x-button>&ndash;&gt;-->
    <!--&lt;!&ndash;</group>&ndash;&gt;-->
    <!--<group title="发送短信">-->
    <!--<x-button type="primary" text="短信" @click.native="sms"></x-button>-->
    <!--</group>-->
    <!--<play-video :videoMask="true"></play-video>-->
    <group title="附件上传" class="fileUpload">
      <attach-upload
        :attachs ="attachs"
      >
      </attach-upload>
    </group>
    <x-button @click.native="amendFile">调用修改文件接口</x-button>
  </div>
</template>

<style lang="less">
  @import "../../styles/common.less";

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .errors {
    color: #f00;
  }
</style>


<script>
  import { Group, XButton, LoadingPlugin, Radio, XInput } from 'vux'
  import Vue from 'vue'
  //  import VueResource from 'vue-resource'
  //  import VueRouter from 'vue-router'

  // import OrgSelector from '../gsafetycomponents/OrgSelector'
  import OrgCheckList from './commoncompents/OrgCheckList'
  import LeaderSelector from '../gsafetycomponents/LeaderSelector'
  import AttachUpload from '../mycomponents/AttachUpload'
  import PlayVideo from '../mycomponents/playVideo'

  Vue.use(LoadingPlugin)

  export default {
    // 数据模型
    data() {
      return {
        // 附件视频上传
        attachs: [],
        tel: '', // 电话号码
        msg: '表单验证',
        selectOrg: [],
        users: ['1516964926673070'],
        type: '1',
        defaultSelect: ['1516964926673070'],
        sids: ['1', '3'],
        fileOptions: {
          localIds: [],
          serverIds: [],
          imgMaxSum: '9'
        },
        serverId: '',
        videoOptions: {
          id: '',
          path: ''
        },
        voiceOptions: {
          id: '',
          path: ''
        }
      }
    },

    // 组件
    components: {
      XInput,
      Group,
      OrgCheckList,
      XButton,
      LoadingPlugin,
      LeaderSelector,
      Radio,
      PlayVideo,
      AttachUpload
    },
    // vue实例创建后调用
    created() {
      alert('我是demo76666')
    },

    // 定义方法区
    methods: {
      amendFile() {
        const fileId = '2018050709465169'
        const localId = '/files/2018/0507/upfile_5f87f28Q6L2l.docx'
        this.$gsafety.amendFile(fileId, localId)
      },
      onImageUploaded(result) {
        this.sids = result
      },
      chooseVideo() {  // 点击录制视频
        alert('9999')
        const that = this
        that.$vux.loading.show({
          text: 'Loading'
        })
        this.$gsafety.startVideo(
          (res) => {
            that.videos.push(res)
            that.saveData('videos', that.videos)
            that.$vux.loading.hide()
          },
          // 取消
          () => {
            that.$vux.loading.hide()
          }
        )
      },
      Submit() {
//        this.$validator.validateAll()
        console.log(this.warns.has('mobile'))
        console.log(999)
//        当前表单是否有任何错误
        console.log(this.warns.any())
//        当前表单的所有错误
        console.log(this.warns.all())
        console.log(this.tel)
        if (this.warns.any()) {
          if (!this.tel) {
            alert('必填项不能为空')
          } else {
            alert('请按格式填写表单')
          }
        }
      },
      changeLeaderType(value, label) {
        this.users = []
        console.log(label)
      },
      chooseImg() { // 上传图片点击上传
        const vm = this
        const options = {}
        vm.$gsafety.chooseImage(options, (res) => {
          if (res) {
            vm.$vux.loading.show({
              text: 'Loading'
            })
            vm.fileOptions.localIds.push(res.url)
            vm.saveData('localIds', vm.fileOptions.localIds)
            const localImgId = res.url
            let imgSrc
            if (localImgId.indexOf('storage') > -1) {
              const start = localImgId.indexOf('storage')
              imgSrc = localImgId.substring(start + 7, localImgId.length)
            } else {
              imgSrc = localImgId
            }
            alert(imgSrc)
            const jsonObj = { localId: imgSrc }
            vm.$gsafety.uploadImage(jsonObj, (ress) => {
              if (ress.id) {
                vm.$vux.loading.hide()
                vm.$vux.toast.text('图片上传成功', 'middle')
              } else {
//                vm.alertShow('上传图片失败')
                vm.$vux.loading.hide()
                vm.$vux.toast.text('上传图片失败', 'middle')
              }
            })
          }
        })
      },
      chooseOtherFile() {  // 上传其他附件点击上传
        const vm = this
        this.$gsafety.chooseFile((res) => {
          if (res) {
            if (res.size && res.size > 1000) {
              vm.$vux.toast.show({
                text: '文件大小过大!'
              })
              return false
            }
            vm.$vux.loading.show({
              text: 'Loading'
            })
            alert(res.url)
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
                vm.$vux.loading.hide()
                vm.$vux.toast.text('文件上传成功', 'middle')
              } else {
                vm.$vux.loading.hide()
                vm.$vux.toast.text('上传文件失败', 'middle')
              }
            })
          }
          return false
        })
      },
      deleteImg(index) { // 删除图片自定义回调事件
        this.fileOptions.localIds.splice(index, 1)
        this.fileOptions.serverIds.splice(index, 1)
      },
      weixinFriends() {
        const options = {
          contentType: 1,
          type: 1,
          webpageUrl: 'https://www.baidu.com',
          title: '分享的标题',
          description: '分享内容描述'
        }
        this.$gsafety.weixinFriends(options)
      },
      weixinFriendsText() {
        const optionsWeixinFriendsText = {
          contentType: 0,
          type: 0,
          webpageUrl: 'https://www.baidu.com',
          title: '分享的文本给朋友',
          description: '分享的文本给朋友'
        }
        this.$gsafety.weixinFriends(optionsWeixinFriendsText)
      },
      //  tt
      weixinChooseImage() {

      },
      weixinChooseImage2() {
        const that = this
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success(res) {
            const localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            console.log(localIds)

            wx.uploadImage({
              localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success(resUploadImage) {
                const serverId = resUploadImage.serverId // 返回图片的服务器端ID
                console.log(serverId)
                alert(serverId)
                that.serverId = serverId
              }
            })
          }
        })
      },
      recordVideo() {
        const that = this
        that.$vux.loading.show({
          text: 'Loading'
        })
        this.$gsafety.startVideo(
          (res) => {
            that.videoOptions.id = res.id
            that.videoOptions.path = res.attachPath
            that.$vux.loading.hide()
          },
          // 取消
          (res) => {
            console.log(res)
            that.$vux.loading.hide()
          }
        )
      },
      playVideo() {
        this.$gsafety.playVideo(this.videoOptions)
      },
      sms() {
        const options = {
          person: ['10086', '10010'],
          content: 'YE'
        }
        this.$gsafety.sms(options)
      },
      // 录制音频
      startVoice() {
        const that = this
        that.$vux.loading.show({
          text: 'Loading'
        })
        // 录制音频
        this.$gsafety.startVoice(
          (res) => {
            that.voiceOptions.id = res.id
            that.voiceOptions.path = res.attachPath
            that.$vux.loading.hide()
          },
          // 取消
          (res) => {
            console.log(res)
            that.$vux.loading.hide()
          }
        )
      },
      // 播放音频
      playVoice() {
        this.$gsafety.playVoice(this.voiceOptions)
      }
    }
  }
</script>
