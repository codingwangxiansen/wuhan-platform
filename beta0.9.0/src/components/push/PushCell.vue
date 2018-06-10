<template>
  <div class="infoPart" @click="getDetail(dataModel)">
    <div class="topPart">
      <div class="imgPart" v-if="dataModel.flowDto.flowCover">
        <img :src="dataModel.flowDto.flowCover">
      </div>

      <div class="descPart">
        <div>{{dataModel.pushFrom}}<span class="time-span" v-if="!dataModel.flowDto.flowCover">{{dataModel.pushTimeStr}}</span><!--<span class="typeContent">{{dataModel.pushSendType}}</span>--></div>
        <div v-if="dataModel.flowDto.flowCover">{{dataModel.pushTimeStr}}<!--<span style="margin-left: 20px">{{dataModel.pushTo}}</span>--></div>
      </div>
    </div>
    <div :class="[this.dataModel.pushRead?'':unread]">
      <div>{{dataModel.flowDto.flowTitle}}</div>
      <article style="margin-top: 10px">{{dataModel.flowDto.flowDetailShort}}</article>
    </div>
    <div class="footPart">
      <div class="tagContent"><a class="tagPart" v-for="y in dataModel.flowDto.tags">{{y}}</a></div>
    </div>
    <div class="userspan">点击查看详情</div>
  </div>

</template>
<style lang="less" scoped="scoped">
  .time-span{
    float: right;margin-right: 10px;
  }

  .infoPart {
    padding: 10px;
    border-top: 1px solid #c0c0c0;
    border-bottom: 1px solid #c0c0c0;
    margin-bottom: 10px;
    background: #fff;
    color: #333333;
  }

  .topPart .imgPart {
    float: left;
    margin-right: 10px;
  }

  .topPart img {
    width: 100px;
    height: 70px;
  }

  .descPart {
    line-height: 40px;
    color: #909090;
  }

  .typeContent {
    display:none;
    /* display: inline-block; */
    padding: 0 20px;
    background: #ffcccc;
    color: #e45050;
    float: right;
    border-radius: 10px;
    border: 1px solid #e45050;
    line-height: 36px;
    font-weight: 600;
  }

  .footPart {
    font-size: 12px;
    margin-right: 106px;
  }

  .tagPart {
    display: inline-block;
    margin-top: 10px;
    color: #8f8f8f;
    border: 1px solid #e3e3e3;
    margin-left: 3px;
    padding: 3px 10px;
    background: #e3e3e3;
    border-radius: 14px;
    font-size: 12px;
    margin-bottom: 3px;
  }

  .tagContent{
    margin-right: 90px;
  }

  .userspan {
    margin-right: 10px;
    color: #909090;
    line-height: 30px;
    position: absolute;
    right: 0;
    bottom: 8px;
  }

  .userspan img {
    width: 20px;
    margin-right: 6px;
  }

  .unread{
    font-weight: bold;
  }
</style>
<script>
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { getTimeStamp } from '../../utils/common'

  Vue.use(VueResource)
  export default{
    name: 'ListChild',
    props: ['dataModel'],
    data() {
      return {
        unread: 'unread'
      }
    },
    created() {
//    this.dataModel.pushTimeStr = getTimeStamp(this.dataModel.pushTimeStr)
//    console.log( this.dataModel.pushTimeStr)
    },
    methods: {
      goBack() {
        this.colorSelect = 'infoPart2'
      },
      getDetail(x) {
        this.colorSelect = 'infoPart1'
        this.dataModel.pushRead = '1'
        this.$emit('on-cell-click', x)
      /*
      const options = {'url': x.flowDto.flowUrl};
      console.log( options)
      if(x.pushRead !== '1'){
        let url = siteUrl +'/rest/cgibin/message/readstate/'+x.pushId
        this.$http.get(url).then(function (res) {
          this.colorSelect = 'infoPart1'
          this.dataModel.pushRead = '1'
          if(this.$gsafety){
            this.$gsafety.openWindow(options);
          }
        })
      } else{
        if($gsafety){
          $gsafety.openWindow(options);
        }
      }
      */
      }
    },
    filters: {
      timeFilter(timeStr) {
        return getTimeStamp(timeStr)
      }
    }
}
</script>
