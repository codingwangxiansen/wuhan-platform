<!-- 信息分享场景	 -->
<template>
  <div class="infoShell">
    <div>
      <group title="信息分享">
        <x-textarea title="" :rows="12" placeholder="请编辑分享内容"  v-model='data.content'></x-textarea>
      </group>
      <box gap="10px 10px" v-show="isMini">
        <x-button type="default" @click.native="show = true">分享</x-button>
        <x-button type="theme" @click.native="$router.go(-1)">取消</x-button>
      </box>
      <div class="mini" v-show="!isMini">暂不支持微信小程序分享</div>
    </div>
    <div v-transfer-dom>
      <popup v-model="show" position="bottom" max-height="50%" class="sharePop">
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
<style lang="less" scoped>
  .infoShell{
    padding-top: 10px;
  }
  .mini {
    text-align: center;
    line-height: 50px;
    color: #444;
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
  .shareFloat{
    float: left;
    text-align: center;
    width: 50%;
  }
  .shareTitle{
    margin-top:0.5rem;
  }
  .sharePop{
    padding: 2rem 0px;
    overflow-y: hidden;
  }
</style>
<script>
  import {
    Group,
    XButton,
    XTextarea,
    Box,
    ConfirmPlugin,
    Popup,
    TransferDom
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'


  // 启用请求组件
  Vue.use(VueResource)
  Vue.use(ConfirmPlugin)

  export default {
    // 数据模型
    data() {
      return {
        // 拟办操作显示
        data: {
          id: '',
          content: ''
        },
        show: false,
//          判断是否是微信小程序
        isMini: true
      }
    },
    directives: {
      TransferDom
    },
    // 组件
    components: {
      Group,
      XButton,
      XTextarea,
      Box,
      Popup
    },
    // vue实例创建后调用
    created() {

    },

    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
          vm.$store.commit('setHeaderTitle', '信息分享及报送') // 设置头部文字
          vm.init()
          console.log('我应该是小程序才对')
          if (vm.$store.state.projectType === 'mini') {
            console.log('this.$store.state.projectType')
            vm.isMini = false
          }
        }
      )
    },

    computed: {

    },

    methods: {
      /*
       *
       */
      init() {
        const that = this
        that.data.id = that.$router.history.current.params.id
        const URL = `${siteUrl}/eventInfo/generateshare/${that.data.id}`
        const datas = that.data
        that.axios.post(URL, datas)
          .then((res) => {
            that.data.content = res.data.response.content
          })
          .catch(() => {
            console.log('error')
          })
      },
      // 分享朋友圈
      shareFriends() {
        // TODO 微信分享审核通过前，给出提示场景
        const options = {
          contentType: 0,
          type: 0,
          webpageUrl: 'https://www.baidu.com',
          title: this.data.content,
          description: this.data.content
        }
        this.$gsafety.weixinFriends(options)
      },
      // 发送短信
      sms() {
        const options = {
          person: [''],
          content: this.data.content
        }
        this.$gsafety.sms(options)
      }
    }
  }
</script>
