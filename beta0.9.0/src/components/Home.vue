<template>
  <div style="background:#f4f4f4">
    <!--begin导航-->

  </div>
</template>
<style lang="less">
  @import "../../styles/common.less";
</style>
<script>
  // 导入页面所需的标签
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  // 启用请求组件
  Vue.use(VueResource)
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
      }
    }
  }
</script>
