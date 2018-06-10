<!--
	呈报领导场景,用户选择几个主要呈报机构、领导，编辑内容后上报

	页面可以新增领导批示意见

	用户选择机构，点击转办后发送给对应机构
 -->
<template>
  <div>
    <box gap="10px 10px">
      <info-item
        :isEdit="edit"
        :data="eventBase"
        @showFullScreen="showFullScreen"
      ></info-item>
      <x-button type="default" @click.native="saveBeInfo">保存</x-button>
      <x-button mini type="warn" @click.native="goBack">取消</x-button>
    </box>
  </div>
</template>
<style lang="less" scoped>
  @import "./../../../../styles/common.less";
  .error {
    padding-left: 15px;
    line-height: 28px;
    color: #888;
    font-size: 12px;
  }
  .unit {
    height:200px;
    overflow-y: scroll;
  }
  .leader {
    height:200px;
    overflow-y: scroll;

  }
</style>

<script>
  import {
    ConfirmPlugin,
    Tab,
    TabItem,
    XInput,
    XTextarea,
    Cell,
    Group,
    Checklist,
    XButton,
    Datetime,
    Flexbox,
    FlexboxItem,
    Tabbar,
    TabbarItem,
    Popup,
    Box,
    Divider,
    CellBox
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
//  import VueRouter from 'vue-router'
  import { siteUrl } from './../../../../utils/common'
  import InfoItem from './../../commoncompents/InfoItem.vue'
  import InstructTimeline from './InstructTimeline.vue'
  import InstructImport from './InstructImport.vue'
  import LeaderSelector from './../../../gsafetycomponents/LeaderSelector'

  // 启用请求组件
  Vue.use(VueResource)
  Vue.use(ConfirmPlugin)

  export default {
    // 数据模型
    data() {
      return {
        edit: true,
        fullValues: [],
        labelPosition: '',
        error: '',
        selectOrgList: [],
        selectLeadList: [],
        selectInstrLeadList: [],
        comment: '',
        id: '',
        showV: false,
        showBtn: false,
        showCheckPopup: false,
        p1: '',
        status: '',
        showButton: '',
        title: '',
        user: [],
        currentItem: '',
        showinfo: true,
        showinstr: false,
        showDetail: false,
        showComment: false,
        leadMessage: '', // 领导批示内容
        expandImg: 'gs-plus-square-o',
        leaders: [],
        instru: {
          content: '',
          smsNotice: '1',
          weixinNotice: '1'
        },
        beInfo: {
          instructionUsername: '',
          instructionTimeStr: '',
          instructionContent: ''
//          attachs: [{
//            name: '交通事故处理法则第二版.doc'
//          }]
        },
        instructionId: '',
        leaderId: '',
        eventBase: {
          infoId: '',
          infoTitle: '',
          infoAddress: '',
          eventTypeName: '',
          incidentDateStr: '',
          reportDateStr: '',
          eventDescription: '',
          eventMeasures: '',
          reportPerson: '',
          reportPersonPhone: '',
          org: {
            orgName: ''
          },
          checkPerson: '',
          opinion: ''
        },
        checkList: [
          {
            handleUserName: '',
            handleMsg: ''
          }
        ],
        instList: [],
        finishEvent: {},
        isExpandCheck: false,
        submitStatus: false,
        addInstruFlag: false,
        isEdit: false,
        record: {},
        supRecord: {},
        sub: {
          applyRrecord: [],
          applyRecordDtos: []
        },
        sup: {
          applyRrecord: [],
          applyRecordDtos: []
        },
        checkMessage: ''
      }
    },
    // 组件
    components: {
      ConfirmPlugin,
      Tab,
      TabItem,
      XInput,
      XTextarea,
      Cell,
      Group,
      Checklist,
      InfoItem,
      InstructTimeline,
      InstructImport,
      XButton,
      Datetime,
      Flexbox,
      FlexboxItem,
      Tabbar,
      TabbarItem,
      Popup,
      Box,
      Divider,
      CellBox,
      LeaderSelector
    },
    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
          vm.$store.commit('setHeaderTitle', '信息办理')  // 设置头部文字
          vm.fetchData()
        }
      )
    },
    // vue实例创建后调用
    created() {
      this.id = this.$router.history.current.params.id
      this.status = this.$router.history.current.params.status
      this.getData('detailInfo', this.id)
      this.show(this.status)
    },
    watch: {
      // '$route': 'fetchData'
    },
    methods: {
      goBack() {
        window.history.go(-1)
      },
      fetchData() {
        this.id = this.$router.history.current.params.id
        this.getData('detailInfo', this.id)
        this.getEventBase(this.id)
      },
      cancel() {
        this.showV = false
      },
      toCancel() {
        this.showCheckPopup = false
      },
      commit() {
        const url = `${siteUrl}/eventdispose/propose`
        const data = {
          mainObjectId: this.id,
          handleUser: this.selectLeadList.join(','),
          opinionContent: this.p1
        }
        const vm = this
        this.$vux.confirm.show({
          title: '确认送审？',
          content: '',
          onConfirm() {
            vm.$http.post(url, data).then(() => {
              // 返回码不正确时直接结束
              vm.showV = false
            })
          }
        })
      },
      toCheck() {
        const vm = this
        this.$vux.confirm.show({
          title: '确认提交审核意见？',
          content: '',
          onConfirm() {
            const url = `${siteUrl}/eventdispose/check`
            const data = {
              handleMsg: vm.checkMessage,
              mainObjectId: vm.id,
              handleStatus: '1'
            }
            vm.$http.post(url, data).then(() => {
              // 返回码不正确时直接结束
              vm.showCheckPopup = false
            })
          }
        })
      },
      //
      leaderCommit() {
        const vm = this
        this.$vux.confirm.show({
          title: '确认提交批示？',
          content: '',
          onConfirm() {
            const url = `${siteUrl}/eventdispose/instruct`
            const data = {
              mainObjectId: vm.id,
              instructionUserId: vm.selectInstrLeadList[0],
              instructionContent: vm.leadMessage,
              flag: '2'
            }
            vm.$http.post(url, data).then(() => {
              // 返回码不正确时直接结束
              vm.showComment = false
              this.$refs.importPanel.init()
            })
          }
        })
      },
//      change(val, label) {
//        console.log('change', val, label)
//      },
      init() {

      },
      reportSub() {
        const urlArr = location.href.split('/')
        const urlId = urlArr[urlArr.length - 1]
        const url = `${location.origin}${location.pathname}#/deal/sendLeader/${urlId}`
        const options = { url, actionBarType: 1 }
        if (this.$gsafety) {
          this.$gsafety.openWindow(options)
        }
      },
      Edit() {
        const urlArr = location.href.split('/')
        const urlId = urlArr[urlArr.length - 1]
        const url = `${location.origin}${location.pathname}#/deal/InstructEdit/${urlId}`
        const options = { url, actionBarType: 1 }
        if (this.$gsafety) {
          this.$gsafety.openWindow(options)
        }
      },
      getEventBase(val) {
        const that = this
        const URL = `${siteUrl}${this.$REST.EventInfo.VIEW}/${val}`
        this.$http.get(URL).then(function (response) {
          if (response.body.code === 200) {
            that.eventBase = response.body.response
            const dtos = that.eventBase.applyRecordDtos
            if (dtos) {
              const dtosValArr = Object.values(dtos)
              dtosValArr.forEach((value) => {
                that.checkList.push(value)
              })
            }
            if (that.eventBase.applyRrecord) {
              const recordValArr = Object.values(that.eventBase.applyRrecord)
              recordValArr.forEach((value) => {
                that.checkList.push(value)
              })
            }
            this.title = this.eventBase.infoTitle
            this.convertUsers(this.eventBase)
          }
        })
      },
      convertUsers(data) {
        // 主报
        const vm = this
        if (data.applyRrecord) {
          const recordValArr = Object.values(data.applyRrecord)
          recordValArr.forEach((value) => {
            if (value.userTypeCode === '1') {
              vm.sup.applyRrecord.push(value)
            } else {
              vm.sub.applyRrecord.push(value)
            }
          })
        }
        // 抄报
        if (data.applyRecordDtos) {
          const recordDtosValArr = Object.values(data.applyRecordDtos)
          recordDtosValArr.forEach((value) => {
            if (value.userTypeCode === '1') {
              vm.sup.applyRecordDtos.push(value)
            } else {
              vm.sub.applyRecordDtos.push(value)
            }
          })
        }
        vm.record = this.sub.applyRrecord[0]
        vm.supRecord = this.sup.applyRrecord[0]
      },
      getInstruInfo(val) {
        const that = this
        const URL = `${siteUrl}${this.$REST.INSTRUCT.VIEW}/${val}`
        this.$http.get(URL).then((response) => {
          console.log(response)
          if (response.body.code === 200) {
            if (response.body.response) {
              that.isEdit = true
              that.beInfo = response.body.response
              that.instructionId = that.beInfo.id
              that.leaderId = that.beInfo.instructionUserId
            }
          }
        })
      },
      getInstruList(val) {
        const that = this
        const URL = `${siteUrl}${this.$REST.INSTRUCT.LIST}/${val}`
        this.$http.get(URL).then((response) => {
          if (response.body.code === 200) {
            if (response.body.response) {
              that.instList = response.body.response
            }
          }
        })
      },
      convertUser(val) {
        let a = ''
        if (val) {
          if (val) {
            const valArr = Object.values(val)
            valArr.forEach((value) => {
              a += value
            })
          }
        }
        return a
      },
      getData(item, id) {
        this.checkList = []
        this.instructionId = ''
        const that = this
        // switch items
        const oldItem = that.currentItem
        that.currentItem = item
        that.changeTab(item)
        if (oldItem !== item) {
          this.attachs = []
          that.attachExist = false
        } else {
          return
        }
        if (item === 'instruInfo') {
          this.getInstruInfo(id)
        } else if (item === 'instr') {
          this.getInstruList(id)
        } else {
          this.getEventBase(id)
        }
      },
      chooseNoticeWay(keys) {
        console.log(keys)
        this.instru.smsNotice = '0'
        this.instru.weixinNotice = '0'
        const that = this
        if (keys) {
          const keyValArr = Object.values(keys)
          keyValArr.forEach((value) => {
            if (value === 'message') {
              that.instru.smsNotify = '1'
            }
            if (value === 'wechat') {
              that.instru.weixinNotify = '1'
            }
          })
        }
      },
      finish() {
        const that = this
        that.finishEvent.infoId = this.id
        that.finishEvent.finishNote = '移动端确认办结'
        const data = that.finishEvent
        const URL = siteUrl + this.$REST.EventInfo.FINISH
        this.$vux.confirm.show({
          title: '确认办结？',
          content: '',
          onConfirm() {
            that.$http.post(URL, data).then((response) => {
              if (response.body.code === 200) {
                this.$gsafety.closeWindow()
                that.$vux.toast.text('操作成功', 'middle')
                that.$vux.confirm.hide()
              }
            }, () => {
              that.$vux.toast.text('操作失败', 'middle')
              that.$vux.confirm.hide()
            })
          }
        })
      },
      saveBeInfo() {
        const that = this
        that.beInfo.instructionUserId = that.convertUser(this.user)
        that.beInfo.mainObjectName = 'EVENT_INFO'
        that.beInfo.mainObjectId = that.id
        that.beInfo.flag = '1'
        if (this.isEdit) {
          that.beInfo.id = that.instructionId
          that.beInfo.instructionUserId = that.leaderId
        }
        const data = that.beInfo
        const URL = siteUrl + this.$REST.INSTRUCT.SAVE
        console.log(data)
        this.$vux.confirm.show({
          title: '确认保存？',
          content: '',
          onConfirm() {
            that.$http.post(URL, data).then((response) => {
              console.log(response)
              if (response.body.code === 200) {
                this.$gsafety.closeWindow(response.body.code)
                that.$vux.toast.text('保存成功', 'middle')
                that.$vux.confirm.hide()
              }
            }, () => {
              that.$vux.toast.text('操作失败', 'middle')
              that.$vux.confirm.hide()
            })
          }
        })
        that.instructionId = ''
        that.leaderId = ''
      },
      validation(val) {
        if (!val.instructionContent) {
          this.$vux.toast.text('请输入批示内容！', 'middle')
        } else {
          this.submitStatus = true
        }
      },
      showPopup() {
        this.showV = true
      },
      showPopupBtn() {
        this.showBtn = true
      },
      showPopup1() {
        this.showCheckPopup = true
      },
      changeTab(item) {
        if (item === 'instruInfo') {
          this.showinfo = true
          this.showinstr = false
          this.showDetail = false
        } else if (item === 'instr') {
          this.showinstr = true
          this.showinfo = false
          this.showDetail = false
        } else {
          this.showinstr = false
          this.showinfo = false
          this.showDetail = true

          this.refreshTimeline() // 刷新时间轴
        }
      },
      expandCheck() {
        this.isExpandCheck = !this.isExpandCheck
        if (this.isExpandCheck) {
          this.expandImg = 'gs-minus-square-o'
        } else {
          this.expandImg = 'gs-plus-square-o'
        }
      },
      feedback(val) {
        const url = `${location.origin}${location.pathname}${this.$DEFAULT.INSTRUCT.VIEW}/${val}`
        const options = { url, actionBarType: 1, title: '批示通告' }
        if (this.$gsafety) {
          this.$gsafety.openWindow(options)
        }
      },
      addinstru() {
        this.addInstruFlag = true
      },
      show(val) {
        if (val === 7) {
          this.showButton = false
        } else {
          this.showButton = true
        }
      },

      saveinstru() {
        const that = this
        that.instru.instructionUserId = that.convertUser(this.leaders)
        that.instru.mainObjectName = 'EVENT_INFO'
        that.instru.mainObjectId = that.id
        that.instru.flag = '2'
        that.instru.needFeedback = '1'
        const data = that.instru
        const URL = siteUrl + this.$REST.INSTRUCT.SAVE
        console.log(data)
        this.$vux.confirm.show({
          title: '确认保存？',
          content: '',
          onConfirm() {
            that.$http.post(URL, data).then((response) => {
              if (response.body.code === 200) {
                this.$gsafety.closeWindow(response.body.code)
                that.$vux.toast.text('保存成功', 'middle')
                that.$vux.confirm.hide()
              }
            }, () => {
              that.$vux.toast.text('操作失败', 'middle')
              that.$vux.confirm.hide()
            })
          }
        })
        this.addInstruFlag = false
        this.instru.leaders = []
        this.instru.content = ''
      },
      /*
       * 刷新流程
       */
      refreshTimeline() {
        if (this.$refs.timelinePanel) {
          this.$refs.timelinePanel.init()
        }
      },
      showFullScreen(imgs) { // 全屏查看图片
        this.$emit('showFullScreen', imgs)
      }
    }
  }
</script>
