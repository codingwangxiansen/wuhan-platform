<!-- 对vux滚动组件的二次封装  只包含页面下拉刷新 -->
<template>
  <scroller :height="scrollHeight" lock-x scrollbar-y
            ref="appScroll" use-pulldown :pulldown-config="pulldown_config"
            @on-pulldown-loading="refresh">
    <div>
      <slot></slot>
    </div>
  </scroller>
</template>
<script>
  import { Scroller } from 'vux'

  export default {
    name: 'AppScroller',
    components: {
      Scroller
    },
    data() {
      return {
        pulldown_config: {
          content: '',
          downContent: '刷新',
          upContent: '刷新',
          loadingContent: '加载中...',
          hight: 60
        }
      }
    },
    computed: {
      scrollHeight() {
        if (this.$store.state.projectType === 'app') {
          return '-48'
        }
        return '-1'
      }
    },
    methods: {
      refresh() {
        this.$emit('on-refresh')
      },
      scrollDone() { // 滚动操作完毕
        this.$refs.appScroll.donePulldown()
        this.$nextTick(() => {
          this.$refs.appScroll.reset()
        })
      }
    }
  }
</script>
