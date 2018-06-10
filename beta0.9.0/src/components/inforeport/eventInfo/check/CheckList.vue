<template>
  <div class="info-list">
    <scroller height="-10" lock-x scrollbar-y use-pullup
              :pullup-config="pullup_config"
              ref="scroll1" use-pulldown :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0, true)" @on-pullup-loading="loadPage(page,false)" >
      <div>
        <cell class="report-info-col" v-for="(item,index) in list" :key="index" @click.native="getDetail(item.infoHandleStatus,item.infoId)">
          <div class="document-desc" slot="inline-desc">
            <span class="read-status"><i :class="readColor(item.handleStatus)">{{item.handleStatusStr}}</i></span>
            <span class="dist-info-type">{{item.oldInfoType}}</span>
            <span class="dist-name">{{item.distName}}</span>
          </div>
          <img class="document-img" slot="icon" :src="imageSrc(item.eventLevelCode)"/>
          <div class="document-title" slot="inline-desc"><span>{{item.infoTitle}}</span></div>
          <div class="document-desc" slot="inline-desc">
            <span>更新时间：{{item.updateTime}}</span>
            <span>{{item.eventTypeName}}</span>
          </div>
        </cell>
      </div>
    </scroller>
  </div>
</template>
<style type="less" scoped>
  .info-list{
    background: #EDEDED;
  }

  .report-info-col{
    margin-top: 5px;
    background: #fff;
  }

  .document-img{
    width: 20px;
    margin-top: 8px;
  }

  .document-title{
    font-size: 16px;
    margin-bottom: 3px;
    color: #000;
  }

  .document-title span:first-child{
    display: inline-block;
    max-width: 285px;
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .document-desc span:first-child{
    display: inline-block;
    margin-left: -20px;
    margin-right:35px;
  }

  .read-status{
    margin-left: 10px;
  }

  .read-status .read{
    color: inherit;
    font-style: normal;
  }

  .read-status .unread{
    color: #f65741;
    font-style: normal;
  }

  .dist-info-type{
    margin-right: 10px;
    float: right;
    color: #03A9F4;
  }

  .dist-name {
    margin-right: 20px;
    float: right;
    color: #03A9F4;
  }
</style>
<script>
  import { Cell, Scroller } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'

  Vue.use(VueResource)

  export default {
    // 数据模型
    data() {
      return {
        list: [],
        infos: {},
        readFlag: false,
        readStatus: '未读',
        page: 0,
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
        }
      }
    },
    // 组件
    components: { Cell, Scroller },
    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
          vm.$store.commit('setHeaderTitle', '信息审核')  // 设置头部文字
        }
      )
    },
    // 页面加载
    created() {
      this.loadPage(this.page, true)
    },
  // 方法
    methods: {
      loadPage(page, reload) {
        const that = this
        if (!reload) {
          this.page = page + 1
        }

        const pageJson = { page: that.page, size: this.size }
       // const currentOption={}   此变量声明后在后面并未使用
        const param = { Status: '2' }
        const URL = `${siteUrl}${this.$REST.EventInfo.LIST}?page=${pageJson}`
//        that.axios.post(URL, datas)
//          .then((res) => {
//            that.data.content = res.data.response.content
//          })
//          .catch(() => {
//            console.log('error')
//          })
        this.$http.post(URL, param).then(function (res) {
          that.infos = res.body.response.result
          if (that.page === 0) {
            this.page = 0
            this.list = []
            // 添加加载效果图
            this.promptDiagram.show = true // 开启效果图
            this.promptDiagram.imgUrl = require('assets/image/loading.gif')
            this.promptDiagram.content = ''
          }
          if (that.infos.length > 0) {
            that.$refs.scroll1.enablePullup()
            const value = Object.values(that.infos)
            that.list = that.list.concat(value)
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
        let url = ''
        // 上级上报
  //      if(state=='5'){
        url = `${location.origin}${location.pathname}${this.$DEFAULT.REPORT.REPORTSUPERVIEW}/${id}`
        // 下级上报
  //      }else{
  //        url = location.origin + location.pathname + this.$DEFAULT.REPORT.REPORTVIEW+'/'+id
  //      }
        const openWindowOptions = { url, showActionBar: false }
        if (this.$gsafety) {
          this.$gsafety.openWindow(openWindowOptions)
        }
      },
      imageSrc(val) {
        let imgUrl = '../../assets/image/infoReport/'
        if (val === 5) {
          imgUrl = `${imgUrl}star-green.png`
        } else if (val === 4) {
          imgUrl = `${imgUrl}star-yellow.png`
        } else if (val === 3) {
          imgUrl = `${imgUrl}star-orange.png`
        } else if (val === 2) {
          imgUrl = `${imgUrl}star-red.png`
        } else if (val === 1) {
          imgUrl = `${imgUrl}star-red.png`
        }
        return imgUrl
      },
      readColor(val) {
        if (val) return 'read'
        return 'unread'
      }
    }
  }
</script>
