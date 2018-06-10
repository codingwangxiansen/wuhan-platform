<template>
  <div class="instruction">
    <div  class="main_panel">
      <!--end效果图-->
      <comments-item ref="comments" :scrollH="scrollH"></comments-item>
    </div>
    <a class="add-btn" v-show="showButtonOptions" @click="addNew">
      添加转办督办
    </a>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common";
  .main_panel {
    margin-top: 10px;
  }
  .tabNav {
    position: relative;
    z-index: 9;
    width: 100%;
  }
  .add-btn{
    display: block;
    font-weight: bold;
    position: absolute;
    letter-spacing: 3px;
    width: 100%;
    bottom: 0;
    height: 40px;
    color: @themeColor;
    line-height: 40px;
    text-align: center;
    border-top: 1px solid #e2e2e2;
    background: #FFF;
    box-shadow: 0px -1px 2px #e2e2e2;
  }
</style>
<script>
  import CommentsItem from './CommentsItem'

  export default {
    // 组件
    components: {
      CommentsItem
    },
    computed: {
      // 是否显示按钮行, true 是， false 否
      showButtonOptions() {
        const user = this.$store.state.user
        if (user) {
          return user.typeCode === 1
        }
        return false
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (vm.$store.state.projectType === 'mini') {
          vm.scrollH = '-0'
        }
        // 通过 `vm` 访问组件实例
        vm.$store.commit('setHeaderTitle', '转办督办') // 设置头部文字
        vm.$refs.comments.loadPage(0, true)
      })
    },
    beforeCreate() {
      const that = this
      this.$nextTick(() => {
        that.$store.dispatch('showPageLoading')
      })
    },
    mounted() {
    },
    // 数据模型
    data() {
      return {
        scrollH: '-54'
      }
    },
    // 方法
    methods: {
      addNew() {
        this.$router.push('/eventInfo/supervise/add')
      }
    }
  }
</script>
