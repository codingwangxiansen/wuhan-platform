<template>
  <div style="background:#f4f4f4">
    <!--begin导航-->
    <vue-map-search
      appkey="8a7b9aac0db21f9dd995e61a14685f05"
      :searchExtent="[110.58838,29.25286,118.09204,31.98012]"
      :ssl="true"
      :xyChange="whenChange">
    </vue-map-search>
  </div>
</template>
<style lang="less">
</style>
<script>
  // 导入页面所需的标签
  import Vue from 'vue'
  import vueMapSearch from 'vue-map-search'

  Vue.use(vueMapSearch)

  export default {
    // 数据模型
    data() {
      return {
      }
    },
    // 组件
    components: {
    },
    // 计算属性
    computed: {
      user() {
        return this.$store.user
      }
    },
    // vue实例创建后调用
    created() {
    },
    // vue实例页面挂载后调用
    mounted() {

    },
    // 定义方法区
    methods: {
      setUser(userInfo) {
        this.$store.commit('setUser', userInfo)
      },
      whenChange(res) {
        console.log(res)
      }
    }
  }
</script>
