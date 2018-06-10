<template>
  <div class="transInfo">
    <!--用户审核-->
    <div class="checkUser">
      审核注册用户
    </div>
    <scroller class="scroll" v-show="mainContent" height="-10" lock-x scrollbar-y use-pullup
              :pullup-config="pullup_config"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0, true)" @on-pullup-loading="loadPage(page,false)" >
      <transition-page :options="promptDiagram"></transition-page>
      <box gap="10px 10px" class="chunk">
        <!-- v-for="(item,index) in list" :key="index"-->
        <usercheck-cell @on-info-click="checked" :checked="list" btnName="审核"></usercheck-cell>
      </box>
    </scroller>
    <popup v-model="showSelector" height="40%">
      <div class="head">
        确定审核通过？
      </div>
      <x-input v-model="inputMsg"></x-input>
      <x-button type="theme" @click.native="onComfim">通过</x-button>
      <x-button type="warn" @click.native="onConcel">不通过</x-button>
      <x-button type="default" @click.native="HandleCancel">取消</x-button>
    </popup>
    <div class="loading" v-show="Loaded">
      <img src="../../assets/image/eventInfo/index/loading.gif" alt="">
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "../../styles/common.less";
  .weui-cell {
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background: #fff;
    margin: 10px;
    border: 1px solid #e2e2e2;
  }

  .head {
    text-align: center;
    line-height: 3em;
    font-size: 1.2em;
    color: #7d7d75;
  }
  .weui-cell:before {
    right: 15px;
  }
  .scroll {
    margin-top: 1em;
  }
  .loading {
    height: 46em;
    position: relative;
    background: #fff;
    overflow: hidden;
  }
  .loading img {
    width: 83%;
    margin: 0em auto;
    display: block;
  }

  .chunk {
    transition: all 0.5s;
    margin-bottom: 1em;
  }
  .chunk:hover {
    box-shadow: 4px 6px 5px 1px rgba(33,33,33,.3);
  }
  .checkUser {
    color: #c0c0c0;
    line-height: 2.5em;
    padding-left: 1em;
    margin-left: 10px;
    margin-right: 10px;
    position: absolute;
    z-index: 99;
    width: 91%;
    top: 0;
  }
</style>
<script>
  import { Cell, Scroller, XButton, Flexbox, FlexboxItem, Group, XTextarea, Box, Popup, XInput, ConfirmPlugin } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../utils/common'
  import UsercheckCell from '../inforeport/commoncompents/UsercheckCell'
  import TransitionPage from '../mycomponents/TransitionPage'

  Vue.use(VueResource)

  Vue.use(ConfirmPlugin)


  export default {
    props: ['popMsg'],
    // 组件
    components: {
      Flexbox,
      FlexboxItem,
      Cell,
      Scroller,
      XButton,
      Group,
      XTextarea,
      Box,
      Popup,
      XInput,
      ConfirmPlugin,
      UsercheckCell,
      TransitionPage
    },
    // 数据模型
    data() {
      return {
        transId: '',
        inputMsg: '',
        showSelector: false,
        userUnit: '',
        userName: '',
        userMobile: '',
        userTel: '',
        page: 0,
        list: [],
        size: 10,
        imgsrc: require('assets/image/img-05NotExist.png'),
        pullup_config: {
          content: '',
          downContent: '数据加载中...',
          upContent: '',
          loadingContent: '数据加载中...',
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
        },
        Loaded: false,
        mainContent: false,
        infos: {},
        inputValue: ''
      }
    },
    created() {
      this.Loaded = true
    },
    mounted() {
      this.loadPage(0, true)
    },
    // 方法
    methods: {
      onConcel() {
        const that = this
        const URL = `${siteUrl}/basregisterlist/applyFail/${this.transId}?applyMsg=${this.inputMsg}`
        that.axios.get(URL)
          .then((res) => {
            that.$vux.toast.text(res.data.response, 'middle')
            this.showSelector = false
          })
          .catch(() => {
            console.log('error')
          })
      },
    //  通过

      onComfim() {
        const that = this
        const URL = `${siteUrl}/basregisterlist/applySuccess/${this.transId}`
        that.axios.get(URL)
          .then((res) => {
            that.$vux.toast.text(res.data.response, 'middle')
            this.showSelector = false
          })
          .catch(() => {
            console.log('error')
          })
      },
      HandleCancel() {
        this.showSelector = false
      },
//        用户审核
      checked(id) {
//          console.log('审核');
        this.showSelector = true
        this.transId = id
      },
      loadPage(page, reload) {
        const that = this
        if (reload) {
          this.page = 0
        }
        if (this.page === 0) {
          this.page = 0
          this.list = []
        }
        const URL = `${siteUrl}/basregisterlist/applyList?page=${page}&size=${this.size}`
        that.axios.post(URL)
          .then((res) => {
            if (res.data.code === 200) {
              this.Loaded = false
              this.mainContent = true
              const resData = res.data.response.content
              if (resData.length > 0) {
                that.promptDiagram.show = false
                that.$refs.scroll1.enablePullup()
                const value = Object.values(resData)
                that.list = that.list.concat(value)
                for (let i = 0; i < that.list.length; i += 1) {
                  that.list[i].OrgName = that.list[i].userOrgName
                  that.list[i].Name = that.list[i].userName
                  that.list[i].userCellPhone = that.list[i].userCellPhone
                  that.list[i].userTel = that.list[i].userTel
                }

                if (resData.length <= this.size) {
                  this.page += 1
                }
              } else if (that.list.length <= 0) {
                that.promptDiagram.show = true
                that.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png')
                that.promptDiagram.content = '暂无数据'
              } else if (that.list.length < 10) {
                that.$refs.scroll1.disablePullup()
              }
            }
            that.$refs.scroll1.donePullup()
            that.$refs.scroll1.donePulldown()
            that.$nextTick(() => { that.$refs.scroll1.reset() })
          })
          .catch(() => {
            console.log('error')
          })
      }
    }
  }
</script>
