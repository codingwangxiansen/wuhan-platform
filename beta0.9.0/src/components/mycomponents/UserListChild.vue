/*************************************************************/
/*imgUrl--用户头像 username--用户名 typeName--类型 position--职位 orgName--部门/机构
expert--专长 mobileTel--手机 officeTel--办公电话 点击事件路径--links.url.href*/
/*************************************************************/
<!--用户列表的组件-->
<template>
  <div style="position: relative;" @click="select">
    <div class="user-img-part">
      <img v-if="isImgExist" @error="changeImgStatus" :src="data.imgUrl?data.imgUrl:''">
      <div v-else class="name-logo">
        {{data.username.substring(0,1)}}
      </div>
    </div>
    <div class="expertContent">
      <h3>{{data.username}}</h3>
      <div class="lTitlePart" v-if="data.position">
        <span>{{data.position}}</span>
      </div>
      <div class="lTitlePart" v-if="data.orgName">
        <span>{{data.orgName}}</span>
      </div>
      <div class="lTitlePart" v-if="data.expert">
        <span>专长：{{data.expert}}</span>
      </div>
      <div class="lTitlePart" v-if="data.mobileTel">
        <span>手机：{{data.mobileTel}}</span>
      </div>
      <div class="btnPart" v-if="data.typeName">
        <button class="total">{{data.typeName}}</button>
      </div>
    </div>
  </div>
</template>
<style>
  .vux-reddot-s{
    background: #fff;
    position: relative;
  }

  .user-img-part{
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -30px;
  }

  .name-logo{
    width: 60px;
    height: 60px;
    background: #e1e1e1;
    border-radius: 40px;
    line-height: 60px;
    text-align: center;
    color: #a9a9a9;
    font-size: 20px;
    font-weight: 600;
    margin-left: 12px;
  }

  .user-img-part img{
    width: 60px;
    height: 60px;
    border-radius: 40px;
    margin-left: 12px;
  }

  .expertContent{
    padding: 10px 20px;
    margin-left: 75px;
  }

  .expertContent:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }

  .expertContent:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }

  .lTitlePart{
    font-size: 13px;
    font-family: "幼圆";
  }

  .expertContent .btnPart{
    padding: 6px 0;
  }

  .expertContent .btnPart .action{
    background: transparent;
    color: #e45050;
    border: 1px solid #e45050;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    padding: 6px 12px;
  }

  .expertContent .btnPart .total{
    background: transparent;
    color: #00a0e9;
    border: 1px solid #00a0e9;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    padding: 6px 12px;
  }
</style>
<script>
  import { searchHistoryController } from '../../utils/common'

  export default{
    name: 'listChild',
    props: ['data', 'preventDefault'],
    data() {
      return {
        colorSelect: '',
        isImgExist: true
      }
    },
    created() {
    },
    methods: {
      /**
       * 打开预案明细页
       */
      select() {
        if (this.preventDefault) {
          return
        }
        const r = `/CommunicateView/${this.data.id}`
        this.$router.push(r)
        const historyData = {
//          pageUrl: this.data.links.url.href,
          name: this.data.username,
          modelType: 'Expert',
          type: 'indexhistory',
          title: '应急专家'
        }
        searchHistoryController.addPageHistory(historyData)
      },
      changeImgStatus() {
        this.isImgExist = false
      }
    }
  }
</script>
