<template>
	<div>
    <info-super-item
      :data="eventBase"
      :attachs="attachs"
      :auditingList = "auditingList"
      @showFullScreen="showFullScreen"
    >
    </info-super-item>
    <flexbox v-show = "isReport">
      <flexbox-item>
        <x-button type="theme" @click.native="editPage">编辑</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="theme" @click.native="reportEvent">上报</x-button>
      </flexbox-item>
    </flexbox>
	</div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
</style>
<script>
// 导入页面所需的标签
import { Group, XButton, Flexbox, FlexboxItem } from 'vux'
import Vue from 'vue'
import VueResource from 'vue-resource'
import { siteUrl } from '../../../../utils/common'
import InfoSuperItem from '../../commoncompents/InfoSuperItem'


Vue.use(VueResource)

export default {
  data() {
    return {
      id: '',
      status: true,
      eventBase: {},
      attachs: [],
      auditingList: []
    }
  },
// 组件
  components: {
    XButton,
    Group,
    Flexbox,
    FlexboxItem,
    InfoSuperItem
  },
  computed: {
    isReport() {
      if (this.eventBase.infoStatus === '1' && this.eventBase.isBack === '0') {
        return false
      }
      return true
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('setHeaderTitle', '信息详情')
      vm.id = vm.$router.history.current.params.id
      vm.getEventBase()
      vm.loadAuditingList()
    })
  },
  beforeCreate() {
    const that = this
    this.$nextTick(() => {
      that.$store.dispatch('showPageLoading')
    })
  },
  created() {
  },
  methods: {
    getEventBase() {
      const that = this
      const URL = `${siteUrl}${this.$REST.EventInfo.VIEW}/${this.id}`
      this.$http.get(URL).then(
        function (response) {
          if (response.body.code === 200) {
            that.$store.dispatch('hidePageLoading')
            this.eventBase = response.body.response
            if (this.eventBase.attachExist) {
              this.attachs = JSON.parse(this.eventBase.attachId)
            }
          } else {
            console.log('error')
          }
        })
    },
    editPage() {
      const r = `/report/edit/${this.id}`
      this.$router.push(r)
    },
    reportEvent() {
      const r = `/report/addInfoTarget/${this.id}`
      this.$router.push(r)
    },
    // 加载审核数据
    loadAuditingList() {
      console.debug(`loadAuditingList with id:${this.id}`)
      const vm = this
      const URL = `${siteUrl}/eventInfo/findListByInfoId/${this.id}`
      this.$http.get(URL).then((res) => {
        vm.auditingList = res.body.response
      })
    },
    showFullScreen(imgs) { // 全屏查看图片
      this.$emit('showFullScreen', imgs)
    }
  }
}
</script>
