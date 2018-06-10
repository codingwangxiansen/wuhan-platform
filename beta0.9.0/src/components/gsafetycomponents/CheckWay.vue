<template>
  <div>
    <checker type="checkbox" v-model="checkway" default-item-class="way-item" selected-item-class="way-item-selected">
      <div class="check-title">
        <span>{{label}}：</span>
        <span><checker-item v-for="(item,index) in way" :key="index" :value="item" @on-item-click="onItemClick">{{item.value}}</checker-item></span>
      </div>
    </checker>
  </div>
</template>

<style lang="less" scoped>
  .check-title{
    display: block;
    padding: 10px 15px;
  }
  .check-title span{
    margin-right: 6px;
  }
  .way-item{
    width: 100px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #e2e2e2;
    background-color: #fff;
    margin-right: 15px;
  }
  .way-item-selected{
    background: #fff url(../../assets/image/infoReport/checked.png) no-repeat right bottom;
    border-color: #ff4a00;
  }
</style>
<script>
  import { Checker, CheckerItem } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
//  import { siteUrl, sendRequest, fileserver, $gsafety, pathConfig } from '../../utils/common'

  // 启用请求组件
  Vue.use(VueResource)

  export default {
    name: 'UserSelector',
    props: ['way', 'label'],
    // 数据模型
    data() {
      return {
        checkway: [],
        keys: [],
        flag: false
      }
    },
    //  组件
    components: {
      Checker,
      CheckerItem
    },
    //  vue实例创建后调用
    created() {
      this.init()
    },
    // 定义方法区
    methods: {
      init() {
        if (this.way) {
          const that = this
          if (this.way) {
            const wayValArr = Object.values(this.way)
            wayValArr.forEach((value) => {
              that.checkway.push(value)
              that.keys.push(value.key)
            })
          }
        }
      },
      onItemClick(value, disabled) {
        if (this.checkway.length < 1) {
          if (!disabled) {
            if (this.flag) {
              this.checkway.push(value)
            }
            this.flag = !this.flag
          }
        }
        this.convertWay(this.checkway)
        this.$emit('on-item-click', this.keys)
      },
      convertWay(val) {
        const k = []
        if (val) {
          const valArr = Object.values(val)
          valArr.forEach((value) => {
            k.push(value.key)
          })
        }
        this.keys = k
      }
    }
  }
</script>
