<!--
	用于于安卓的顶部的搜索组件，通常用于打开一个新的搜索链接
-->
<template>
  <div>
    <div class="weui_search_bar" id="search_bar">
      <form class="weui_search_outer">
        <div class="weui_search_inner">
          <i class="weui_icon_search"></i>
          <input type="search" @click="openSearch" class="weui_search_input" id="search_input" readonly="true" :placeholder="options.placeholder"/>
          <a href="javascript:" class="weui_icon_clear" id="search_clear"></a>
        </div>
      </form>
    </div>
  </div>
</template>
<style lang="less">
  @import "../../styles/weui.less";
  .weui_search_inner .weui_search_input{
    width: 97%;
  }
</style>
<script>

  export default{
    name: 'GsafetyAppSearch',
    props: ['options', 'r'],
    methods: {
      /**
       * 跳转到指定页面
       * @param item 点击的组件
       */
      openSearch() {
        if (this.r) {
          this.$router.push(this.r)
          return true
        }
        return false
      }
    }
  }
</script>
