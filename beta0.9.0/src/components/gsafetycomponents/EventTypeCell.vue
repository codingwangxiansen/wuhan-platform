<!--
	事件类型选择器
-->
<template>
	<div class="codeType">
  		<popup-picker :title="options.title"  :placeholder="options.placeholder"
  			:columns="options.columns" :data="typeList" v-model="itemArray" show-name></popup-picker>
	</div>
</template>
<style lang="less">
</style>
<script>
import { PopupPicker } from 'vux'

export default{
  name: 'EventTypeCell',
  props: ['value', 'options', 'typeCode'],
  components: {
    PopupPicker
  },
  data() {
    const eventType = this.$store.state.eventType
    for (let i = 0; i < eventType.length; i += 1) {
      eventType[i].parent = eventType[i].parent === '10000' ? 0 : eventType[i].parent
    }
    return {
      typeList: eventType,
      secondTyp: ''
    }
  },
  created() {
  },
    //
  computed: {
    // 与父组件通信用属性
    itemArray: {
      get() {
        // 查找事件类型的父类型
        let p = ''
        if (typeof (this.typeList) === 'undefined') {
          return ['', '']
        }
        this.typeList.forEach(
            /* eslint no-unused-vars: 0 */
            ({ name, value, parent }) => {
              if (value === this.value) {
                p = parent
              }
            })
        if (typeof this.value === 'object' && this.value) {
          this.secondTyp = this.value[0]
        } else {
          this.secondTyp = this.value
        }
        return ['', this.secondTyp]
      },
      set(val) {
        this.$emit('input', val[1])
      }
    }
  }
}
</script>
