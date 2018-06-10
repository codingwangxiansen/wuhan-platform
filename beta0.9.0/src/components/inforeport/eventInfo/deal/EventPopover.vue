<!-- 信息审核组件	 -->
<template>
  <div class="event-popover" v-show="showFlag">
    <router-link :to="{path:'/report/editInfoChief/' + linkTo}" >
      <div class="pover-text">
        <i class="gs-pencil-square-o"></i>编&nbsp;&nbsp;辑
      </div>
    </router-link>
    <!--<router-link :to="{path:'/report/editInfoShare/' + linkTo}" >-->
      <!--<div class="pover-text">-->
        <!--<i class="gs-share-square-o"></i>分&nbsp;&nbsp;享-->
      <!--</div>-->
    <!--</router-link>-->
  </div>
</template>
<style lang="less" scoped>
  .event-popover{
    background: #59595d;
    height: auto;
    position: fixed;
    z-index: 10;
    top: 59px;
    right: 0.5em;
    &:before {
      content: '';
      display: inline-block;
      width: 1em;
      height: 1em;
      position: absolute;
      background: #59595d;
      transform: rotateZ(45deg);
      top: -0.5em;
      right: 2em;
    }
  }
  .pover-text{
    color: #fff;
    padding: 13px 20px;
    font-size: 18px;

  }
  .event-popover a {
    color: #fff;
  }
  .pover-text:not(:first-child){
      position:relative;
    &:before {
       content: "";
       display: inline-block;
       position: absolute;
       border-top: 1px solid #9c9898;
       width: 90%;
       top: 0;
       left: 5%;


     }
  }
  .pover-text ::after{
    height: 2px;
    color: #5C5C5E;
  }
  .pover-text i{
    font-size: 25px;
    margin-right: 20px;
    vertical-align: middle;
  }
</style>
<script>

export default {
  name: 'EventPopover',
  props: ['showFlag', 'linkTo'],
  components: {},
  computed: {},
  // 数据模型
  data() {
    return {}
  },
  methods: {
  }

}
</script>
