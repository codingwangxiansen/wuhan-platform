<template>
  <div class="warn-round">
    <form @submit.prevent="submit" id="multiForm">
      <group title="基本信息" titleColor="" class="ma-bottom">
        <x-input title="信息标题:" placeholder="必填" v-model='data.title' :show-clear="false" text-align="left" :max="36"></x-input>
        <x-input title="影响范围:" placeholder="必填" v-model='data.incidence' :show-clear="false" text-align="left"></x-input>
        <popup-picker class="thingLevel" title="预警级别:" placeholder="必填" :data="levelList" v-model="levelArr"></popup-picker>
        <!--<x-switch title="是否敏感:" v-model="isSensitive"></x-switch>-->
        <datetime v-model="data.bdateStr" placeholder="必填" :min-year=2000
                  format="YYYY-MM-DD HH:mm" title="预警时限:"
                  year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点"
                  minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>

        <datetime v-model="data.edateStr" placeholder="必填" :min-year=2000
                  format="YYYY-MM-DD HH:mm" title="至"
                  year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点"
                  minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>

      </group>
      <group title="附件上传" class="fileUpload">
        <attach-upload :attachs="attachs"
                       @on-action-success ="actionSuccess">
        </attach-upload>
      </group>
      <group title="预警事项">
        <x-textarea
          v-model="data.contents"
          :rows="5"
          placeholder="预警事项">
        </x-textarea>
      </group>
      <box class="positionBtn btn-group">
        <button class="inline-btn" @click="reportEvent" type="button">我要上报</button>
      </box>
    </form>
  </div>
</template>

<style lang="less" scoped>
  .multiForm{
    height: 100%;
    width: 100%;
  }

  .positionBtn {
    position: fixed;
    bottom: 0;
    width: 95%;
    background: #ededed;
    padding: 10px;
    z-index: 99;
  }

  .ma-round {
    background: #EDEDED;
  }

  .ma-bottom {
    overflow: hidden;
  }
</style>
<script>
  import {
    XInput,
    XTextarea,
    Group,
    PopupPicker,
    Datetime,
    Box
  } from 'vux'
  import { siteUrl, pageUtils } from '../../../../utils/common'
  import AttachUpload from '../../../mycomponents/AttachUpload'

  export default {
    name: 'AddInfo',
    // 数据模型
    data() {
      return {
        // 附件组件数组
        attachs: [],
        id: '',
        fileShow: false,
        submitStatus: false,
        orgClass: 'gs-plus-square-o',
        otherClass: 'gs-plus-square-o',
        data: {},
        saveUrl: '',
        levelArr: [],
        imgMaxSum: '3',
        loadingShow: false,
        incidence: '',
        loadText: '',
        levelList: [['红色预警', '橙色预警', '黄色预警', '蓝色预警']],
        level: [{ code: '1', name: '红色预警' }, { code: '2', name: '橙色预警' }, { code: '3', name: '黄色预警' }, {
          code: '4',
          name: '蓝色预警'
        }]
      }
    },
    // 组件
    components: {
      XTextarea,
      XInput,
      Group,
      PopupPicker,
      Datetime,
      Box,
      AttachUpload
    },
    computed: {
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (vm.$router.history.current.name === 'editWaringInfo') {
          vm.id = vm.$router.history.current.params.id
          vm.getEventBase(vm.id)
          vm.$store.commit('setHeaderTitle', '编辑预警信息')
        } else {
          vm.$store.commit('setHeaderTitle', '新增预警信息')
          vm.init()
        }
        // 设置头部文字
      })
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'WarningView') {
        this.init()
      }
      next()
    },
    // vue实例挂着后调用
    mounted() {
    },
    created() {
    },
    watch: {
      data(old) {
        this.saveData('AddWarn', old)
      }
    },
    // 定义方法区
    methods: {
      // 附件上传子组件调用
      actionSuccess(attachId) {
        this.data.attachId = attachId
      },
      // 存储data
      saveData(name, obj) {
        pageUtils.setlocalStorage(name, obj)
      },
      init() {
        // 通过 `vm` 访问组件实例
        this.levelArr = []
        this.title = ''
        this.incidence = ''
        this.bdateStr = ''
        this.edateStr = ''
        if (pageUtils.getlocalStorage('AddWarn')) {
          this.data = pageUtils.getlocalStorage('AddWarn')
        } else {
          this.data = {}
        }
        if (pageUtils.getlocalStorage('attachs')) {
          this.attachs = pageUtils.getlocalStorage('attachs')
        } else {
          this.attachs = []
        }
      },
      setData() {
        const that = this
        Array.from(this.level, (x) => {
          if (x.name === this.levelArr[0]) {
            that.data.level = x.code
          }
          return false
        })
        return that.data
      },
      submit() {
        const that = this
        const data = that.setData()
        this.validation(data)
        if (this.submitStatus) {
          this.$vux.confirm.show({
            title: '确认保存？',
            content: '',
            onConfirm() {
              const URL = `${siteUrl}/warning/warningissued/saveMobile`
              that.axios.postData(URL, data, (response) => {
                if (response.code === 200) {
                  that.$router.go(-1)
                  that.$vux.toast.text('保存成功', 'middle')
                  that.$vux.confirm.hide()
                } else if (response.message) {
                  that.$vux.toast.text(response.message, 'middle')
                }
              }, () => {
                that.$vux.toast.text('操作失败', 'middle')
                that.$vux.confirm.hide()
              })
            }
          })
        }
      },
      validation(val) {
        if (!val.title || !val.title.trim()) {
          this.$vux.toast.text('请输入信息标题', 'middle')
          this.submitStatus = false
          return false
        } else if (!val.incidence || !val.incidence.trim()) {
          this.$vux.toast.text('请输入预警范围', 'middle')
          this.submitStatus = false
          return false
        } else if (!val.bdateStr || !val.bdateStr.trim()) {
          this.$vux.toast.text('请选择预警开始时限', 'middle')
          this.submitStatus = false
          return false
        } else if (!val.edateStr && !val.edateStr.trim()) {
          this.$vux.toast.text('请选择预警结束时限', 'middle')
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
        if (!this.validation(this.setData())) return
        const URL = `${siteUrl}/warning/warningissued/sendsaveMobile`
        this.$vux.confirm.show({
          title: '确认上报？',
          content: '',
          onConfirm() {
            that.axios.postData(URL, data, (response) => {
              if (response.code === 200) {
                const url = `${siteUrl}/eventdispose/report`
                that.data.mainObjectId = response.response.eventInfoId
                that.axios.postData(url, that.data, (res) => {
                  if (res.code === 200) {
                    that.$vux.toast.text('上报成功', 'middle')
                    pageUtils.deletlocalStorage('AddWarn')
                    that.init()
                    that.$router.go(-1)
                  } else {
                    that.$vux.toast.text(response.message, 'middle')
                  }
                })
              } else {
                that.$vux.toast.text(response.message, 'middle')
              }
            })
          }
        })
      },
    //  编辑页面加载数据
      getEventBase(id) {
        const that = this
        const URL = `${siteUrl}${this.$REST.EventInfo.VIEW}/${id}`
        that.axios.get(URL).then((res) => {
          if (res.data.code === 200) {
            const result = res.data.response
            // const attachids = JSON.parse(result.imgAttach)
            that.data.title = result.infoTitle
            that.data.incidence = result.info.data.incidence
            that.levelArr = [result.info.data.levelName]
            that.data.bdateStr = result.info.data.bdateStr
            that.data.edateStr = result.info.data.edateStr
            that.data.contents = result.info.data.contents
            if (result.attachExist) {
              this.attachs = JSON.parse(result.attachs)
            }
          }
        })
      }
    }
  }
</script>
