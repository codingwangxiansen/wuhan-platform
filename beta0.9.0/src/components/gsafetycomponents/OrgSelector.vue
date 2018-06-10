<template>
  <div>
    <cell :title="label" :value="tip" @click.native="chooseOrg" is-link></cell>
    <popup v-model="showSelector" height="100%">
    <box gap="10px 10px" class="bigBox" id="bixBox">
      <search title="title"  v-model="filterInput" position="absolute" cancel-text="清空" @on-change="query"></search>
      <div v-show="isShowUserContent" class="component-org-content">
        <span v-for="temp in list">
          <i class="gs-user-tie"></i> {{map[temp]}}
        </span>
      </div>
      <div class="user-select-panel" :class="{'down':isShowUserContent}">
        <checklist title="机构列表" :label-position="labelPosition" required
                   :options="filterList" v-model="list" @on-change="change" :max="mLength"></checklist>
      </div>
      <group class="btnPri">
      	<x-button text="确定" type="theme" class="popup-select-btn" @click.native="confirm"></x-button>
      </group>
     </box>
    </popup>
  </div>
</template>
<style lang="less">
  @import "../../styles/common.less";
  #bixBox .weui-cells__title + .weui-cells {
      height: auto;
  }
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
  import { Cell, Checklist, XButton, Search, Popup, Box, Group } from 'vux'
  import { siteUrl } from '../../utils/common'
  import CONST_URL from '../../datas/url_const.json' // 引入URL常量

  Vue.use(VueResource)
  Vue.prototype.$RESOUCE = CONST_URL // 在页面入口处将URL常量挂载到Vue实例上，所有页面通过VUE实例使用

  export default {
    name: 'OrgSelector',
    props: ['value', 'label', 'maxLength'],
    data() {
      return {
        showSelector: false,
        labelPosition: 'left',
        commonList: [],
        map: {},
        tip: '',
        filterInput: ''
      }
    },
    components: {
      Cell,
      Checklist,
      XButton,
      Search,
      Popup,
      Box,
      Group
    },
    computed: {
      list: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      filterList: {
        get() {
          return this.commonList.filter((item) => {
            const itemChange = item.value.indexOf(this.filterInput) >= 0
            return itemChange
          })
        }
      },
      mLength() {
        return parseInt(this.maxLength, 10)
      },
      isShowUserContent() {
        if (this.list.length) {
          return true
        }
        return false
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      // 初始化，加载机构列表
      init() {
//        const data = {}
        const url = siteUrl + this.$REST.BASEDATA.GETORGS
        const that = this
        this.$http.get(url).then(function (res) {
          console.log(res)
          this.commonList = res.body.response
          if (this.commonList) {
            const tmpValArr = Object.values(this.commonList)
            tmpValArr.forEach((value) => {
              that.map[value.key] = value.value
            })
          }
          this.refreshTip()
        })
      },
      // 变更类型属性
      change(val) {
        console.log(val)
        this.refreshTip()
      },
      //
      query(val) {
        this.filterInput = val
      },
      // 点击确定后
      confirm() {
        this.refreshTip()
        this.showSelector = false
      },
      // 刷新显示效果
      refreshTip() {
        if (this.list.length > 0 && this.list.length < 2) {
          this.tip = this.map[this.list[0]]
        } else if (this.list.length >= 2) {
          this.tip = `${this.map[this.list[0]]}等${this.list.length}个机构`
        } else {
          this.tip = ''
        }
        console.log(this.list.length)
      },
      // 显示拾取列表
      chooseOrg() {
        this.showSelector = true
      }
    }
  }
</script>
