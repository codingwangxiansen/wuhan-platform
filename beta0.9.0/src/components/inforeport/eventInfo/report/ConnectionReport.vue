<!-- 办结列表显示控件控件	 -->
<template>
  <div class="transList">
    <group>
      <!-- <i class="icon" @click.prevent="transShow = !transShow" :class="transShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i> -->
      <!-- <panel header=""  :list="list" type="4" ></panel> -->
      <div class="contenBig" v-show="transShow">
        <div class="continueContent" v-for="(item, index) in list" :key="index">
          <p class="desc">{{item.eventDescription}}</p>
          <div class="contain-img" v-if="item.attachExist">
            <attach-upload
              :attachs="getJson(item.attachIds)"
              :canUpload="false"></attach-upload>
          </div>
          <p class="times">{{item.createTimeStr}}</p>
        </div>
      <div v-show="list.length === 0" class="nothing">该事件未含续报信息</div>
      </div>
    </group>
  </div>
</template>
<style lang="less" scpoed>
  .continueContent{
    position: relative;
    padding: 10px;
    border-bottom: 2px solid #e2e2e2;
    margin-bottom: 5px;
    .desc{
      font-size: 14px;
      line-height: 16px;
    }
    .times{
      text-align: left;
      font-size: 12px;
      color: #999;
      font-weight: 400;
      margin: 1px 3px 0px 0px;
      line-height: 16px;
    }
  }
  .img{
    width: 30%;
    height: 5.5em;
    margin: 0 1%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .imgatt{
    width: 100%;
    height: 100%;
  }
  .transList {
    .contenBig {
      padding: 5px 5px 1px 5px;
      .transContent {
        position: relative;
        padding: 0px 10px;
      }
      .nothing{
        padding: 10px;
        font-size: 14px;
      }
    }
  }
</style>
<script>
  import { Cell, Popup, Panel, Group } from 'vux'
  import config from '../../../../config'
  import AttachUpload from '../../../mycomponents/AttachUpload'

  export default {
    props: ['eventInfoId', 'currentDetailItem'],
    data() {
      return {
        transShow: true,
        list: []
      }
    },
    components: {
      Cell,
      Popup,
      Panel,
      Group,
      AttachUpload
    },
    methods: {
      getJson(str) {
        if (str) {
          return JSON.parse(str)
        }
        return []
      },
      async getContinueData() {
        if (!this.eventInfoId) {
          return
        }
        const URL = `${config.siteUrl}/eventInfo/list/continuedReport/${this.eventInfoId}`
        const that = this
        const param = {
          keyWord: ''
        }
        that.list = []
        await that.axios.post(URL, param)
          .then((response) => {
            const infos = response.data.response.result
            if (infos) {
              that.list = []
              const infosValArr = Object.values(infos)
              infosValArr.forEach((value) => {
                that.list.push(value)
              })
            }
            that.$store.dispatch('hidePageLoading')
          })
          .catch(() => {
          })
      }
    },
    mounted() {
    }
  }
</script>
