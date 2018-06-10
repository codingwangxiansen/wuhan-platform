<template>
  <div class="transInfo">
    <group class="unit">
      <box>
        <p><span class="infoName">事件信息：</span><span class="release" @click.stop="relInfo({ eventInfoId: data.eventInfoId, infoType: data.infoType })">{{data.infoTitle}}</span></p>
        <div class="leadBack" v-if="data.person">
          <p>批示指示：</p>
          <div class="leadCart">
            <h4><i class="gs-user-circle"></i><span>{{data.person}}</span></h4>
            <p class="fontInfoCss">{{data.content}}</p>
          </div>
        </div>
        <p>
          <span class="infoName">转办意见：</span><span class="fontInfoCss">{{data.disposeDescription}}</span>
        </p>
        <div v-if="attachs.length" class="attach-part">
          <span class="show-attach" v-show="attachs.length > 0">附件信息：</span>
          <attach-upload
            :attachs="attachs"
            :canUpload="false"></attach-upload>
        </div>
        <p><span class="infoName">转办时间：</span><span class="fontInfoCss">{{data.disposeTimeStr}}</span></p>
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
    <group title="回复情况" class="backMassage">
      <group v-for="(item,index) in backMsg" :key="index">
        <div class="backMsg">
          <div>
            <i class="gs-user-circle"></i>
            <span class="backPerson">{{item.disposeOrgName}}&nbsp;{{item.disposePersonName}}</span>
            <span class="backContentt">{{item.disposeTimeStr}}</span>
          </div>
          <span class="backContent">{{item.disposeDescription}}</span>
          <div v-if="item.attachs.length">
            <span class="show-attach" v-show="item.attachs">附件信息：</span>
              <attach-upload
                :attachs="item.attachs"
                :canUpload="false"></attach-upload>
          </div>
        </div>
      </group>
    </group>
  </div>

</template>
<style type="less" scoped>
  .signtitle{
    line-height: 1.5em;
    margin: 12px 0 6px 10px;
  }
  .sign{
    margin: 6px 10px;
    line-height: 1.5em;
    text-indent: 2em;
  }
  .waitsign{
    color: red;
    font-weight: bold;
  }
  .transIdea {
    width: 100%;
    border-bottom: 1px solid #ccc;
  }
  .transIdea p.infoName {
    border-bottom: none;
  }

  .leadCart h4{
    padding: 5px 15px;
  }
  .leadCart .gs-user-circle {
    margin-right: 5px;
  }
  .leadCart .fontInfoCss {
      padding-left: 16px;
  }
  .leadBack {
    background: #fff;
  }
  .transInfo {
    margin-bottom: 8em;
  }
  .transInfo button.weui-btn, .transInfo input.weui-btn {
    width: 94%;
  }
  .transInfo > div {
    padding-bottom: 5px;
  }
  .backName{
    float: left;
    color: #0b6694;
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
    width: 70px;
    text-align: center;
    font-size: 14px;
  }
  .release {
    color: #03A9F4;
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
  .file {
    text-align: left;
  }
  .transInfo p {
    line-height: 2em;
    text-align: left;
    padding: 5px 15px;
  }
  .infoName {
    display: inline-block;
    width: 75px;
    text-align: left;
    font-size: 14px;
  }
  button.weui-btn, input.weui-btn {
    width: 95%;
    margin: 10px;
  }
  .attach-img{
    text-align: center;
  }
  .nShow {
    display: none;
  }
  .fontInfoCss {
    font-size: 14px;
    color: #8a8888;
  }
  .line_hidden {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .detail-img {
    width: 100px;
    height: 100px;
    float: left;
    margin: 10px;
  }

  .attach-part{
    padding: 0 15px;
  }
</style>
<script>
  import { Cell, Scroller, XButton, Flexbox, FlexboxItem, Group, XTextarea, Box } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import TransitionPage from './../../../mycomponents/TransitionPage'
  import InstructItem from './InstructItem'
  import watchPopup from './watchPopup'
  import AttachUpload from '../../../mycomponents/AttachUpload'

  Vue.use(VueResource)

  export default {
    // 组件
    components: {
      Flexbox,
      FlexboxItem,
      Cell,
      Scroller,
      XButton,
      InstructItem,
      TransitionPage,
      Group,
      XTextarea,
      Box,
      watchPopup,
      AttachUpload
    },
    props: ['id'],
    // 数据模型
    data() {
      return {
        repeatInfo: '批示的信息',
        infoList: {},
        data: {
        },
        // 签收状态
        receipt: {},
        signOrg: {},
        backMsg: [],
//        传到弹窗子组件的值
        objPop: {},
        watchObj: {},
        eventInfoId: '',
        transactContent: '',
        transactUserName: '',
        commonInstructionDto: '',
        attachs: [],
        currentUser: {},
        buttonLoading: false
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
        that.backMsg = []
        that.getSignOrg(id)
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
            let attachs = []
            result.feedBackDtos.forEach((x) => {
              attachs = JSON.parse(x.attachs)
              x.attachs = attachs
              that.backMsg.push(x)
            })
            that.attachs = JSON.parse(result.attachs)
            that.transactUserName = result.transactUserName
            that.$emit('on-init', result)
          }
        })
      },
      toBack(txt) {
        this.$refs.popShow.showPop(txt)
      },
      backMssg(obj) {
        const objAttachs = obj.imgs
        this.backMsg.push({ disposeOrgName: this.currentUser.orgName,
          disposeDescription: obj.backContent,
          attachs: objAttachs,
          disposePersonName: this.currentUser.username,
          disposeTimeStr: this.getTime()
        })
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
      relInfo(obj) {
        if (obj.infoType === 'emergency') {
          const r = `/deal/instructView/2/${obj.eventInfoId}`
          this.$router.push(r)
        } else {
          const r = `/instruct/warn/${obj.eventInfoId}`
          this.$store.commit('setInfoPageManipulable', false)
          this.$router.push(r)
        }
      },
      toCancel() {
        window.history.go(-1)
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
        const signStat = waitNum === 0 ? '全部已签收' : `${okNum}/${okNum + waitNum}已签收`
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
