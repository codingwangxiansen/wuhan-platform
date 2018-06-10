<template>
  <div>
    <popup v-model="options.show">
      <div clas="popup0">
        <grid>
          <grid-item  :label="item.label" v-for="(item,index) in options.items" :key="index" @click.native="onItemClick(item)">
            <i slot="icon" class="icon" :class="item.iconType"></i>
          </grid-item>
        </grid>
      </div>
    </popup>
  </div>
</template>
<style>
</style>
<script>
  import { Grid, GridItem, Popup } from 'vux'

  export default{
    name: 'GsafetyBottomPopup',
    props: ['options'],
    components: {
      Grid, GridItem, Popup
    },
    methods: {
      /**
       * 跳转到指定页面
       * @param item 点击的组件
       */
      onItemClick(item) {
    // 如果传入了link参数，优先使用安卓的SDK打开页面
        if (item.link) {
          const openWindowOptions = { url: item.link }
          // 如果传入了title参数，使用自定义title覆盖页面原有title
          if (item.title) {
            openWindowOptions.title = item.title
          }
          // 如果传入了title参数，使用自定义actionBarType覆盖页面个数（默认为2）
          if (item.actionBarType) {
            openWindowOptions.actionBarType = item.actionBarType
          }
          if (this.$gsafety) {
            this.$gsafety.openWindow(openWindowOptions)
          }
          this.options.show = false
          return true
        }
    // 如果没有传入link而是传入了onItemClick方法，则默认为重写该方法
        if (item.onItemClick) {
          item.onItemClick(item)
          this.options.show = false
          return true
        }
        return false
      }
    }
  }

</script>
