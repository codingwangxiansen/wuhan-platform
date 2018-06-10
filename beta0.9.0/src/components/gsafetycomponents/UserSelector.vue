<template>
  <div>
    <cell :title="label" :value="tip" @click.native="chooseUser" is-link></cell>
    <popup v-model="showSelector" height="100%">
      <search  title="title" v-model="filterInput" position="absolute" cancel-text="清空" @on-change="query"></search >
      <div v-show="isShowUserContent" class="component-person-content">
        <span v-for="temp in list">
          <i class="gs-user-tie"></i> {{map[temp]}}
        </span>
      </div>
      <div class="user-select-panel" :class="{'down':isShowUserContent}">
  	    <checklist title="用户列表" :label-position="labelPosition" required
  		  :options="filterList" v-model="list" @on-change="change" :max="mLength"></checklist>
  	  </div>
  	  <x-button text="确定" type="theme" class="popup-select-btn" @click.native="confirm"></x-button>
  	</popup>
  </div>
</template>
<style lang="less">
  @import "../../styles/common.less";
  .component-person-content{
    overflow-y: hidden;
    transition: all .3s;
    display: inline-block;
    padding: 5px;
    background: #03A9F4;
    border-radius: 5px;
    margin-left: 10px;
    margin-bottom: 5px;
    color: #fff;
  }
</style>
<script>
import Vue from 'vue'
import VueResource from 'vue-resource'
import { Cell, Checklist, XButton, Search, Popup } from 'vux'
import { siteUrl } from '../../utils/common'
import CONST_URL from '../../datas/url_const.json' // 引入URL常量


Vue.use(VueResource)
Vue.prototype.$RESOUCE = CONST_URL // 在页面入口处将URL常量挂载到Vue实例上，所有页面通过VUE实例使用

export default{
  name: 'UserSelector',
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
    Popup
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
    isShowUserContent() {
      if (this.list.length) {
        return true
      }
      return false
    },
    mLength() {
      return parseInt(this.maxLength, 10)
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化，加载用户信息
    init() {
      const data = {}
      const url = siteUrl + this.$REST.BASEDATA.USER
      const that = this
      this.$http.post(url, data).then(function (res) {
        // 返回码不正确时直接结束
        if (res.body.code !== 200) {
          console.error(res.body.message)
          return
        }
        // 初始化用户信息列表
        that.commonList = res.body.response
        if (that.commonList) {
          const tmpValArr = Object.values(that.commonList)
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
      if (this.list.length > 0) {
        this.tip = `${this.map[this.list[0]]}等${this.list.length}人`
      } else {
        this.tip = ''
      }
    },
    // 显示拾取列表
    chooseUser() {
      this.showSelector = true
    }
  }
}
</script>
