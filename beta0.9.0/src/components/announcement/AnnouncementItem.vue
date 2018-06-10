<template>
  <div class="main">
    <scroller :height="scrollH" lock-x scrollbar-y use-pullup
              :pullup-config="pullup_config"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0, true)" @on-pullup-loading="loadPage(page,false)">
      <div>
        <!--begin效果图-->
        <div v-show="instructList.length == 0">
          <transition-page :options="promptDiagram"></transition-page>
        </div>
        <div :class="isOwnSendCss(x, userId)" v-for="(x,index) in instructList" :key="index">
          <announcement-sign
            @on-info-click="relInfo"
            @on-callback-click="toBack"
            @on-select-click="toDetail"
            :checked="x"
            :userId="userId">、
          </announcement-sign>
        </div>
      </div>
    </scroller>
  </div>
</template>
<style lang="less" scoped>
  @import "../../styles/common.less";
  .telPhone {
    margin-left: 1em;
  }
  .creatName {
    float: left;
    margin-left: 0.4em;
    font-size: 1.2em;
    color: #34669c;
  }
  .vux-popup-dialog {
    height: 100% !important;
  }
  .head {
    color: #fff;
    background-color: #0094ff;
    text-align: center;
    font-weight: 700;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  .actBtn {
    text-align: right;
    margin-top: 1em;
  }
  .actBtn button.weui-btn,.actBtn input.weui-btn {
    width: 25%;
    display: inline-block;
    height: 2em;
    line-height: 2em;
    font-size: 1em;
  }
  .backAct {
    margin-left: 0.4em;
  }
  .isBack {
    margin-left: 0.5em;
    color:#34669c;
  }
  .instr-cell {
    position: relative;
    border-bottom: 1px solid #e2e2e2;
    margin: 0px 0;
    padding: 2px 15px;
    background: #fff;
  }
  .ownSend {
    position: relative;
    border-bottom: 1px solid #e2e2e2;
    margin: 0px 0;
    padding: 2px 15px;
    background: #fff;
  }

  .unread:before{
    content: '';
    display: block;
    position: absolute;
    width: 10px;
    height: 10px;
    left: 3px;
    top: 10px;
    border-radius: 50%;
    background: #d43e2f;
  }

  .instr-content {
    margin: 5px 10px;
    font-weight: bold;
    position: relative;
  }
  .infoBack {
    position: relative;
  }
  .isBack {
    position: relative;
  }
  .rel-info {
    position: relative;
  }
  .leader-info {
    text-align: right;
    margin-right: 20px;

  }

  .rel-info {
    display: block;

  }

  .i-release {
    color: #454545;
    margin: 0 20px 0 6px;
  }

  .release {
    color: #03A9F4;
    font-size: 14px;
  }
</style>
<script>
  // 导入页面所需的标签
  import {
    Scroller
  } from 'vux'
  import { siteUrl } from '../../utils/common'
  import TransitionPage from './../mycomponents/TransitionPage'
  // import watchPopup from './watchPopup'
  import AnnouncementSign from './AnnouncementSign'


  export default {
    name: 'InstructItem',
    props: ['data', 'scrollH'],
    data() {
      return {
        objPop: {},
        tel: 15623544711,
        backContent: '',
        watchObj: {},
//      加载小飞机
        beginPic: true,
        news: {},
        page: 0,
        size: 10,
        instructList: [],
        handleMessage: '',
        url: '',
        p1: '1',
        checkMessage: '',
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
        imgsrc: require('assets/image/img-05NotExist.png'),
        promptDiagram: {
          show: false,
          imgUrl: '',
          content: '',
          myColor: {
            type: String,
            default: '#e45050'
          }
        }
      }
    },
    components: {
      Scroller,
      TransitionPage,
      // watchPopup,
      AnnouncementSign
    },
    created() {
    },
    methods: {
      call() {
        window.location.href = `tel:${this.tel}`
      },
      toBack(obj) {
        this.$refs.popShow.showPop(obj.transactContent)
        const data = {
          infoId: obj.infoId,
          transactId: obj.transactId
        }
        this.objPop.watchObj = data
      },
      isOwnSendCss(x, userId) {
        let classNam
        if (x.disposePersonId === userId) {
          classNam = 'ownSend'
          // classNam = 'instr-cell'
        } else {
          classNam = 'instr-cell'
        }

        if (x.unReadStatus === 'UNREAD') {
          classNam += ' unread'
        }
        return classNam
      },
      loadPage(page, reload) {
        const that = this
        if (reload) {
          this.page = 0
          this.instructList = []
        }
        const URL = `${siteUrl}/eventdispose/listnotice?page=${this.page}&size=${this.size}`
        this.$http.get(URL).then((res) => {
          if (res.body.code === 200) {
            this.$store.dispatch('hidePageLoading')
            const resData = res.body.response.content
            const userId = that.$store.state.user.id
            if (page === 0) {
              this.page = 0
              this.instructList = []
              // 添加加载效果图
              this.promptDiagram.show = true // 开启效果图
              this.promptDiagram.imgUrl = require('assets/image/loading.gif')
              this.promptDiagram.content = ''
            }
            if (resData.length > 0) {
              if (resData) {
                const vlaueArr = Object.values(resData)
                that.instructList = that.instructList.concat(vlaueArr)
                that.userId = userId
              }
              if (resData.length <= this.size) {
                this.page += 1
              }
            }
          }

          if (that.instructList.length === 0) {
            that.promptDiagram.show = false
            that.promptDiagram.show = true
            that.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png')
            that.promptDiagram.content = '暂无数据'
          }

          this.$refs.scroll1.donePullup()
          this.$refs.scroll1.donePulldown()
          that.$nextTick(() => {
            this.$refs.scroll1.reset()
          })
        })
      },
      relInfo(id) {
        const r = `/announcement/view/${id}`
        this.$router.push(r)
      },
      /*
        尝试执行一个签收动作
       */
      select(id, status, isSign) {
        const that = this
        if (isSign === '1' && status === '0') {
          // 签收
          const url = `${siteUrl}/eventdispose/${id}/signDispose`
          this.$http.get(url).then((res) => {
            if (res.body.code === 200) {
              that.$vux.toast.text('签收成功', 'middle')
            }
          })
        }
        const r = `/announcement/view/${id}`
        this.$router.push(r)
      },
      // 进入详情页面
      async toDetail(id) {
        const url = `${siteUrl}/eventInfo/markreadByType`
        await this.axios.post(url, {
          menuType: 'notice',
          disposeId: id
        })
        const r = `/announcement/view/${id}`
        this.$router.push(r)
      }
    }
  }
</script>
