<template>
  <div class="announcement no-border">
    <group class="unit">
      <box>
        <p class="infoName"><span class="release" >{{data.infoTitle}}</span></p>
        <x-textarea ref="descriptionArea" readonly autosize :value="data.disposeDescription" placeholder=""></x-textarea>
        <div>
          <div class="baseInfo">
            <span class="show-attach" v-show="attachs.length > 0">附件信息：</span>
            <attach-upload
              :attachs="attachs"
              :canUpload="false"></attach-upload>
          </div>
        </div>
      </box>
    </group>
    <group gutter="0">
      <cell v-if="signOrg.okNum != 0 || signOrg.waitNum != 0"
            title="接收单位"
            :value="getOrgSignStr(signOrg)"
            @click.native="showOrgRecord()"
            is-link>
      </cell>
      <cell v-if="signOrg.okPenson != 0 || signOrg.waitPenson != 0"
            title="接收人"
            :value="getPersonSignStr(signOrg)"
            @click.native="showUserRecord()"
            is-link>
      </cell>
    </group>
    <group title="回复历史" class="backMassage" v-if="backMsg.length>0">
      <group v-for="(item,index) in backMsg" :key="index">
        <div class="backMsg">
          <div>
            <i class="gs-user-circle"></i>
            <span class="backPerson">{{item.disposeOrgName}}&nbsp;{{item.disposePersonName}}</span>
            <span class="backContentt">{{item.disposeTimeStr}}</span>
          </div>
          <span class="backContent">{{item.disposeDescription}}</span>
          <div class="baseInfo">
            <attach-upload
              :attachs="item.attach"
              :canUpload="false"></attach-upload>
          </div>
        </div>
      </group>
    </group>
  </div>

</template>
<style type="less" scoped>
  .announcement {
    .weui-textarea {
      border: none !important;
      background-color: #fff;
    }
  }
  .signtitle{
    line-height: 1.5em;
    font-size: 14px;
    margin: 12px 0 6px 10px;
  }
  .sign{
    margin: 6px 10px;
    line-height: 1.5em;
    font-size: 14px;
    text-indent: 2em;
  }
  .baseInfo .img-box {
    margin: 10px 0 0 10px;
  }
  /*gs-list4*/
  .baseInfo {
    .collpic {
      margin-bottom: 30px;
    }
    & > .tabNav {
      margin-bottom: -1px;
    }
    & > .currentDetail {
      margin-top: -2px;
    }
    &>div {
      border-bottom: 1px solid #e2e2e2;
      border-top: 1px solid #e2e2e2;
      position: relative;
      margin: 5px 0;
      .icon {
        position: absolute;
        right: 15px;
        font-size: 30px;
        top: -35px;
        color: #333;
        width: 35%;
        text-align: right;
      }
    }

    &>section {
      .span-group{
        border-bottom: 1px solid #e2e2e2;
        border-top: 1px solid #e2e2e2;
        position: relative;
        margin: 15px 0;
      }

      .icon {
        position: absolute;
        right: 15px;
        font-size: 30px;
        top: -35px;
        color: #333;
        width: 45%;
        text-align: right;
      }
    }
    .gs-list4:before {
      position: absolute;
      z-index: 9;
      font-size: 20px;
      color: #333;
      top: 10px;
      left: 8px;
    }
    .gs-file-text2:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 12px;
      left: 12px;
    }
    .gs-file-picture:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 12px;
      left: 12px;
    }
  }
  .sign{
    margin: 12px 10px;
    line-height: 1.5em;
  }
  .waitsign{
    color: red;
    font-weight: bold;
  }
  .tdwidth{
    float: left;
    width: 5em;
  }
  .orgwidth{
    margin-left: 5em;
  }
  .unit >div>div>p{
    line-height: 2.5em;
  }
  .backMsg {
    margin: 8px;
    margin-left: 19px;
    text-align: left;
    line-height: 22px;
  }
  .backContent{
    word-wrap: break-word;
    font-size: 14px;
    color: #8a8888;
  }
  .backPerson {
    font-weight: 700;
    font-size: 14px;
  }
  .backContentt {
    word-wrap: break-word;
    float: right;
    font-size: 12px;
    color: #444;
  }
  .show-attach{
    float: left;
    margin: 10px 0px;
    display: inline-block;
    width: 88px;
    text-align: right;
    font-size: 14px;
  }
  .release {
    font-size: 16px;
  }
  .backMassage h3 {
    margin-bottom: -1em;
    color: #999ba1;
    font-weight: normal;
    margin-left: 1em;
  }
  .weui-cell:before {
    display: none;
  }
  .infoLead [data-v-4948700e], .repTime[data-v-4948700e] {
    border-bottom: none;
  }
  .infoName {
    margin: 5px 10px;
    color: #000;
    text-align: center;
    font-size: 14px;
  }
  .attach-img{
    text-align: center;
  }
  .nShow {
    display: none;
  }
  .detail-img {
    width: 100px;
    height: 100px;
    float: left;
    margin: 10px;
  }
</style>
<script>
  import { Group, XButton, Box, XTextarea, Cell } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../utils/common'
  import AttachUpload from '../../components/mycomponents/AttachUpload'

  Vue.use(VueResource)

  export default {
    // 组件
    components: {
      XButton,
      Group,
      Box,
      AttachUpload,
      XTextarea,
      Cell
    },
    props: ['id'],
    // 数据模型
    data() {
      return {
        infoList: {},
        data: {
        },
        // 签收状态
        receipt: {},
        signOrg: {},
        backMsg: [],
        eventInfoId: '',
        transactContent: '',
        transactUserName: '',
        commonInstructionDto: '',
        attachs: [],
        currentUser: {}
      }
    },
    beforeCreate() {
      const that = this
      this.$nextTick(() => {
        that.$store.dispatch('showPageLoading')
      })
    },
    created() {
      this.currentUser = this.$store.state.user
    },
    // 方法
    methods: {
      loadPage(id) {
        const that = this
        that.getSignOrg(id)
        that.backMsg = []
        const url = `${siteUrl}/eventdispose/assign/show/${id}`
        this.$http.get(url).then((res) => {
          if (res.body.code === 200) {
            that.$store.dispatch('hidePageLoading')
            const result = res.body.response
            that.eventInfoId = result.eventInfoId
            that.data = result
            that.receipt = result.receipt
            that.infoList = result.eventInfoDto
            that.transactContent = result.transactContent
            let attach = {}
            result.feedBackDtos.forEach((x) => {
              if (x.attachs) {
                attach = JSON.parse(x.attachs)
                x.attach = attach
              }
              that.backMsg.push(x)
            })
            that.transactUserName = result.transactUserName
            that.$emit('on-init', result)
            if (result.attachs) {
              that.attachs = JSON.parse(result.attachs)
            } else {
              this.attachs = []
            }
            that.$nextTick(() => {
              that.$refs.descriptionArea.updateAutosize()
            })
          }
        })
      },
      getSignOrg(id) {
        const that = this
        const url = `${siteUrl}/eventreceipt/geteventreceiptwaitorgname/${id}`
        this.$http.get(url).then((res) => {
          if (res.body.code === 200) {
            that.$store.dispatch('hidePageLoading')
            const result = res.body.response
            that.signOrg = result
          }
        })
      },
      isLeaderCss(status) {
        let classNam
        if (status) {
          classNam = 'nShow'
        } else {
          classNam = 'nShow'
        }
        return classNam
      },
      getTime() {
        const date = new Date()
        const seperator1 = '-'
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = `0${month}`
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = `0${strDate}`
        }
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        const currentdate = `${year}${seperator1}${month}${seperator1}${strDate} ${hour}:${minute}`
        return currentdate
      },
      getOrgSignStr(signOrg) { // 获取签收cell显示的字符串
        const okNum = Number(signOrg.okNum)
        const waitNum = Number(signOrg.waitNum)
        let okOrgName = ''
        if (signOrg.okOrgName) {
          okOrgName = signOrg.okOrgName.indexOf('、') > -1 ? signOrg.okOrgName.split('、')[0] : signOrg.okOrgName
        }
        let waitOrgName = ''
        if (signOrg.waitOrgName) {
          waitOrgName = signOrg.waitOrgName.indexOf('、') > -1 ? signOrg.waitOrgName.split('、')[0] : signOrg.waitOrgName
        }
        let signStr
        const signStat = waitNum === 0 ? '全部已签收' : `${okNum}/${okNum + waitNum}已签`
        if ((okNum + waitNum) > 1) {
          signStr = `（${signStat})${okNum ? okOrgName : waitOrgName}等${okNum + waitNum}家`
        } else {
          signStr = `（${signStat})${okNum ? okOrgName : waitOrgName}`
        }
        return signStr
      },
      getPersonSignStr(signOrg) { // 获取签收cell显示的字符串
        const okPenson = Number(signOrg.okPenson)
        const waitPenson = Number(signOrg.waitPenson)
        let okUserName = ''
        if (signOrg.okUserName) {
          okUserName = signOrg.okUserName.indexOf('、') > -1 ? signOrg.okUserName.split('、')[0] : signOrg.okUserName
        }
        let waitUserName = ''
        if (signOrg.waitUserName) {
          waitUserName = signOrg.waitUserName.indexOf('、') > -1 ? signOrg.waitUserName.split('、')[0] : signOrg.waitUserName
        }
        let signStr
        const signStat = waitPenson === 0 ? '全部已签收' : `${okPenson}/${okPenson + waitPenson}已签收`
        if ((okPenson + waitPenson) > 1) {
          signStr = `(${signStat})${okPenson ? okUserName : waitUserName}等${okPenson + waitPenson}人`
        } else {
          signStr = `(${signStat})${okPenson ? okUserName : waitUserName}`
        }
        return signStr
      },
      showOrgRecord() {
        this.$router.push({
          name: 'SignListPage',
          params: {
            id: this.id,
            pageTitle: '接收单位',
            partType: '2' // 1 人员 2 机构
          }
        })
      },
      showUserRecord() {
        this.$router.push({
          name: 'SignListPage',
          params: {
            id: this.id,
            pageTitle: '接收人员',
            partType: '1' // 1 人员 2 机构
          }
        })
      }
    }
  }
</script>
