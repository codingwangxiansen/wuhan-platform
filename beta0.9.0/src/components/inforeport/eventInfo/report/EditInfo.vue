<template>
  <div class="ma-round edit-round">
    <form @submit.prevent="submit" id="multiForm">
      <group title="基本信息" titleColor="" class="ma-bottom">
        <x-input title="信息标题:" placeholder="必填" v-model='data.infoTitle' :show-clear="false" text-align="left" :max="36"></x-input>
        <!--<cell class="thingType" :value="data.distName"  title="事发地区:" @click.native="chooseDistrict()"></cell>-->
        <!-- <popup-picker class="addr" title=":"  placeholder="必填" :data="addressList" v-model="addressArr"></popup-picker> -->
        <cell class="local" title="事发地点:" :value="shortAddress" @click.native="openGeolocationSelector"></cell>
        <!--<x-input title="经度:" v-model='data.longitude' :show-clear="false"></x-input>
        <x-input title="纬度:" v-model='data.latitude' :show-clear="false"></x-input>-->
        <!-- <event-type-cell :options="{title:'事件类型',placeholder:'请选择事件类型',columns:1}" v-model="data.eventType"></event-type-cell> -->
        <cell class="thingType" :value="data.eventTypeName"  title="事件类型:" @click.native="chooseEventType()"></cell>
        <popup-picker title="事件等级:" placeholder="必填" :data="levelList" v-model="levelArr"></popup-picker>
        <time-controller @on-setTime="setTime"
                         dateTitle="事发日期:"
                         timeTitle="事发时间:"
                         :gmtMarker = "data.gmtMarker"
                         :timeData="data.incidentDateStr">
        </time-controller>
      </group>
      <group title="情况描述">
		    <x-textarea v-model="data.eventDescription" :rows="3" placeholder="情况描述(必填)"></x-textarea>
      </group>
      <group title="附件上传" class="fileUpload">
        <attach-upload
          :attachs ="attachs"
          @on-action-success ="actionSuccess"
        >
        </attach-upload>
      </group>
      <box class="positionBtn">
      	<x-button type="default">保存草稿</x-button>
      	<x-button type="theme" @click.native="reportEvent" action-type="button">我要上报</x-button>
      </box>
    </form>
  </div>
</template>

<style lang="less" scpoed>
  @import "../../../../styles/common.less";
  .fileUpload {
    margin-bottom: 60px;
  }
  .local .weui-cell__ft {
    padding-left: 16px;
  }
  #multiForm .weui-input{
    box-sizing: border-box;
    color: #aaacb2;
  }
  #multiForm .img-box {
    margin: 10px 0 0 10px;
  }
  .unitRep{
    margin-bottom: 8em;
  }
  .positionBtn {
    position: fixed;
    bottom: 0;
    width: 95%;
    background: #ededed;
    padding: 10px;
    z-index: 99;
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
  .weui-label {
    width: 5.5em !important;
  }
  .weui-cell p {

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


  .ma-round {
    background: #EDEDED;
  }

  .ma-bottom {
    margin-bottom: 15px;
    overflow: hidden;
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
    ConfirmPlugin,
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
    Box
  } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import AttachUpload from '../../../mycomponents/AttachUpload'
  import TimeController from '../../../mycomponents/TimeController'
  import EventTypeCell from '../../../gsafetycomponents/EventTypeCell'

  // 启用请求组件
  Vue.use(VueResource)
  Vue.use(ConfirmPlugin)

  export default {
    // 数据模型
    data() {
      return {
        fileShow: false,
        submitStatus: false,
        orgClass: 'gs-plus-square-o',
        otherClass: 'gs-plus-square-o',
        data: {},
        dataUser: {
          orgUser: {
            username: ''
          }
        },
        attachs: [], // 附件信息
        saveUrl: '',
        isExpandOrg: false,
        isExpandInfo: false,
        levelArr: [],
        imgMaxSum: '3',
        maxFileSize: 30, // 文件的最大大小 单位M
        loadingShow: false,
        loadText: '',
        levelList: [['特别重大', '重大', '较大', '一般']],
        addressList: [['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区']],
        level: [{ code: '1', name: '特别重大' }, { code: '2', name: '重大' }, { code: '3', name: '较大' }, {
          code: '4',
          name: '一般'
        }, { code: '5', name: '其它' }],
        address: [{ code: '420102', name: '江岸区' }, { code: '420103', name: '江汉区' }, {
          code: '420104',
          name: '硚口区'
        }, { code: '420105', name: '汉阳区' },
          { code: '420106', name: '武昌区' }, { code: '420107', name: '青山区' }, { code: '420111', name: '洪山区' }, {
            code: '420112',
            name: '东西湖区'
          },
          { code: '420113', name: '汉南区' }, { code: '420114', name: '蔡甸区' }, { code: '420115', name: '江夏区' }, {
            code: '420116',
            name: '黄陂区'
          }, { code: '420117', name: '新洲区' }],
        type: [{ code: '11000', name: '自然灾害' }, { code: '12000', name: '事故灾难' }, {
          code: '13000',
          name: '公共卫生事件'
        }, { code: '14000', name: '社会安全事件' }, { code: '10000', name: '突发事件' }]
      }
    },

    // 组件
    components: {
      ConfirmPlugin,
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
      TimeController
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.fileShow = false
        vm.$store.commit('setHeaderTitle', '信息编辑')  // 设置头部文字
        if (from.name === 'AttachView') {
          return
        }
        if (from.name === 'bigImg') {
          return
        }
        if (from.name === 'eventTypeSelect') {
          const eventType = vm.$store.state.chooseEventType
          vm.$set(vm.data, 'eventTypeName', eventType.name)
          vm.data.eventType = eventType.code
          vm.data.eventTypeName = eventType.name
        } else if (from.name === 'GeolocationSelector') {
          if (vm.$store.state.gisLocation) {
            vm.$set(vm.data, 'infoAddress', vm.$store.state.gisLocation.address) // 修改对象里面的数据
            vm.$set(vm.data, 'distCodeName', vm.$store.state.gisLocation.county) // 修改对象里面的数据
            vm.$set(vm.data, 'longitude', vm.$store.state.gisLocation.x)
            vm.$set(vm.data, 'latitude', vm.$store.state.gisLocation.y)
            vm.$set(vm.data, 'distCode', vm.$store.state.gisLocation.distCode)
            vm.$store.commit('resetGisLocation')
          }
        } else {
          // 通过 `vm` 访问组件实例

          if (from.name === 'AttachView') {
            return
          }
          vm.id = vm.$router.history.current.params.id
          vm.levelArr = []
          if (vm.id) {
            // 更新
            vm.data.infoId = vm.id
            vm.getEventBase()
            vm.saveUrl = `${siteUrl}/eventInfo/update`
          }
        }
      })
    },
    // vue实例创建后调用
    created() {
    },
    computed: {
      shortAddress: {
        get() {
          if (this.data.infoAddress) {
            if (this.data.distCodeName) {
              return this.data.distCodeName + this.data.infoAddress
            }
            return this.data.infoAddress
          }
          return '暂无事件位置'
        }
      }
    },
    watch: {},
    // 定义方法区
    methods: {
      // 设置时间数据
      setTime(val) {
        this.data.incidentDateStr = val.timeStr
        this.data.gmtMarker = val.gmtMarker
      },
      // 附件上传
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
      getEventBase() {
        const that = this
        const URL = `${siteUrl}${this.$REST.EventInfo.VIEW}/${this.id}`
        this.$http.get(URL).then(
          function (response) {
            that.$store.dispatch('hidePageLoading')
            if (response.body.code === 200) {
              this.data = response.body.response
              this.dataUser = {
                orgName: this.data.reportOrgName,
                orgUser: {
                  username: this.data.reportPerson,
                  mobileTel: this.data.reportPersonPhone
                }
              }
              this.levelArr.push(this.data.eventLevelName)
              if (this.data.attachs) {
                this.attachs = JSON.parse(this.data.attachs)
                if (this.attachs.length) {
                  const attachID = []
                  this.attachs.forEach((attach) => {
                    attachID.push(attach.id)
                  })
                  this.data.attachId = attachID
                } else {
                  this.data.attachId = []
                }
              }
            }
          })
      },
      /* 打开GeolocationSelector */
      openGeolocationSelector() {
        const g = {
          x: this.data.longitude,
          y: this.data.latitude,
          type: '',
          address: this.data.infoAddress,
          county: this.data.distCodeName,
          distCode: this.data.distCode ? this.data.distCode : 420102
        }
        this.$store.commit('setGisLocation', g)
        this.$router.push('/deal/GeolocationSelector')
      },
      openEventTypeChose() {
        this.$router.push('/deal/eventTypeChose')
      },
      actionSuccess(attachId) {
        this.data.attachId = attachId
      },
      submit() {
        const that = this
        Array.from(this.level, (x) => {
          if (x.name === this.levelArr[0]) {
            that.data.eventLevelCode = x.code
          }
          return false
        })
        const data = that.data
//        distCode
        console.log(data)
        console.log('...............')
        if (this.validation(data)) {
          this.$vux.confirm.show({
            title: '确认保存？',
            content: '',
            onConfirm() {
              that.$http.post(that.saveUrl, data).then((response) => {
                console.log(response)
                if (response.body.code === 200) {
                  that.$router.go(-1)
                  // that.alertShow('保存成功')
                  that.$vux.toast.text('保存成功', 'middle')
                  that.$vux.confirm.hide()
                } else if (response.body.message) {
                  that.$vux.toast.text(response.body.message, 'middle')
                  that.alertShow(response.body.message)
                }
              }, () => {
                // that.alertShow('操作失败')
                that.$vux.toast.text('操作失败', 'middle')
                that.$vux.confirm.hide()
              })
            }
          })
        }
      },
      validation(val) {
        if (val.eventDescription.length < 30) {
          this.$vux.toast.text('情况描述字数不能少于30字!', 'middle')
          this.submitStatus = false
          return false
        } else if (val.infoTitle.length < 8) {
          this.$vux.toast.text('信息标题字数不能少于8字!', 'middle')
          this.submitStatus = false
          return false
        } else if (!val.distCode) {
          this.$vux.toast.text('行政区划不能为空', 'middle')
          this.submitStatus = false
          return false
        }
        this.submitStatus = true
        return true
      },
      // 上报
      reportEvent() {
        const that = this
        Array.from(this.level, (x) => {
          if (x.name === this.levelArr[0]) {
            that.data.eventLevelCode = x.code
          }
          return false
        })
        const data = that.data
        this.validation(data)
        const URL = `${siteUrl}/eventInfo/sendsave`
        console.log(data)
        this.$vux.confirm.show({
          title: '确认上报？',
          content: '',
          onConfirm() {
            that.$http.post(URL, data).then((response) => {
              console.log(response)
              console.log(response.body.response)
              // that.$router.push(`/report/addInfoTarget/${response.body.response.eventInfoId}`)
              const url = `${siteUrl}/eventdispose/report`
              that.data.mainObjectId = response.body.response
              that.$http.post(url, that.data).then((res) => {
                console.log(res)
                if (res.status === 200) {
                  // that.alertShow('上报成功')
                  that.$vux.toast.text('上报成功', 'middle')
                  that.$router.go(-1)
                }
              }, () => {
                that.$vux.confirm.hide()
                // that.alertShow('操作失败')
                that.$vux.toast.text('操作失败', 'middle')
              })
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
