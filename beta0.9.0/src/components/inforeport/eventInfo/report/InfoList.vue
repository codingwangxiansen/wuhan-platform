<template>
  <div class="info-list">
    <scroller height="-10" lock-x scrollbar-y use-pullup
              :pullup-config="pullup_config"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0, true)" @on-pullup-loading="loadPage(page,false)" >
      <div>
        <transition-page :options="promptDiagram"></transition-page>
        <cell  class="report-info-col" v-for="(item,index) in list" :key="index"
               @click.native="getDetail(item.handleStatus,item.eventInfoId)"
               @touchstart.native="showDeleteButton(item.eventInfoId,item.infoStatus,item.reportDate)">
          <div class="document-title" slot="inline-desc"><span>{{item.infoTitle}}</span></div>
          <span class="read-status"><i :class="readColor(item.isBack)" v-if="!item.isBack">{{item.handleStatusStr}}</i>
              <i :class="readColor(item.isBack)" v-if="item.isBack">{{item.isBackStr}}</i></span>
          <div class="leftLine" :class="lineStyle(item.eventLevelCode)"></div>

          <!--事件类型-->
          <div class="document-desc" slot="inline-desc">

            <span class="type-name">事件类型： <span class="typeMain">{{item.eventTypeName}}</span></span>

          </div>
          <div class="document-desc" slot="inline-desc">
            <span><i class="gs-clock"></i> {{item.updateTime}}</span>
            <span class="dist-name"><i class="gs-location"></i>{{item.distName}}</span>
          </div>
        </cell>
      </div>
    </scroller>
    <div>
      <a class="add-btn" @click="addInfo">
        <span class="horizontal"></span>
        <span class="vertical"></span>
      </a>
    </div>
  </div>
</template>
<style type="less" scoped>
  .info-list{
    background: #EDEDED;
  }

  .report-info-col{
    margin-top: 5px;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    border-top: 1px solid #fff;
  }

  .document-img{
    width: 20px;
    margin-top: 8px;
  }

  .document-title{
    font-size: 16px;
    margin-bottom: 3px;
    color: #000;
    /*width: 70%;*/
  }

  .document-title span:first-child{
    display: inline-block;
    vertical-align: middle;
    color: #222;
    font-size: 1.3em;
    font-weight: 600;
    line-height: 2em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 12em;
    /*width: 100%;*/
  }


  .document-desc span:first-child{
    display: inline-block;
    margin-right:10px;
  }

  .document-desc .type-name{
    display: block;
    vertical-align: bottom;
    color: #666;
    font-size: 1.1em;
  }

  .read-status{
    margin-left: 10px;
  }

  .read-status .read{
    color: #f65741;
    font-style: normal;
  }

  .read-status .unread{
    color: #36ba4f ;
    font-style: normal;
  }

  .dist-info-type{
    margin-right: 10px;
    float: right;
    color: #03A9F4;
  }

  .document-desc span {
    color : #b6b6b6;
  }

  .dist-name {
    margin-right: 20px;
    float: right;
    color: #03A9F4;
  }

  span.typeMain {
    color:#222;
  }
  .add-btn{
    display: block;
    position: fixed;
    bottom: 10px;
    right: 10px;
    height: 60px;
    width: 60px;
    border-radius: 30px;
    background: #03A9F4;
    box-shadow: 2px 2px 5px #64d0ee;
  }

  .add-btn span{
    background: #ffffff;
    display: block;
    position: absolute;
  }

  .add-btn .horizontal{
    width: 40px;
    height: 2px;
    top: 29px;
    left: 10px;
  }

  .add-btn .horizontal{
    width: 40px;
    height: 2px;
    top: 29px;
    left: 10px;
  }

  .add-btn .vertical{
    width: 2px;
    height: 40px;
    top: 10px;
    left: 29px;
  }
  /*左边条*/
  .report-info-col  {
    margin: 8px 6px;
  }
  .report-info-col .leftLine {
    display: inline-block;
    width: 5px;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }
  /*不同等级颜色*/
  .lineRed {
    background-color: #f73535;
  }
  .lineYellow {
    background-color: #ffb818;
  }
  .lineOrange {
    background-color: #ff7418;
  }
  .lineBlue {
    background-color: #2d41bb;
  }
</style>
<script>
  import { Cell, Scroller } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import TransitionPage from '../../../mycomponents/TransitionPage'

  Vue.use(VueResource)

  export default {
    // 数据模型
    data() {
      return {
        infos: {},
        list: [],
        dataUser: {},
        readFlag: false,
        readStatus: '未读',
        page: 0,
        size: 10,
        isDiffTime: '99',
        imgsrc: '../static/image/img-05NotExist.png',
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
        }
      }
    },
    // 组件
    components: { Cell, Scroller, TransitionPage },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        vm.$store.commit('setHeaderTitle', '新增突发事件信息')  // 设置头部文字
        vm.loadPage(vm.page, true)
      })
    },
    // 页面加载
    created() {
      this.$store.dispatch('showPageLoading')
    },
    // 方法
    methods: {
    // 长按删除（未上报）
      showDeleteButton(id, status, reportTime) {
        const that = this
        clearInterval(this.Loop) // 再次清空定时器，防止重复注册定时器
        that.Loop = setTimeout(() => {
          if (status === 0) {
            // 未上报时长按删除
            const url = `${siteUrl}/eventInfo/delete/${id}`
            that.$vux.confirm.show({
              title: '确认删除？',
              content: '',
              onConfirm() {
                that.$http.post(url).then((response) => {
                  if (response.body.code === 200) {
                    // that.alertShow('删除成功')
                    that.$vux.toast.text('删除成功', 'middle')
                    that.loadPage(that.page, true)
                    that.$vux.confirm.hide()
                  }
                }, () => {
                  // that.alertShow('删除失败')
                  that.$vux.toast.text('删除失败', 'middle')
                  that.$vux.confirm.hide()
                })
              }
            })
          } else {
            that.isDiffTime = that.getDiffTimer(reportTime)
            // 当前时间与上报时间小于两分钟时，可以进行撤回操作
            if (that.isDiffTime <= 2) {
              // 已上报时长按撤回
              const url = `${siteUrl}/eventInfo/cancelReport/${id}`
              that.$vux.confirm.show({
                title: '确认撤回？',
                content: '',
                onConfirm() {
                  that.$http.get(url).then((response) => {
                    if (response.body.code === 200) {
                      // that.alertShow('撤回成功')
                      that.$vux.toast.text('撤回成功', 'middle')
                      that.loadPage(that.page, true)
                      that.$vux.confirm.hide()
                    } else {
                      // that.alertShow(response.body.message)
                      that.$vux.toast.text(response.body.message, 'middle')
                    }
                  }, () => {
                    // that.alertShow('撤回失败')
                    that.$vux.toast.text('撤回失败', 'middle')
                    that.$vux.confirm.hide()
                  })
                }
              })
            } else {
              // that.alertShow('上报时间已超过两分钟，撤回失败')
              that.$vux.toast.text('上报时间已超过两分钟，撤回失败', 'middle')
            }
          }
        }, 2000)
      },
      // 上报时间与当前时间相比的间隔时长
      getDiffTimer(reportTime) {
        const date = new Date(reportTime)
        // 计算时间间隔，单位为分钟
        return parseInt((new Date().getTime() - date.getTime()) / 1000 / 60, 10)
      },
      loadPage(page, reload) {
        const that = this
        if (!reload) {
          this.page = page + 1
        }
        const URL = `${siteUrl}/eventInfo/list/eventSearch?page=${that.page}&size=${this.size}`
        this.$http.post(URL, '').then(function (res) {
          that.$store.dispatch('hidePageLoading')
          that.infos = res.body.response.result
          if (that.page === 0) {
            this.page = 0
            this.list = []
            // 添加加载效果图
            this.promptDiagram.show = true // 开启效果图
            this.promptDiagram.imgUrl = '../static/image/loading.gif'
            this.promptDiagram.content = ''
          }
          if (that.infos.length > 0) {
            that.$refs.scroll1.enablePullup()
            that.promptDiagram.show = false
            const valueAttr = Object.values(that.infos)
            that.list = that.list.concat(valueAttr)
          } else if (that.list.length <= 0) {
            that.promptDiagram.show = false
            that.promptDiagram.show = true
            that.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png')
            that.promptDiagram.content = '暂无数据'
          } else if (that.infos.length < 10) {
            that.$refs.scroll1.disablePullup()
          }
          this.$refs.scroll1.donePullup()
          this.$refs.scroll1.donePulldown()
          that.$nextTick(() => { this.$refs.scroll1.reset() })
        })
      },
      getDetail(state, id) {
        clearInterval(this.Loop)
        const r = `/report/infosuperview/${id}`
        this.$router.push(r)
      },
      lineStyle(val) {
        if (val === 5) {
          return 'lineBlue'
        } else if (val === 4) {
          return 'lineOrange'
        } else if (val === 3) {
          return 'lineYellow'
        } else if (val === 2) {
          return 'lineRed'
        } else if (val === 1) {
          return 'lineRed'
        }
        return ''
      },
      readColor(val) {
        if (val === 1) return 'read'
        return 'unread'
      },
      addInfo() {
        const r = '/report/add'
        this.$router.push(r)
      }
    }
  }
</script>
