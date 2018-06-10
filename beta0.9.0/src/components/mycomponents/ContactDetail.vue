/*************************************************************/
/*imgUrl--用户头像 username--用户名 typeName--类型 position--职位 orgName--部门/机构
prof--职务 mobileTel--手机 officeTel--办公电话 ext--扩展字段*/
/*************************************************************/
<template>
<div>
  <div class="show-info-content">
    <div class="header-content">
      <img v-if="isImgExist" @error="changeImgStatus" :src="user.imgUrl?user.imgUrl:''">
      <div v-else class="outer-content">
        <div class="inner-content">{{firstname}}</div>
      </div>
    </div>
    <h2>{{user.username}}</h2>
    <p class="position-content">{{user.position}}</p>
    <p class="position-content">{{user.orgName}}</p>
  </div>
  <div class="action-content">
    <ul class="action-bar">
      <li><a class="phone-link" :class="{'disabled':!user.mobileTel}" @click="linkTo(user.mobileTel)" :href="user.mobileTel?'tel:' + user.mobileTel:''"></a></li>
      <li><a class="mobile-link" :class="{'disabled':!user.officeTel}" @click="linkTo(user.officeTel)" :href="user.officeTel? 'tel:' + user.officeTel:''"></a></li>
      <li><a class="message-link" :class="{'disabled':!user.mobileTel}" @click="linkTo(user.mobileTel)" :href="user.mobileTel? 'sms:' + user.mobileTel:''"></a></li>
      <li><a class="favorite-link"></a></li>
    </ul>
    <div style="clear: both"></div>
  </div>
</div>
</template>

<style lang="less">
  @import "../../styles/common.less";
  .detail-info-part .vux-label-desc{
    font-size: 16px;
    color: @textColor;
  }

  .action-bar li:last-child{
    display: none;
  }


  .detail-info-part{
    background: #ffffff;
    border-top: 1px solid #D9D9D9;
    border-bottom: 1px solid #D9D9D9;
  }

  .action-content{
    padding: 20px 0;
    background: #f6f6f6;
  }

  .action-bar{
    width: 80%;
    margin: auto;
  }

  .action-bar li{
    float: left;
    width: 33%;
  }

  .action-bar li a{
    display: block;
    width: 46px;
    height: 46px;
    background-size: 100%;
    border: 1px solid @borderColor;
    border-radius: 24px;
    margin: auto;
  }

  .action-bar li a.disabled{
    border: 1px solid @borderColorDisabled;
    background-size: 100%;
  }

  .show-info-content{
    padding-bottom: 20px;
    background: #fafafa;
  }

  .show-info-content h2{
    text-align: center;
  }

  .show-info-content .position-content{
    text-align: center;
    color: #888888;
  }

  .header-content{
    padding-top: 40px;
    padding-bottom: 10px;
    text-align: center;
  }

  .header-content img{
    width: 76px;
    height: 76px;
    border-radius: 38px;
  }

  .inner-content{
    font-size: 30px;
    color: #858585;
    background: #eeeeee;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 34px;
    border: 4px solid #dcdcdc;
  }

  .outer-content{
    border: 4px solid #d0d0d0;
    width: 68px;
    height: 68px;
    border-radius: 38px;
    margin: auto;
  }

</style>

<script>
  import { Group, Cell } from 'vux'

  export default {
    name: 'contactDetail',
    props: ['user'],
    // 数据模型
    data() {
      return {
        telStatus: false,
        isImgExist: true
      }
    },

  // 组件
    components: { Group, Cell },

  // vue实例创建后调用
    created() {
    },
    computed: {
      firstname() {
        if (this.user.username) {
          return this.user.username.substring(0, 1)
        }
        return ''
      }
    },
  // 定义方法区
    methods: {
      jumpGroup() {
        const urlGroup = location.origin + this.$pathConfig.COMMUNICATE_URL.GROUP_URL
        const options = { urlGroup }
        if (this.$gsafety) {
          this.$gsafety.openWindow(options)
        }
      },
      linkTo(mobile) {
        if (!mobile) {
          alert('没有联系方式')
        }
        return false
      },
      changeImgStatus() {
        this.isImgExist = false
      }
    }

  }
</script>
