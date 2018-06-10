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
          <trans-check @on-info-click="relInfo"
                       @on-callback-click="toBack"
                       @on-select-click="select"
                       :checked="x"
                       :userId="userId">
          </trans-check>
        </div>
      </div>
    </scroller>
    <!-- @backChange="doReply"-->
    <watch-popup :popMsg="objPop" ref="popShow"></watch-popup>
  </div>
</template>
<style lang="less" scoped>
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
    border-bottom: 1px solid #e2e2e2;
    margin: 0px 0;
    padding: 2px 15px;
    background: #fff;
    position: relative;
  }
  .ownSend {
    border-bottom: 1px solid #e2e2e2;
    margin: 0px 0;
    padding: 5px 15px;
    background: #fff;
    position: relative;
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
  import { siteUrl } from '../../../../utils/common'
  import TransitionPage from './../../../mycomponents/TransitionPage'
  import watchPopup from './watchPopup'
  import TransCheck from './../instruction/TransCheck'


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
        showV: false,
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
      watchPopup,
      TransCheck
    },
    computed: {
      isHigherAuthorities: {
        get() {
          console.log(this.$store.state.user.typeCode)
          return this.$store.state.user.typeCode
        }
      }
    },
    created() {
      this.id = this.$router.history.current.params.id
      this.loadPage(this.page, true)
    },
    methods: {
      // changeBool
      HandleCancel() {
        this.showV = false
      },
      call() {
        window.location.href = `tel:${this.tel}`
      },
      toBack(obj) {
        this.showV = true
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
      handleCommit() {
        const that = this
        this.showV = false
//        obj  transactId,infoId
        const url = `${siteUrl}/eventInfo/transact/feedbackTransact`
        const data = this.watchObj
        data.opinionContent = that.backContent
        this.$http.post(url, data).then(() => {
          that.backContent = ''
        })
      },
      getData(item) {
        this.checkList = []
        const that = this
        // switch items
        const oldItem = that.currentItem
        that.currentItem = item
        that.changeTab(item)
        if (oldItem !== item) {
          this.attachs = []
          that.attachExist = false
        } else {
          return false
        }
        return false
      },
      changeTab(item) {
        if (item === 'instruInfo') {
          this.showinfo = true
          this.showinstr = false
          this.showDetail = false
        } else if (item === 'instr') {
          this.showinstr = true
          this.showinfo = false
          this.showDetail = false
        } else {
          this.showinstr = false
          this.showinfo = false
          this.showDetail = true
        }
      },
      getInstruInfo(val) {
        const that = this
        const URL = `${siteUrl}${this.$REST.INSTRUCT.VIEW}/${val}`
        this.$http.get(URL).then((response) => {
          if (response.body.code === 200) {
            if (response.body.response) {
              that.isEdit = true
              that.beInfo = response.body.response
              that.instructionId = that.beInfo.id
              that.leaderId = that.beInfo.instructionUserId
            }
          }
        })
      },
      getInstruList(val) {
        const that = this
        const URL = `${siteUrl}${this.$REST.INSTRUCT.LIST}/${val}`
        this.$http.get(URL).then((response) => {
          if (response.body.code === 200) {
            if (response.body.response) {
              that.instList = response.body.response
            }
          }
        })
      },
      getEventBase(val) {
        const that = this
        const URL = `${siteUrl}${this.$REST.EventInfo.VIEW}/${val}`
        this.$http.get(URL).then(function (response) {
          if (response.body.code === 200) {
            that.eventBase = response.body.response
            const dtos = that.eventBase.applyRecordDtos
            if (dtos) {
              const dtosArr = Object.values(dtos)
              that.checkList = that.checkList.concat(dtosArr)
            }
            const dto = that.eventBase.applyRrecord
            if (dto) {
              const dtoArr = Object.values(dto)
              that.checkList = that.checkList.concat(dtoArr)
            }
            this.title = this.eventBase.infoTitle
          }
        })
      },

      loadPage(page, reload) {
        const that = this
        if (reload) {
          this.page = 0
          this.instructList = []
        }
        const URL = `${siteUrl}/eventdispose/assign/process?page=${this.page}&size=${this.size}`
        this.$http.get(URL).then((res) => {
          if (res.body.code === 200) {
            that.$store.dispatch('hidePageLoading')
            const resData = res.body.response.list
            const userId = res.body.message
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
        const r = `/report/infosuperview/${id}`
        this.$router.push(r)
      },
      // 跳转到详情页面
      async select(id) {
        const url = `${siteUrl}/eventInfo/markreadByType`
        await this.axios.post(url, {
          menuType: 'transact',
          disposeId: id
        })
        const r = `/instruct/transtab/${id}`
        this.$router.push(r)
      }
    }
  }
</script>
