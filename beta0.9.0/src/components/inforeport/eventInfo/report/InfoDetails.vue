<template>
  <div class="multItem instruction">
    <div id="multiForm">
      <p class="tit">{{data.infoTitle}}</p>
      <!--常规信息-->
      <group title="基本信息" class="ma-bottom gs-list4">

        <div class="contain" v-show="infoShow">
          <x-input title="事件类型:" :readonly="flag" :placeholder="data.eventTypeName" :show-clear="false"></x-input>
          <cell title="事发地点:" class="eventAd" :value="shortAddress" @click.native="openGeolocationSelector"></cell>
          <!--<cell class="thingType" :value="data.distName"  title="事发地区:" @click.native="chooseDistrict()"></cell>-->
          <!-- <x-input title="事发地区:" :readonly="flag" :placeholder='data.distName' :show-clear="false"></x-input> -->
          <x-input title="事发等级:" :readonly="flag" :placeholder='data.eventLevelName' :show-clear="false"></x-input>
          <x-input title="事发时间:" :readonly="flag" :placeholder='data.incidentDateStr' :show-clear="false"></x-input>
          <x-input title="上报时间:" :readonly="flag" :placeholder='data.reportDateStr' :show-clear="false"></x-input>
        </div>
      </group>
      <group title="情况描述" class="desc gs-file-text2">
        <i class="icon" @click.prevent="fileContain = !fileContain" :class="fileContain ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
        <div class="fileContain" v-show="fileContain">
          <x-textarea v-if="!flag" v-show="isShowDesc" :autosize="autoText" v-model='data.eventDescription'></x-textarea>
          <div v-if="flag" v-show="isShowDesc" class="area">{{data.eventDescription}}</div>
        </div>
      </group>
      <div class="baseInfo">
        <group :title="fileTitle"  class="collpic gs-file-picture">
          <i class="icon" @click.prevent="expandFlag = !expandFlag" :class="expandFlag ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
          <div v-show="expandFlag">
            <attach-upload
              :attachs="attachs"
              :canUpload="false"></attach-upload>
          </div>
        </group>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
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
  .tit{
    text-align: center;
    margin: 15px 0;
  }
  #multiForm .img-box {
    margin: 10px 0 0 10px;
  }
  /*gs-list4*/
  #multiForm {
    .weui-cell {
      padding: 8px 15px;
      font-size: 14px;
    }
    &>div {
      border-bottom: 1px solid #e2e2e2;
      border-top: 1px solid #e2e2e2;
      position: relative;
      margin: 15px 0;
      .icon {
        position: absolute;
        top: 0;
        right: 15px;
        font-size: 30px;
        top: -35px;
        color: #333;
      }
    }
    .gs-list4:before {
      position: absolute;
      z-index: 9;
      font-size: 20px;
      color: #333;
      top: 12px;
      left: 8px;
    }
    .gs-file-text2:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 15px;
      left: 12px;
    }
    .gs-file-picture:before {
      position: absolute;
      z-index: 9;
      font-size: 15px;
      color: #333;
      top: 6px;
      left: 12px;
    }
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
  .title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    background: #fff;
    line-height: 2em;
    position: relative;
  }
  .detail-img {
    width: 125px;
    height: 125px;
    display: inline-block;
    margin-left: 0.5em;
  }
  .weui-cell:before {
    width: 92%;
  }
</style>
<script>
  import { Cell, Group, XInput, XTextarea } from 'vux'
  import config from 'src/config'
  import InfoItem from '../../commoncompents/InfoItem.vue'
  import AttachUpload from '../../../mycomponents/AttachUpload'// 附件上传组件


  export default {
    name: 'info-details',
    data() {
      return {
        fileContain: false,
        infoShow: true,
        autoText: true,
        readFlag: true,
        expandFlag: false,
        isShowDesc: true,
        attachs: [],
        id: '', // 信息id
        userId: '',
        data: {
          infoId: '',
          infoTitle: '',
          infoAddress: '',
          eventTypeName: '',
          incidentDateStr: '',
          reportDateStr: '',
          eventDescription: '',
          eventMeasures: '',
          eventLevelName: '',
          reportPerson: '',
          reportPersonPhone: '',
          org: {
            orgName: ''
          },
          checkPerson: '',
          opinion: '',
//          回复列表
          checkReplys: []
        }
      }
    },
    components: {
      InfoItem,
      Cell,
      Group,
      XInput,
      XTextarea,
      AttachUpload
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.id = vm.$route.params.id
        vm.$store.commit('setHeaderTitle', '信息查看') // 设置头部文字
        vm.fetchData() // 根据id获取数据详情
      })
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
      },
      flag() {
        if (this.isEdit) {
          return false
        }
        return this.readFlag
      }
    },
    methods: {
      // 加载初始化数据
      fetchData() {
        this.getEventBase(this.id)
        this.userId = this.$store.state.user.username
      },
      // 获取详情数据
      getEventBase(val) {
        const that = this
        const URL = `${config.siteUrl}${this.$REST.EventInfo.VIEW}/${val}`
        this.axios.getData(URL, '', (res) => {
          that.$store.dispatch('hidePageLoading')
          if (res.code === 200) {
            that.data = res.response
            if (this.data.attachExist) {
              this.attachs = JSON.parse(this.data.attachId)
            }
          }
        })
      },
      /* 打开GeolocationSelector */
      openGeolocationSelector() {
        const g = {
          x: this.data.longitude,
          y: this.data.latitude,
          address: this.data.infoAddress,
          county: this.data.distCodeName,
          isEdit: false
        }
        this.$store.commit('setGisLocation', g)
//      m.$store.state.gisLocation.isEdit
        this.$router.push('/deal/GeolocationSelector')
      },
      getAttachPath(item) {
        return config.fileServer + item
      }
    }
  }
</script>
