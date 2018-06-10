<template>
  <div class="instr-cell" @click="select">
    <div class="instr-content">{{data.disposeDescription}}</div>
    <div class="rel-info"><span class="i-release">关联事件:</span>
      <span class="release" @click.stop="relInfo">{{data.eventTitle}}</span>
    </div>
    <div class="leader-info"><span class="i-leader">批示领导--</span><span>{{data.disposePersonName}}</span></div>
  </div>
</template>
<style lang="less" scoped>
  .instr-cell {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    background: #fff;
  }

  .instr-content {
    margin: 5px 10px;
    font-weight: bold;
  }

  .leader-info {
    text-align: right;
    margin-right: 20px;

  }

  .rel-info {
    display: block;

  }

  .i-release {
    color: #454545;
    margin: 0 20px 0 10px;
  }

  .release {
    color: #03A9F4;
  }
</style>
<script>
  // 导入页面所需的标签
  import { Group, XInput, Cell } from 'vux'

  export default {
    name: 'InstructItem',
    props: ['data'],
    data() {
      return {
        url: ''
      }
    },
    components: {
      Group,
      XInput,
      Cell
    },
    created() {
    },
    methods: {
      /**
       * 打开批示通告
       */
      select() {
        const r = `/instruct/view/${this.data.id}`
        this.$router.push(r)
      },
      relInfo() {
// console.log(this.data.mainObjectId)
        const r = `/report/checkview/${this.data.mainObjectId}`
        this.$router.push(r)
      }
    },
    beforeRouteEnter(to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当钩子执行前，组件实例还没被创建
      next(() => {
        // 通过 `vm` 访问组件实例
        console.log('beforeRouteEnter')
      })
    },
    beforeRouteUpdate() {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
    },
    beforeRouteLeave() {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
    }
  }
</script>
