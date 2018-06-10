<!--机构列表的组件-->
<template>
  <div style="position: relative;" @click="select(data.orgCode)">
    <div class="expertContent">
      <h4>{{data.name}}</h4>
    <div class="orgInfo" v-if="data.tel">
      <span>值班电话：</span>
      <a @click="linkTo(data.tel)"
         v-for="(item, index) in data.tel"
         :key="index"
         :href="'tel:'+item">{{item}}</a>
    </div>
    <div class="orgInfo" v-if="data.fax">
      <span>传&nbsp;&nbsp;&nbsp;&nbsp;真：</span>
      <a @click="linkTo(data.fax)"
         v-for="(item, index) in data.fax"
         :key="index"
         :href="'tel:' + item">{{item}}</a>
    </div>
  </div>
  </div>
</template>
<style lang="less" scoped>
  .orgInfo {
    line-height: 31px;
    /*font-size: 13px;*/
    font-family: "\5E7C\5706";
    /*padding: 0 2px;*/
    /*background-color: #f2f2f2;*/
    /*border-bottom: 1px solid #ccc;*/
    a {
      margin-left: 5px;
    }
  }
  .expertContent{
    padding: 5px 10px;
    margin-left: 2px;
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
</style>
<script>
//  import { searchHistoryController } from '../../utils/common'

  export default{
    name: 'OrgCell',
    props: ['data'],
    data() {
      return {
      }
    },
    created() {
      if (this.data.tel) {
        this.data.tel = this.data.tel.split(',')
      }
      if (this.data.fax) {
        this.data.fax = this.data.fax.split(',')
      }
    },
    methods: {
      /**
       * 打开预案明细页
       */
      select(orgCode) {
        const r = `/communicate/CommunicateOrgUser/${orgCode}`
        this.$router.push(r)
//        const historyData = {
//          pageUrl: this.data.links.url.href,
//          name: this.data.name,
//          modelType: 'Communicate',
//          type: 'indexhistory',
//          title: '通讯录'
//        }
//        searchHistoryController.addPageHistory(historyData)
      }
    }
  }
</script>
