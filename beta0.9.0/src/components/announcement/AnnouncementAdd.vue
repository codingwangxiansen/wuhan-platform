<template>
  <div class="add-round">
    <!-- <form id="multiForm"> -->
    <group gutter="0" class="ma-bottom">
      <x-input title="标题:" @on-change="saveData('AnnouncementAdd', data)" placeholder="例：某会议通知" :max="36" v-model='data.title' text-align="left"></x-input>
      <x-textarea
        @on-change="saveData('AnnouncementAdd', data)"
        v-model="data.opinionContent" :rows="12"
        placeholder="通知内容(必填)"></x-textarea>
    </group>
    <group class="announUnit">
      <cell title="接收单位" :value="orgNames" @click.native="chooseOrg" is-link></cell>
      <cell title="接收人" :value="userNames" @click.native="chooseUser" is-link></cell>
    </group>
    <group class="fileUpload">
      <attach-upload
        :attachs="attachs"
        @on-action-success ="actionSuccess"
      >
      </attach-upload>
    </group>
    <box class="positionBtn">
      <x-button type="theme" @click.native="submits">清空</x-button>
      <x-button  type="default" @click.native="reportEvent" action-type="button">发布</x-button>
    </box>
    <!-- </form> -->
  </div>
</template>

<style lang="less" scoped>
  .fileUpload {
    margin-top: -18px;
    margin-bottom: 60px;
  }
  #multiForm .loseMain {
    background-color: #fff;
  }
  .thingType {
    position:relative;
    &:before {
      content: " ";
      position: absolute;
      top: 0;
      width: 92%;
      height: 1px;
      border-top: 1px solid #D9D9D9;
      color: #D9D9D9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      left: 15px;
    }
  }
  #multiForm .unitRep {
    margin-bottom: 4em;
    .gs-caret-down:before , .gs-caret-up:before{
      position: absolute;
      top: 0em;
      right: 0.5em;
      z-index: 1;
      font-size: 30px;
      color: #ddd;
    }
    .add-info {
      background-color: #fff;
    }
  }
  .positionBtn {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #ededed;
    padding: 10px;
    z-index: 99;
    box-sizing: border-box;
  }
  #multiForm .vux-popup-picker-select , .weui-input{
    text-align:right;
  }
  .ma-bottom .weui-input{
    box-sizing: border-box;
    padding-right: 1em;
  }
  .cellLose .weui-input{
    box-sizing: border-box;
    padding-right: 3em;
  }
  #multiForm .img-box {
    margin: 10px 0 0 10px;
  }

  .weui-label {
    width: 5.5em !important;
  }
  .weui-cell p {

  }
  div.lose {

    position: relative;
  }
  div.lose span {
    position: absolute;
    top: 0.6em;
    right: 1em;
  }
  div.lose .vux-x-input:after , .sub-title:after {
    content: " ";
    position: absolute;
    top: 0;
    width: 92%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
  }
  .sub-title {
    padding: 10px 25px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .square-o span:first-child {
    margin-left: 7px;
  }
  .add-round {
    background: #EDEDED;
  }

  .ma-bottom {
    overflow: hidden;
  }
  .weui-cells .weui-cell_access .weui-cell__ft {
    text-align: right;
    padding-right: 1em;
  }
  #multiForm .weui-cells__title{
    background: transparent;
    color: #666;
    font-size: 1em;
    text-align: left;
    padding-left: 1.5em;
    margin: 0.5em 0;
  }

  #multiForm .square-o{
    background: #C0DEED;
    margin: 0;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    padding: 0px 10px;
    text-align: left;
  }
  #multiForm .weui-cell::before {
    content: " ";
    position: absolute;
    top: 0;
    width: 92%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
  }
  .vux-cell-box:not(:first-child):before {
    width: 92% !important;
  }
  .vux-x-input:not(:first-child):after ,.vux-datetime:not(:first-child):after {
    content: " ";
    position: absolute;
    top: 0;
    width: 92%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
  }
  #multiForm .vux-x-textarea:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  #multiForm .vux-x-textarea:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
</style>
<script>
  import {
    Cell,
    XInput,
    XTextarea,
    Group,
    XButton,
    Box,
    PopupPicker
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl, pageUtils } from '../../utils/common'
  import AttachUpload from '../mycomponents/AttachUpload'
  import OrgCheckList from '../inforeport/commoncompents/OrgCheckList'

  // 启用请求组件
  Vue.use(VueResource)

  export default {
    name: 'AnnouncementAdd',
    // 数据模型
    data() {
      return {
        attachs: [],
        scrollTop: 0,
        submitStatus: false,
        orgClass: 'gs-plus-square-o',
        otherClass: 'gs-plus-square-o',
        data: {},
        transactUserName: [],
        isExpandOrg: false,
        isExpandInfo: false,
        imgMaxSum: '3',
        serverIds: [],
        loadingShow: false,
        loadText: ''
      }
    },
    // 组件
    components: {
      Cell,
      XInput,
      XTextarea,
      Group,
      XButton,
      Box,
      PopupPicker,
      AttachUpload,
      OrgCheckList
    },
    computed: {
      members: { // 领导ID数组
        get() {
          return this.$store.state.leaderList
        },
        set() {
          this.$store.state.leaderList = []
        }
      },
      orgs: { // 机构code数组
        get() {
          return this.$store.state.selectedOrgList
        },
        set() {
        }
      },
      orgNames() {
        const orgList = this.$store.state.orgList
        let text = ''
        const o = this.orgs[0]
        orgList.forEach(({ orgCode, orgName }) => {
          if (orgCode === o) {
            text = orgName
            if (this.orgs.length > 1) {
              text = `${text}等${this.orgs.length}个单位`
            }
          }
        })
        return text
      },
      userNames() {
        // const leaderList = this.$store.state.allUser
        let text = ''
        const o = this.members[0]
        if (!this.$store.state.allUser) {
          return ''
        }
        this.$store.state.allUser.forEach(({ key, value }) => {
          if (key === o) {
            text = value
            if (this.members.length > 1) {
              text = `${text}等${this.members.length}人`
            }
          }
        })
        return text
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.$store.commit('setHeaderTitle', '新增通知公告')  // 设置头部文字
      })
    },
    beforeRouteLeave(to, from, next) {
      if (to.name !== 'LeaderSelect' && to.name !== 'OrgSelect') { // 领导选择允许跳页
        this.$store.commit('resetSelectedOrgList')
        next()
      } else {
        next()
      }
    },
    // vue实例挂着后调用
    mounted() {

    },
    created() {
    },
    watch: {
      data(old) {
        this.saveData('AnnouncementAdd', old)
      }
    },
    // 定义方法区
    methods: {
      actionSuccess(attachId) {
        this.data.attachId = attachId
      },
      // 存储data
      saveData(name, obj) {
        pageUtils.setlocalStorage(name, obj)
      },
      /**
       *初始化页面
       */
      initData() {
        this.data = {}
        this.attachs = []
      },
      setData() {
        const that = this
        that.data.transactOrgName = this.orgs
        that.data.transactUserName = this.members
        return that.data
      },
      submits() {
        pageUtils.deletlocalStorage('AnnouncementAdd')
        this.data.title = ''
        this.data.opinionContent = ''
        this.members = []
        this.$store.commit('resetSelectedOrgList')
        // this.init()
      },
      validation(val) {
        if (!val.title || !val.title.trim()) {
          this.$vux.toast.text('请输入信息标题', 'middle')
          // this.alertShow('请输入信息标题')
          this.submitStatus = false
          return false
        } else if (!val.opinionContent) {
          this.$vux.toast.text('请输入情况描述', 'middle')
          // this.alertShow('请输入情况描述')
          this.submitStatus = false
          return false
        } else if (val.transactOrgName.length === 0 && val.transactUserName.length === 0) {
          this.$vux.toast.text('请选择接收单位或者接收人', 'middle')
          this.submitStatus = false
          return false
        }
        this.submitStatus = true
        return true
      },
      //
      reportEvent() {
        const that = this
        const data = this.setData()
        if (!this.validation(data)) return
        const URL = `${siteUrl}/eventdispose/createNotice`
        this.$vux.confirm.show({
          title: '确认发布？',
          content: '',
          onConfirm() {
            that.$http.post(URL, data).then((response) => {
              if (response.body.code === 200) {
                that.$vux.toast.text('发布成功', 'middle')
                that.initData()
                that.$store.commit('resetLeaderList')
                that.$store.commit('resetSelectedOrgList')
                that.$router.go(-1)
              } else {
                that.$vux.toast.text(response.body.message, 'middle')
              }
            })
          }
        })
      },
      // 选择机构
      chooseOrg() {
        this.$router.push({
          name: 'OrgSelect',
          params: {
            maxLength: 100
          }
        })
      },
      // 选择用户
      chooseUser() {
        this.$router.push({
          name: 'LeaderSelect',
          params: {
            leaderType: '3',
            maxLength: 10
          }
        })
      }
    }
  }
</script>
