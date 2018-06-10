<!-- 领导选择器
	1.代表班内领导
	2.代表市领导
	3.代表所有用户
-->
<template>
  <div class="selectLead">
    <cell :title="label" :value="tip" @click.native="chooseUser" is-link></cell>
    <popup v-model="showSelector">
      <search  title="title" v-model="filterInput" position="absolute" cancel-text="清空" @on-change="query"></search>
      <div v-show="isShowUserContent" class="component-person-content">
        <span v-for="temp in list">
          <i class="gs-user-tie"></i> {{temp}}
        </span>
      </div>
      <div class="user-select-panel" :class="{'down':isShowUserContent}">
        <checklist title="用户列表" :label-position="labelPosition" required
                   :options="filterList" v-model="list" @on-change="change" :max="mLength"></checklist>
      </div>
      <box class="subBtn">
        <x-button text="确定" type="theme" class="popup-select-btn" @click.native="confirm"></x-button>
      </box>
    </popup>
  </div>
</template>
<style lang="less" scoped>
  .vux-popup-dialog {
    height: calc(~"100vh - 48px")!important;
  }
  .user-select-panel {
    height: 80% !important;
    overflow-y: scroll;
  }
  .subBtn {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin: 0;
  }
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
  .leader-list-div{
    margin-bottom:4rem;
  }
  button.weui-btn, input.weui-btn{
    width:95%;
  }
</style>
<script>
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { Cell, Checklist, XButton, Search, Popup, Box } from 'vux'
  // import { $gsafety, siteUrl, pathConfig } from '../../utils/common'
  import CONST_URL from '../../datas/url_const.json' // 引入URL常量

  Vue.use(VueResource)
  Vue.prototype.$RESOUCE = CONST_URL // 在页面入口处将URL常量挂载到Vue实例上，所有页面通过VUE实例使用

  export default{
    name: 'LeaderSelector',
    props: ['value', 'label', 'maxLength', 'leaderType', 'defaultSelect'],
    data() {
      return {
        showSelector: false,
        labelPosition: 'left',
        map: {},
        filterInput: '',
        commonList: []
      }
    },
    components: {
      Cell,
      Checklist,
      XButton,
      Search,
      Popup,
      Box
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
      tip: {
        get() {
          // this.map[this.list[0]] + '等' + this.list.length + '人'
          let text = ''
          const that = this
          const o = that.list[0]
          // console.log(this.commonList);
          that.commonList.forEach(({ key, value }) => {
            if (key === o) {
              text = value
              if (that.list.length > 1) {
                text = `${text}等${that.list.length}人`
              }
            }
          })
          return text
        }
      },
      filterList: {
        get() {
          if (this.leaderType === '1') {
            this.commonList = this.$store.state.groupLeader
          } else if (this.leaderType === '2') {
            this.commonList = this.$store.state.cityLeader
          } else {
            this.commonList = this.$store.state.allUser
          }
          return this.commonList.filter((item) => {
            if (item.value.indexOf(this.filterInput) >= 0) {
              return true
            }
            return false
          })
        }
      },
      isShowUserContent() {
        if (this.list) {
          return false
        }
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
    },
    methods: {
//      初始化
      init() {
        this.list = []
      },
      // 变更类型属性
      change() {
      },
      //
      query(val) {
        this.filterInput = val
      },
      // 点击确定后
      confirm() {
        this.showSelector = false
      },
      // 显示拾取列表
      chooseUser() {
        this.showSelector = true
        this.$emit('on-choose-user')
      }
    }
  }
</script>
