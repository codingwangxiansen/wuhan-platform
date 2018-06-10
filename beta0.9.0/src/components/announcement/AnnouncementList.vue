<template>
  <div class="instruction">
    <div  class="main_panel">
      <!--end效果图-->
      <announcement-item ref="comments" :scrollH="scrollH"></announcement-item>
    </div>
    <a class="add-btn" @click="addInfo" v-if="isHigherAuthorities === 1">
      添加通知公告
    </a>
  </div>
</template>
<style lang="less" scoped>
@import "../../styles/common";
  .main_panel {
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
  import AnnouncementItem from './AnnouncementItem'

  export default {
    // 组件
    components: {
      AnnouncementItem
    },
    computed: {
      isHigherAuthorities: {
        get() {
          return this.$store.state.user.typeCode
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (vm.$store.state.projectType === 'mini') {
          vm.scrollH = '-40'
        }
        vm.$refs.comments.loadPage(0, true)
        vm.$store.commit('setHeaderTitle', '通知公告') // 设置头部文字
      })
    },
    beforeCreate() {
      const that = this
      this.$nextTick(() => {
        that.$store.dispatch('showPageLoading')
      })
    },
    // 数据模型
    data() {
      return {
//        scroller高度问题
        scrollH: '-86'
      }
    },
    // 方法
    methods: {
      addInfo() {
        const r = '/announcement/add'
        this.$router.push(r)
      }
    }
  }
</script>
