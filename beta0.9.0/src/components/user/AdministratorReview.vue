<template>
  <div class="transInfo">
    <!--管理员权限移交-->
    <div class="checkUser">
      管理员权限移交
    </div>
    <scroller class="scroll" v-show="mainContent" height="-10" lock-x scrollbar-y use-pullup
              :pullup-config="pullup_config"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0, true)" @on-pullup-loading="loadPage(page,false)" >
      <transition-page :options="promptDiagram"></transition-page>
      <box gap="10px 10px" class="chunk">
        <!-- v-for="(item,index) in list" :key="index"-->
        <usercheck-cell @on-info-click="checked" :checked="list" btnName="移交"></usercheck-cell>
      </box>
    </scroller>

    <div class="loading" v-show="Loaded">
      <img src="../../assets/image/eventInfo/index/loading.gif" alt="">
    </div>
  </div>
</template>
<style lang="less" scoped>
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
    width: 10%;
    margin: 50% auto 0 auto;
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

  .loading {
    height: 46em;
    position: relative;
    background: #fff;
    overflow: hidden;
  }
  .loading img {
    width: 10%;
    margin: 50% auto 0 auto;
    display: block;
  }
</style>
<script>
  import { Cell, Scroller, XButton, Box, Popup, ConfirmPlugin } from 'vux'
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
      Cell,
      Scroller,
      XButton,
      Box,
      Popup,
      ConfirmPlugin,
      UsercheckCell,
      TransitionPage
    },
    // 数据模型
    data() {
      return {
        userUnit: '',
        userName: '',
        userMobile: '',
        userTel: '',
        page: 0,
        list: [],
        size: 10,
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
//        用户审核
      checked(id) {
        const that = this
        that.$vux.confirm.show({
          title: '是否移交管理员？',
          content: '',
          confirmText: '确定',
          cancelText: '取消',
          onConfirm() {
            const URL = `${siteUrl}/basedata/user/transferUser/${id}`
            that.axios.get(URL)
              .then((res) => {
                console.log(res)
                console.log(that.inputValue)
              })
              .catch((res) => {
                console.log(res)
                console.log('error')
              })
          },
          onCancel() {

          }
        })
      },
      loadPage(page, reload) {
        const that = this
        if (!reload) {
          this.page = page + 1
        }
        if (that.page === 0) {
          this.page = 0
          this.list = []
        }
        const URL = `${siteUrl}/basedata/user/findByCode?page=${that.page}&size=${this.size}`
        that.axios.get(URL)
          .then((res) => {
            const resData = res.data.response.result
            if (res.data.code === 200) {
              that.Loaded = false
              that.mainContent = true
              if (resData.length > 0) {
                that.promptDiagram.show = false
                that.$refs.scroll1.enablePullup()
                const value = Object.values(resData)
                that.list = that.list.concat(value)
                for (let i = 0; i < that.list.length; i += 1) {
                  that.list[i].OrgName = that.list[i].orgName
                  that.list[i].Name = that.list[i].name
                  that.list[i].userCellPhone = that.list[i].phone
                  that.list[i].userTel = that.list[i].tel
                  that.list[i].auditStatus = that.list[i].auditStatus
                }
//            小飞机隐藏
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
