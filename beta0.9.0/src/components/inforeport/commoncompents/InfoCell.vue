<template>
  <div>
    <cell class="report-info-col" v-for="(item,index) in data" @click.native="getDetail(item.dto.memorabiliaId)">
      <div class="document-desc" slot="inline-desc">
      	<!-- 未读、已读用颜色区分 -->
        <span class="read-status"><i :class="readColor(readFlag)">{{readStatus}}</i></span>
        <!--
        -->
        <span class="dist-name">{{item.dto.districtCodeStr}}</span>
      </div>
      <!--
       -->
      <img class="document-img" slot="icon" :src="imageSrc(index)"/>
      <div class="document-title" slot="inline-desc"><span>{{item.dto.title}}</span></div>
      <div class="document-desc" slot="inline-desc">
        <span>{{item.dto.updateTime}}</span>
        <span>{{item.dto.districtCodeStr}}</span>
      </div>
    </cell>
  </div>
</template>
<style type="less" scoped>
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
    margin-right:50px;
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

  .dist-name {
    /*float: right;*/
    color: #03A9F4;
  }
</style>
<script>
  import { Cell } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'

  Vue.use(VueResource)

  export default {
    name: 'InfoCell',
    props: ['data'],
    // 数据模型
    data() {
      return {
        news: {},
        list: [],
        readFlag: false,
        readStatus: '未读',
        imgsrc: '../static/image/img-05NotExist.png'
      }
    },
    // 组件
    components: { Cell },
    // 页面加载
    created() {
    },
    // 方法
    methods: {
      getDetail() {
        const url = location.origin + location.pathname + this.$DEFAULT.REPORT.CHECKVIEW
        const openWindowOptions = { url, showActionBar: false }
        if (this.$gsafety) {
          this.$gsafety.openWindow(openWindowOptions)
        }
      },
      imageSrc(val) {
        let imgUrl = '../static/image/info/'
        if (val % 4 === 0) {
          imgUrl = `${imgUrl}star-green.png`
        } else if (val % 4 === 1) {
          imgUrl = `${imgUrl}star-yellow.png`
        } else if (val % 4 === 2) {
          imgUrl = `${imgUrl}star-orange.png`
        } else {
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
