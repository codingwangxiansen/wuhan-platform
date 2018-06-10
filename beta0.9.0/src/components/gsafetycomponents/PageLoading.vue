<template>
  <div v-show="isShowLoading">
    <x-progress :percent="percent" :show-cancel="false"></x-progress>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
  import { XProgress } from 'vux'

  export default{
    name: 'PageLoading',
    props: {
    },
    // 组件
    components: {
      XProgress
    },
    data() {
      return {

      }
    },
    computed: {
      isShowLoading() {
        return this.$store.state.pageLoading.isShowLoading
      },
      percent() {
        return this.$store.state.pageLoading.percent
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>
