<!--
地图坐标拾取组件
默认从上一个界面读取坐标参数到该界面上

-->
<template>
  <div>
    <div id="mapDiv">
      <vue-map-search
        :center="center"
        appkey="8a7b9aac0db21f9dd995e61a14685f05"
        :ssl="true"
        :searchExtent="searchExtent"
        :autoCenter="isEdit"
        :xyChange="whenChange">
      </vue-map-search>
    </div>
    <group id="infos">
      <box class="position-box" v-show="isEdit">
        <popup-picker title="行政区划："
                      class="district-select"
                      :data="distList"
                      :columns="1"
                      v-model="distCodeArr"
                      @on-change="distChange"
                      show-name
        ></popup-picker>
        <x-textarea placeholder="请输入具体位置信息" ref="addrArea" v-model='address' @on-focus="infoFoucs"></x-textarea>
        <x-button type="theme" class="button" @click.native="closeMap">确定</x-button>
      </box>
      <box class="position-box" v-show="!isEdit">
        {{address}}
      </box>
    </group>
  </div>
</template>
<style lang="less" scoped>
  #mapDiv{
    width: 100%;
    // height: 413px;
    height: 100%;
  }
  .position-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #ededed;
    z-index: 99;
    .district-select{
      background: #ffffff;
    }
  }
</style>
<script>
  import { Box, Group, XButton, XTextarea, PopupPicker } from 'vux'
  import Vue from 'vue'
  import vueMapSearch from 'vue-map-search'
  import config from 'src/config'

  Vue.use(vueMapSearch)

  export default {
    name: 'GeolocationSelector',
    data() {
      return {
        distList: [
          {
            name: '江岸区',
            value: '420102',
            parent: 0
          }, {
            name: '江汉区',
            value: '420103',
            parent: 0
          }, {
            name: '硚口区',
            value: '420104',
            parent: 0
          }, {
            name: '汉阳区',
            value: '420105',
            parent: 0
          }, {
            name: '武昌区',
            value: '420106',
            parent: 0
          }, {
            name: '青山区(化工区)',
            value: '420107',
            parent: 0
          }, {
            name: '洪山区',
            value: '420111',
            parent: 0
          }, {
            name: '东西湖区',
            value: '420112',
            parent: 0
          }, {
            name: '武汉经济开发区(汉南区)',
            value: '420113',
            parent: 0
          }, {
            name: '蔡甸区',
            value: '420114',
            parent: 0
          }, {
            name: '江夏区',
            value: '420115',
            parent: 0
          }, {
            name: '黄陂区',
            value: '420116',
            parent: 0
          }, {
            name: '新洲区',
            value: '420117',
            parent: 0
          }, {
            name: '东湖开发区',
            value: '420118',
            parent: 0
          }, {
            name: '东湖风景区',
            value: '420119',
            parent: 0
          }, {
            name: '武汉新港',
            value: '420120',
            parent: 0
          }, {
            name: '长江新城',
            value: '420121',
            parent: 0
          }, {
            name: '其它',
            value: '420199',
            parent: 0
          }
        ],
        appKey: config.mapKey,
        center: [114.296350, 30.595510],
        x: 114.296350,
        y: 30.595510,
        searchExtent: [110.58838, 29.25286, 118.09204, 31.98012],
        isEdit: true,
        address: '',
        centerLocation: { // 地图中心点位置
          x: 114.296350, // 经度
          y: 30.595510
        },
        distCode: '',
        distCodeArr: [],
        county: '',
        isAddPage: false // 是否从新增页面进来的
      }
    },
    created() {
    },
    computed: {
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.x = vm.$store.state.gisLocation.x
        vm.y = vm.$store.state.gisLocation.y
        vm.searchExtent = vm.$store.state.gisLocation.searchExtent
        vm.center = [vm.x, vm.y]
        vm.isEdit = vm.$store.state.gisLocation.isEdit
        vm.address = vm.$store.state.gisLocation.address
        vm.county = vm.$store.state.gisLocation.county
        vm.distCode = vm.$store.state.gisLocation.distCode
        vm.distCodeArr = [vm.distCode]
        vm.isAddPage = false
        if (from.name === 'AddInfo') {
          vm.isAddPage = true
          if (vm.$store.state.isMapInit) { // 地图已经初始化过 手动initMap
            vm.initMap()
          }
          vm.$store.commit('setIsRefresh', false)
        }
      })
    },
    mounted() {
    },
    components: {
      Box,
      Group,
      XButton,
      XTextarea,
      PopupPicker
    },
    methods: {
      // 文本聚焦的时候
      infoFoucs() {
        setTimeout(() => {
          document.activeElement.scrollIntoView()
        }, 0)
      },
      distChange() {
        // const valArr = val
        // const dist = this.distCode
        this.distList.forEach((value) => {
          // 判断在自己选择行政区划的时候同时改变区划的值
          if (this.distCodeArr[0] === value.value) {
            this.county = value.name
          }
        })
        this.distCode = this.distCodeArr[0]
      },
      // 关闭组件
      closeMap() {
        // 到时候在这个里面加入 regionCode区域的code
        const gisLocation = {
          x: this.centerLocation.x,
          y: this.centerLocation.y,
          address: this.address,
          distCode: this.distCode,
          county: this.county
        }
        this.$store.commit('setGisLocation', gisLocation)
        this.$store.commit('setLocation', {
          isReset: true
        })
        this.$router.go(-1)
      },
      whenChange(res) {
        // 等添加行政区划 regionCode区域的code
        if (res.type === 'success') {
          this.centerLocation.x = Number(res.coordinate.x)
          this.centerLocation.y = Number(res.coordinate.y)
          if (res.opts && res.opts.address) {
            if (res.opts.county) {
              this.county = res.opts.county
              this.address = res.opts.name
              this.distCode = res.opts.distCode
              const dist = this.distCode
              this.distList.forEach((value) => {
                if (dist === value.value) {
                  this.distCodeArr = [dist]
                }
              })
            } else {
              this.address = `武汉市${res.opts.name}`
            }
          }
        } else if (res.type === 'center') {
          this.centerLocation.x = Number(res.coordinate.x)
          this.centerLocation.y = Number(res.coordinate.y)
        } else if (res.type === 'init') { // 地图初始化成功 调用本地初始化方法
          this.initMap()
        } else if (res.type === 'error') {
          this.$vux.toast.text('无法查到当前位置地名，请手动输入!', 'middle')
          this.center = [this.centerLocation.x, this.centerLocation.y]
          this.address = ''
          this.$refs.addrArea.focus()
        }
      },
      initMap() {
        if (!this.$store.state.location.isReset) { // 没有获取过位置信息
          this.$store.commit('setIsMapInit', true)
          this.$gsafety.startLoc((res) => {
            if (this.isAddPage) {
              this.center = [res.longitude, res.latitude]
            }
            this.$store.commit('setLocation', {
              x: res.longitude,
              y: res.latitude
            })
          })
        }
      }
    }
  }
</script>
