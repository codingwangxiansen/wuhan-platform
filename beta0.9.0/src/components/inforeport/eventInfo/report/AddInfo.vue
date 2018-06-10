<template>
  <div class="add-round">
    <form @submit.prevent="submit" id="multiForm">
      <group title="基本信息" titleColor="" class="ma-bottom">
        <x-input @on-change="saveData('AddInfo', data)" title="信息标题:" placeholder="例：某区发生火灾0人死亡0人受伤" :max="36" v-model='data.infoTitle' :show-clear="false" text-align="left"></x-input>
        <cell title="事发地点:" class="thingAddress gs-location" :value="shortAddress" @click.native="openGeolocationSelector"></cell>
        <cell class="thingType" :value="data.eventTypeName"  title="事件类型:" @click.native="chooseEventType()"></cell>
        <popup-picker @on-change="saveData('AddInfo', data)" class="thingLevel" title="事件等级:" placeholder="必填" :data="levelList" v-model="levelArr"></popup-picker>
        <time-controller
          dateTitle="事发日期:"
          timeTitle="事发时间:"
          @on-setTime="setTime"></time-controller>
      </group>
      <group title="情况描述">
        <x-textarea
          @on-change="saveData('AddInfo', data)"
          @on-blur="loseBlur(data.eventDescription)"
          v-model="data.eventDescription"
          :rows="5"
          placeholder="情况描述（必填）：（时间、地点、事情起因、经过处置情况）">
        </x-textarea>
      </group>
      <group title="附件上传" class="fileUpload">
        <attach-upload
          :attachs ="attachs"
          @on-action-success ="actionSuccess"
        >
        </attach-upload>
      </group>
      <box class="positionBtn">
        <x-button type="theme" >清空</x-button>
        <x-button type="default" @click.native="reportEvent" action-type="button">我要上报</x-button>
      </box>
    </form>
  </div>
</template>

<style lang="less" scoped>
  .addPop.vux-popup-dialog {
    background: #e2e2e2;
    > div {
      line-height: 40px;
      border-bottom: 1px solid #e2e2e2;
      text-align: center;
      background: #fff;
    }
    > div:nth-last-child(1) {
      border-bottom: none;
      margin-top: 5px;
    }
  }
  .fileUpload {
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
    width: 95%;
    background: #ededed;
    padding: 10px;
    z-index: 99;
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
  #multiForm .thingAddress {
    padding: 7px 15px;
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
    XInput,
    XTextarea,
    XAddress,
    PopupPicker,
    Group,
    Cell,
    Selector,
    Datetime,
    ChinaAddressData,
    XButton,
    XSwitch,
    Box,
    Popup
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl, pageUtils } from '../../../../utils/common'
  import AttachUpload from '../../../mycomponents/AttachUpload'
  import TimeController from '../../../mycomponents/TimeController'
  import EventTypeCell from '../../../gsafetycomponents/EventTypeCell'

  // 启用请求组件
  Vue.use(VueResource)

  export default {
    name: 'AddInfo',
    // 数据模型
    data() {
      return {
        noonShow: false,
        // 时间显不显示
        timeShow: false,
        Noon: [['上午', '下午', '其它']],
        // fileShow
        fileShow: false,
        scrollTop: 0,
        userTel: '',
        isSensitive: false,
        submitStatus: false,
        orgClass: 'gs-plus-square-o',
        otherClass: 'gs-plus-square-o',
        data: {},
        dataUser: {
          orgUser: {
            username: ''
          }
        },
        saveUrl: '',
        isExpandOrg: false,
        isExpandInfo: false,
        levelArr: [],
        attachs: [], // 附件信息
        maxFileSize: 30, // 文件的最大大小 单位M
        loadingShow: false,
        loadText: '',
        levelList: [['一般', '较大', '重大', '特别重大']],
        addressList: [['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区(化工区)', '洪山区', '蔡甸区', '江夏区', '东西湖区', '黄陂区', '新洲区', '东湖开发区', '武汉经济开发区(汉南区)', '东湖风景区', '武汉新港', '长江新城']],
        level: [{ code: '1', name: '特别重大' }, { code: '2', name: '重大' }, { code: '3', name: '较大' }, {
          code: '4',
          name: '一般'
        }, { code: '5', name: '其它' }],
        type: [{ code: '11000', name: '自然灾害' }, { code: '12000', name: '事故灾难' }, {
          code: '13000',
          name: '公共卫生事件'
        }, { code: '14000', name: '社会安全事件' }, { code: '10000', name: '突发事件' }]
      }
    },
    // 组件
    components: {
      XInput,
      XTextarea,
      XAddress,
      PopupPicker,
      ChinaAddressData,
      Group,
      Cell,
      Selector,
      Datetime,
      XButton,
      XSwitch,
      Box,
      AttachUpload,
      EventTypeCell,
      Popup,
      TimeController
    },

    computed: {
      // 与父组件通信用属性
      shortAddress: {
        get() {
          if (this.data.infoAddress) {
            if (this.data.infoCounty) {
              return this.data.infoCounty + this.data.infoAddress
            }
            return this.data.infoAddress
          }
          return '请选择位置'
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.$store.commit('setHeaderTitle', '新增突发事件信息')  // 设置头部文字
        if (from.name === 'AttachView') {
          return
        }
        if (from.name === 'bigImg') {
          return
        }
        vm.fileShow = false
        if (from.name) {
          if (from.name === 'eventTypeSelect') {
            const eventType = vm.$store.state.chooseEventType
            vm.$set(vm.data, 'eventTypeName', eventType.name)
            vm.data.eventType = eventType.code
            vm.data.eventTypeName = eventType.name
          } else if (from.name === 'GeolocationSelector') {
            if (vm.$store.state.gisLocation) {
              vm.$set(vm.data, 'infoAddress', vm.$store.state.gisLocation.address)
              vm.$set(vm.data, 'infoCounty', vm.$store.state.gisLocation.county)
              vm.$set(vm.data, 'longitude', vm.$store.state.gisLocation.x)
              vm.$set(vm.data, 'latitude', vm.$store.state.gisLocation.y)
              vm.$set(vm.data, 'distCode', vm.$store.state.gisLocation.distCode)
              vm.$store.commit('resetGisLocation')
            }
            vm.saveData('AddInfo', vm.data)
          } else {
            vm.init()
            vm.$store.commit('resetGisLocation') // 重置全局地理位置信息
            if (!pageUtils.getlocalStorage('AddInfo').infoAddress) {
              vm.$store.commit('resetLocation') // 重置当前地理位置信息
            }
          }
        } else {
          vm.init()
          vm.$store.commit('resetGisLocation') // 重置全局地理位置信息
          if (!pageUtils.getlocalStorage('AddInfo').infoAddress) {
            vm.$store.commit('resetLocation') // 重置当前地理位置信息
          }
        }
      })
    },
    // vue实例挂着后调用
    mounted() {

    },
    created() {
      this.dataUser = this.$store.state.user
    },
    watch: {
      data(old) {
        this.saveData('AddInfo', old)
      }
    },
    // 定义方法区
    methods: {
      // 设置时间数据
      setTime(val) {
        this.data.incidentDateStr = val.timeStr
        this.data.gmtMarker = val.gmtMarker
      },
      // 存储data
      saveData(name, obj) {
        pageUtils.setlocalStorage(name, obj)
      },
      loseBlur(str) {
        this.data.eventDescription = pageUtils.delectSpecial(str)
      },
      //  打开选择事件类型页面
      chooseEventType() {
        let code
        if (this.data.eventType) {
          code = this.data.eventType
        } else {
          code = ''
        }
        this.$store.commit('setChooseEventType', {
          code,
          name: this.data.eventTypeName ? this.data.eventTypeName : ''
        })
        this.$router.push({
          name: 'eventTypeSelect',
          params: {
            code,
            type: 'eventType'
          }
        })
      },
      /**
       *初始化页面
       */
      init() {
        // 通过 `vm` 访问组件实例
        this.levelArr = ['一般']
        this.saveUrl = `${siteUrl}/eventInfo/save`
        // 判断缓存中是否有这个字段，要不然组建那边会报错
        if (pageUtils.getlocalStorage('AddInfo')) {
          this.data = pageUtils.getlocalStorage('AddInfo')
        } else {
          this.data = {}
        }
        if (pageUtils.getlocalStorage('attachs')) {
          this.attachs = pageUtils.getlocalStorage('attachs')
          if (this.attachs.length) {
            const attachID = []
            this.attachs.forEach((attach) => {
              attachID.push(attach.id)
            })
            this.data.attachId = attachID
          }
        } else {
          this.attachs = []
          this.data.attachId = []
        }
      },
      /*
       *打开GeolocationSelector
       */
      openGeolocationSelector() {
        const g = {
          x: this.data.longitude ? this.data.longitude : 114.296350,
          y: this.data.latitude ? this.data.latitude : 30.595510,
          isEdit: true,
          address: this.data.infoAddress,
          county: this.data.infoCounty,
          distCode: this.data.distCode ? this.data.distCode : 420102
        }
        this.$store.commit('setGisLocation', g)
        this.$router.push('/deal/GeolocationSelector')
      },
      setData() {
        const that = this
        Array.from(this.level, (x) => {
          if (x.name === this.levelArr[0]) {
            that.data.eventLevelCode = x.code
          }
          return false
        })
        return that.data
      },
      actionSuccess(attachId) {
        this.data.attachId = attachId
      },
      submit() {
        pageUtils.deletlocalStorage('AddInfo')
        pageUtils.deletlocalStorage('attachs')
        this.init()
      },
      validation(val) {
        if (!val.infoTitle || !val.infoTitle.trim()) {
          this.$vux.toast.text('请输入信息标题', 'middle')
          // this.alertShow('请输入信息标题')
          this.submitStatus = false
          return false
        } else if (val.infoTitle.length < 8) {
          this.$vux.toast.text('信息标题不能少于8个字', 'middle')
          // this.alertShow('请输入信息标题')
          this.submitStatus = false
          return false
        } else if (val.infoTitle.length < 8) {
          this.$vux.toast.text('标题字数不能少于8个字!', 'middle')
          return false
        } else if (!val.latitude && !val.longitude) {
          this.$vux.toast.text('请选择事发地点', 'middle')
          // this.alertShow('请选择位置定位')
          this.submitStatus = false
          return false
        } else if (!val.eventType) {
          this.$vux.toast.text('请选择事件类型', 'middle')
          // this.alertShow('请选择事发类型')
          this.submitStatus = false
          return false
        } else if (!val.eventLevelCode) {
          this.$vux.toast.text('请选择事件等级', 'middle')
          // this.alertShow('请选择事件等级')
          this.submitStatus = false
          return false
        } else if (!val.incidentDateStr || val.incidentDateStr.indexOf('undefined') > 0) {
          this.$vux.toast.text('请选择事发时间', 'middle')
          // this.alertShow('请选择事发时间')
          this.submitStatus = false
          return false
        } else if (!val.eventDescription) {
          this.$vux.toast.text('请输入情况描述', 'middle')
          // this.alertShow('请输入情况描述')
          this.submitStatus = false
          return false
        } else if (val.eventDescription.length < 30) {
          this.$vux.toast.text('情况描述字数不能少于30字!', 'middle')
          return false
        }
        this.submitStatus = true
        return true
      },
      expandOther() {
        this.isExpandInfo = !this.isExpandInfo
        if (this.isExpandInfo) {
          this.otherClass = 'gs-minus-square-o'
        } else {
          this.otherClass = 'gs-plus-square-o'
        }
      },
      expandOrg() {
        this.isExpandOrg = !this.isExpandOrg
        if (this.isExpandOrg) {
          this.orgClass = 'gs-minus-square-o'
        } else {
          this.orgClass = 'gs-plus-square-o'
        }
      },
      //
      reportEvent() {
        const that = this
        const data = this.setData()
        if (!this.validation(this.setData())) return
        const URL = `${siteUrl}/eventInfo/sendsave`
        this.$vux.confirm.show({
          title: '确认上报？',
          content: '',
          onConfirm() {
            that.$http.post(URL, data).then((response) => {
              if (response.body.code === 200) {
                // that.$router.push(`/report/addInfoTarget/${response.body.response.eventInfoId}`)
                const url = `${siteUrl}/eventdispose/report`
                that.data.mainObjectId = response.body.response
                that.$http.post(url, that.data).then((res) => {
                  if (res.status === 200) {
                    // 新增消息之后，回到列表页是要刷新的
                    that.$store.commit('setListRefresh', true)
                    that.$vux.toast.text('上报成功', 'middle')
                    pageUtils.deletlocalStorage('AddInfo')
                    pageUtils.deletlocalStorage('attachs')
                    that.$router.go(-1)
                  }
                }, () => {
                  that.$vux.confirm.hide()
                  that.$vux.toast.text('操作失败', 'middle')
                  // that.alertShow('操作失败')
                })
              } else {
                that.$vux.toast.text(response.body.message, 'middle')
                // that.alertShow(response.body.message)
              }
            }, () => {
              // that.alertShow('操作失败')
              that.$vux.toast.text('操作失败', 'middle')
              that.$vux.confirm.hide()
            })
          }
        })
      }
    }
  }
</script>
