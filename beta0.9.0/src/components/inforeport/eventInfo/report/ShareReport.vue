<template>
  <div>
    <!-- tab栏-->
    <tab :line-width="2">
      <tab-item active-class="red"
                :selected="currentItem === item.key"
                v-for="(item,index) in taglist"
                :key="index"
                @on-item-click="getData(item.key)">{{item.itemVal}}
      </tab-item>
    </tab>
    <group gutter="0" class="backMsg">
      <div v-if="currentItem === 'TEXT'">
        <x-textarea v-model="content" :rows="10"></x-textarea>
        <button v-if="false" class="msgBtn" @click="backShare">保存</button>
      </div>
      <office-attach
        :type="currentItem"
        :draftId="drafId"
        :infoId="id"
        :attachs="attachs"
        @edit-success="editOfficeSuccess"
        v-if="currentItem !== 'TEXT'"></office-attach>
    </group>
    <!-- 处理过程 -->
    <group title="处理过程" class="backDetail">
      <ul v-for="(item,key) in lists">
        <li>
          <p>
            {{item.comment}}
            <a v-show="item.attachs.indexOf('name') > -1" class="doc-link" @click="showFile(item.attachs)">
              <i :class="getFileIconCss(attachs)"></i>
            </a>
          </p>
          <p class="time">{{item.gmtCreate}}</p>
        </li>
      </ul>
    </group>
    <group class="btnShare">
      <box gap="10px 10px">
        <x-button type="theme" v-if="currentItem=='TEXT'" class="popup-select-btn" @click.native.stop="toSend()">保存并发送</x-button>
        <x-button type="default" v-if="currentItem=='TEXT'" class="popup-select-btn" @click.native.stop="toShare()">分享</x-button>
      </box>
    </group>
    <!-- 发送弹窗-->
    <div>
      <popup v-model="popShow">
        <div class="head">
          <span class="headBtnL" @click="popShow = false">取消</span>
          <div class="headTitle"></div>
          <span class="headBtnR" @click="commit">✔ 确定</span>
        </div>
        <group>
          <cell title="接收人" :value="userNames" @click.native="chooseUser" is-link></cell>
          <x-textarea :rows="10" placeholder="请输入内容" v-model="content"></x-textarea>
        </group>
      </popup>
    </div>
    <!-- 分享面板 -->
    <div v-transfer-dom>
      <popup v-model="share" position="bottom" max-height="50%" class="sharePop">
        <div class="shareFloat" @click="shareFriends">
          <div class="shareIcon">
            <i class="gs-wechat" ></i>
          </div>
          <div class="shareTitle">微信分享</div>
        </div>
        <div class="shareFloat" @click="sms">
          <div class="shareIcon">
            <i class="gs-message" ></i>
          </div>
          <div class="shareTitle">短信分享</div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { Tab, TabItem, XTextarea, Group, XButton, Popup, Cell, TransferDom, Box } from 'vux'
  import OfficeAttach from '../../../mycomponents/OfficeAttach.vue'
  import { siteUrl } from '../../../../utils/common'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Tab,
      TabItem,
      XTextarea,
      Group,
      XButton,
      Popup,
      Cell,
      Box,
      OfficeAttach
    },
    computed: {
      userNames() {
        let leaderList
        if (this.leaderType === '1') {
          leaderList = this.$store.state.groupLeader
        } else if (this.leaderType === '2') {
          leaderList = this.$store.state.cityLeader
        } else {
          leaderList = this.$store.state.allUser
        }
        let text = ''
        const o = this.members[0]
        leaderList.forEach(({ key, value }) => {
          if (key === o) {
            text = value
            if (this.members.length > 1) {
              text = `${text}等${this.members.length}人`
            }
          }
        })
        return text
      },
      members: { // 领导ID数组
        get() {
          return this.$store.state.leaderList
        },
        set() {
        }
      }
    },
    data() {
      return {
        title: '',
        // 当前用户名
        currentUser: '',
        // 页面id
        id: '',
        leaderType: '1',
        isAlert: false, // 是否已经有发送弹窗
        popShow: false,
        taglist: [
          {
            itemVal: '文本文件',
            key: 'TEXT'
          }, {
            itemVal: '报告请示',
            key: 'REPORT'
          }, {
            itemVal: '明码电报',
            key: 'TELEX'
          }, {
            itemVal: '值班快报',
            key: 'BULLETIN'
          }, {
            itemVal: '信息专报',
            key: 'SPECIAL'
          }
        ],
        currentItem: 'TEXT',
        content: '',
        lists: [],
        drafId: '',
        share: false,
        attachs: [], // 附件信息
        loaclAttachPath: '' // wps编辑保存在APP本地的文件路径
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 当前用户
        vm.$store.commit('setHeaderTitle', '呈报上报')
        vm.currentUser = vm.$store.state.user
        vm.id = vm.$route.params.id
        if (from.name === 'LeaderSelect') {
          vm.popShow = true
        } else {
          vm.getData(vm.currentItem)
        }
      })
    },
    beforeRouteLeave(to, from, next) {
      const popupArgs = this.$store.state.popupArgsList
      if (popupArgs.length) {
        const arg = popupArgs[popupArgs.length - 1]
        this[arg] = false
        this.$store.commit('removePopupArg', arg)
        next(false)
      } else {
        next()
      }
    },
    methods: {
      // 下载附件
      downFile(urls) {
        if (this.$store.state.projectType === 'mini') {
          this.$vux.toast.text('小程序不支持非音视频附件下载', 'middle')
        }
        this.$gsafety.openFile({
          localId: urls
        })
      },
      // 分享微信好友
      shareFriends() {
        this.$gsafety.weixinFriends(0, 0, '', this.content, this.content)
      },
      // 发送短信
      sms() {
        const options = {
          person: [''],
          content: this.content
        }
        this.$gsafety.sms(options)
      },
      // 初始化页面的时候请求数据的
      getBaseInfo(type) {
        this.lists = []
        const url = `${siteUrl}/drafts?eventinfoId=${this.id}&type=${type}`
        const that = this
        that.axios.get(url)
          .then((res) => {
            // 不知道到时候返回code是不是errcode
            if (res.data.code === 200) {
              const infos = res.data.response
              // drafId
              that.drafId = infos.id
              that.title = infos.title
              if (this.currentItem === 'TEXT') {
                that.content = infos.description
              }
              that.lists = infos.comments
              if (infos.attachs) {
                that.attachs = JSON.parse(infos.attachs)
              }
            }
          })
          .catch(() => {})
      },
      // 点击最下面分享按钮触发
      backShare() {
      //  这里面是保存修改后的分享 content 编辑分享信息请求的接口
        const url = `${siteUrl}/drafts/${this.drafId}/update`
        const that = this
        const backPush = {
          backPerson: this.currentUser.username,
          backTime: this.getTime(),
          backMessage: '',
          isEdit: true
        }
        // 不知道传过去的参数对不对
        const data = {
          title: that.title,
          description: that.content
        }
        that.$vux.confirm.show({
          title: '确认修改？',
          content: '',
          onConfirm() {
            that.axios.post(url, data)
              .then((res) => {
                if (res.data.code === 200) {
                  that.lists.push(backPush)
                  that.$vux.toast.text('编辑成功', 'middle')
                }
              })
              .catch((res) => {
                that.$vux.toast.text(res.data.message, 'middle')
              })
          }
        })
      },
      // 提交回复内容 弹窗单机确定之后触发
      commit() {
        if (this.currentItem === 'TEXT') {
          const url = `${siteUrl}/drafts/${this.drafId}/comments`
          if (this.members.length < 1) {
            this.$vux.toast.text('请选择接收人', 'middle')
            return
          }
          const data = {
            comment: this.content,
            msgType: 'TEXT', // 回复永远传TEXT type TEXT...
            tousers: this.members
          }
          if (!this.content) {
            this.$vux.toast.text('请输入文本内容！', 'middle')
            return
          }
          const vm = this
          this.$vux.confirm.show({
            title: '确认发送？',
            content: '',
            onConfirm() {
              vm.axios.post(url, data)
                .then((res) => {
                  // 回复成功时
                  if (res.data.code === 200) {
                    vm.$vux.toast.text('发送成功', 'middle')
                    vm.getBaseInfo(vm.currentItem)
                    vm.$vux.confirm.hide()
                    vm.popShow = false
                  } else if (res.data.code === 500) {
                    console.log('发送成功！')
                  }
                })
                .catch(() => {
                  console.log('请求错误')
                })
            }
          })
        } else {
          const jsonObj = { localId: this.loaclAttachPath }
          this.$gsafety.uploadFile(jsonObj, (ress) => {
            if (ress.id) {
              const data = {
                attachId: [ress.id],
                comment: this.content,
                msgType: 'TEXT', // 回复永远传TEXT type TEXT...
                tousers: this.members
              }
              const url = `${siteUrl}/drafts/${this.drafId}/commentWithAttach`
              this.axios.post(url, data)
                .then((res) => {
                  if (res.data.code === 200) {
                    this.$vux.toast.text('编辑成功', 'middle')
                    this.popShow = false
                    this.$store.commit('resetLeaderList')
                    this.getBaseInfo(this.currentItem)
                  } else if (res.data.code === 500) {
                    this.$vux.toast.text('编辑失败', 'middle')
                  }
                })
                .catch(() => {
                  console.log('请求错误')
                })
              this.$vux.toast.text('文件上传成功', 'middle')
            } else {
              this.$vux.toast.text('上传文件失败', 'middle')
            }
          })
        }
      },
      editOfficeSuccess(loaclAttachPath) { // 编辑成功之后的回调
        if (this.isAlert) {
          return
        }
        this.isAlert = true
        const vm = this
        this.$vux.confirm.show({
          title: '是否发送？',
          content: '',
          onConfirm() {
            vm.popShow = true
            vm.loaclAttachPath = loaclAttachPath
            vm.isAlert = false
          },
          onCancel() {
            vm.isAlert = false
          }
        })
      },
      // 选择用户
      chooseUser() {
        this.$router.push({
          name: 'LeaderSelect',
          params: {
            leaderType: '1',
            maxLength: 10
          }
        })
      },
      // 点击下面回复弹窗弹出
      toSend() {
        // 这里是回复历史
        this.popShow = true
      },
      toShare() {
        this.share = true
        this.$store.commit('addPopupArgsList', 'share')
      },
      // 点击tab时切换使用
      getData(item) {
        if (this.currentItem !== item) {
          this.popShow = false
          this.initPopup()
        }
        this.currentItem = item
        this.getBaseInfo(item)
        if (item !== 'TEXT') {
          this.content = ''
        }
      },
      initPopup() {
        this.backContent = ''
        this.$store.commit('setLeaderList', [])
      },
      // 获取当前时间
      getTime() {
        const date = new Date()
        const seperator1 = '-'
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = `0${month}`
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = `0${strDate}`
        }
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        const currentdate = `${year}${seperator1}${month}${seperator1}${strDate} ${hour}:${minute}`
        return currentdate
      },
      showFile(attachs) { // 新页面操作文件附件
        const attachArr = JSON.parse(attachs)
        if (attachArr.length) {
          if (this.$store.state.projectType === 'mini') {
            this.$gsafety.navigateTo('../fileView/fileView', {
              param: attachArr[0]
            }, () => {})
          } else {
            this.$router.push({
              name: 'AttachView',
              params: {
                attach: attachArr[0]
              }
            })
          }
        }
      },
      getFileIconCss(attachs) {
        if (attachs.length) {
          const docSuffix = attachs[0].suffix.toLowerCase()
          switch (docSuffix) {
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
        }
        return ''
      }
    }
  }
</script>
<style lang="less" scoped>
  .downFile {
    position: absolute;
    bottom: 8px;
    left: 15px;
  }
  .head {
    color: #444;
    background-color: #f2f2f2;
    text-align: center;
    font-weight: 500;
    line-height: 45px;
    font-size: 16px;
    z-index: 99;
    span {
      font-size: 14px;
    }
  }
  .headTitle {
    display: inline-block;
  }
  .headBtnL {
    float: left;
    color: #a5a4a4;
    font-weight: normal;
    padding: 0 1em;
  }
  .headBtnR{
    float: right;
    color: #0faaff;
    font-weight: normal;
    padding: 0 1em;
  }
  .backDetail {
    padding-bottom: 120px;
    ul {
      .highLight {
        color: #248bff;
      }
      li {
        padding: 5px 10px;
        .time{
          color: #666666;
          line-height: 24px;
        }

        .doc-link{
          margin-left: 6px;
        }
      }
    }
  }
  .backMsg {
    position: relative;
    .msgBtn {
      position: absolute;
      right: 15px;
      bottom: 5px;
      background: transparent;
      border: 1px solid #999;
      padding: 5px 20px;
      border-radius: 5px;
      outline: none;
    }
    .vux-x-textarea {
      padding-bottom: 30px;
    }
  }
  .btnShare {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .sharePop{
    padding: 2rem 0px;
    overflow-y: hidden;
  }
  .shareFloat{
    float: left;
    text-align: center;
    width: 50%;
  }
  .shareTitle{
    margin-top:0.5rem;
  }
  .shareIcon{
    width: 5rem;
    height: 5rem;
    background-color: lightgreen;
    text-align: center;
    line-height: 5rem;
    font-size: 3rem;
    border-radius: 5rem;
    color: #fff;
    visibility: inherit !important;
    margin: auto;
  }
</style>
