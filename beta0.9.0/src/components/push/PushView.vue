<!--
  详情页面
-->
<template>
  <div class="brief-content">
    <div class="content-part">
      <div class="content-info">{{data.title}}</div>
    </div>
    <group>
      <cell title="时间">
        <div class="icon-part"  slot="icon"><img src="../../assets/image/icon/time-icon.png"/></div>
        <div>{{data.creatTime}}</div>
      </cell>
      <cell title="来自">
        <div class="icon-part"  slot="icon"><img src="../../assets/image/icon/person-icon.png"/></div>
        <div>{{data.pushName}}</div>
      </cell>
    </group>
    <div class="content-part">
      <div class="title"><img src="../../assets/image/icon/content-icon.png">详情</div>
      <div class="content-info">{{data.content}}</div>
    </div>
    <!--
    <div style="margin-top: 10px;">
      <attach-model :attachs="attachs"></attach-model>
    </div>
    -->
  </div>
</template>
<style lang="less">
@import "../../styles/common.less";
@import "../../styles/pushview.less";
</style>
<script>
// 导入页面所需的标签
import { Group, Cell } from 'vux'
import Vue from 'vue'
import VueResource from 'vue-resource'
import { appUrl } from '../../utils/common'

// 启用请求组件
Vue.use(VueResource)

export default {
  // 组件
  components: {
    Group,
    Cell
    // ,
    // AttachModel
  },
  // 数据模型
  data() {
    return {
      id: this.$router.history.current.params.id,
      data: {},
      attachs: [],
      showclear: false
    }
  },
  // vue实例创建后调用
  created() {
    // this.loadPushData()
  },
  // beforeRouteEnter
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 加载数据
      vm.loadPushData()
    })
  },
  //  定义方法区
  methods: {
    loadPushData() {
      // console.log'(加载push信息' + this.id)
      const pushId = this.id
      const url = `${appUrl}/rest/biz/message/push/${pushId}`
      this.$http.get(url).then(function (res) {
        this.data = res.body.response.result
        this.attachs = res.body.response.result.list
      })
    }
  }
}
</script>
