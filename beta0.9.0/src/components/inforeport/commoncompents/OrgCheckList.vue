<template>
  <div class="unitPop">
    <cell :title="label" :value="tip" @click.native="openSelector" is-link></cell>
    <popup v-model="showSelector" height="63%">
      <!-- 顶部搜索栏 + 过滤列表 -->
      <check-cell v-model="itemSelectArray"
                  @on-org-select="onSelected"
                  :maxLength="maxLength"
                  :valid="valid">
      </check-cell>
    </popup>
  </div>
</template>
<style lang="less" scopedC>
  .bigBox {
    position: relative;
    width: 94%;
  }
  .vux-search-box {
    width: 100%;
    top: 0;
    position: relative;
  }
  .component-org-content {
    overflow-y: hidden;
    transition: all .3s;
  }

  .component-org-content span{
    display: inline-block;
    padding: 5px;
    background: #03A9F4;
    border-radius: 5px;
    margin-left: 10px;
    margin-bottom: 5px;
    color: #fff;
  }
  .editGroup {
    position: relative;
    margin-bottom: 50px;
  }
  .btnPri {
    position: fixed;
    bottom: 0;
    width: 95%;
  }
</style>
<script>
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { Cell, Popup, Checklist } from 'vux'
  import CheckCell from './CheckCell'
  import CONST_URL from '../../../datas/url_const.json'// 引入URL常量


  Vue.use(VueResource)
  Vue.prototype.$RESOUCE = CONST_URL  // 在页面入口处将URL常量挂载到Vue实例上，所有页面通过VUE实例使用

  export default {
    name: 'OrgCheckerList',
    props: ['value', 'label', 'maxLength', 'valid'],
    data() {
      return {
        showSelector: false,
        labelPosition: 'left',
        tip: '',
        filterInput: '',
        itemSelectArray: []
      }
    },
    components: {
      Cell,
      Popup,
      CheckCell,
      Checklist
    },
    computed: {
        // 与父组件通信用属性
      list: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    /*
     *
     */
    mounted() {
    },
    /*
     *
     */
    methods: {
      init() {
        this.itemSelectArray = []
        this.openSelector()
        this.onSelected(this.itemSelectArray)
        this.tip = ''
      },
      // 显示拾取列表
      openSelector() {
        this.showSelector = true
      },
      //
      onSelected(item) {
        const n = item.length
        if (item && item.length > 0) {
          this.tip = item[0].name + (n > 1 ? `等${n}个单位` : '')
        } else {
          this.tip = ''
        }
        this.showSelector = false

        // 将itemSelectArray设置到this.list
        const vlist = []
        if (this.itemSelectArray) {
          const valueArr = Object.values(this.itemSelectArray)
          valueArr.forEach((value) => {
            const temp = value
            vlist.push(temp.value)
          })
        }
        this.list = vlist
      }
    }
  }
</script>
