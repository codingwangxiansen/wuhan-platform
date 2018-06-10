<!-- 领导选择器
	1.代表班内领导
	2.代表市领导
	3.代表所有用户
-->
<template>
  <div>
    <search  title="title" v-model="filterInput" position="absolute" cancel-text="清空" @on-change="query"></search>
    <div v-show="isShowUserContent" class="component-person-content">
        <span v-for="temp in leaderList">
          <i class="gs-user-tie"></i> {{temp}}
        </span>
    </div>
    <div class="user-select-panel" :class="{'down':isShowUserContent}">
      <checklist title="用户列表" :label-position="labelPosition" required
                 :options="filterList" v-model="leaderList" @on-change="change" :max="mLength"></checklist>
    </div>
    <box gap="10px 10px" class="subBtn">
      <x-button text="确定" type="theme" class="popup-select-btn" @click.native="chooseUser"></x-button>
    </box>
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
    width: 95%;
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

Vue.use(VueResource)

export default{
  name: 'LeaderSelect',
  data() {
    return {
      labelPosition: 'left',
      map: {},
      filterInput: '',
      commonList: [],
      flag: true
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
    leaderList: { // 选择的领导列表
      get() {
        return this.$store.state.leaderList
      },
      set(val) {
        // 判断当前用户在不在列表里面，如果在的话，就push进去
        if (this.flag) {
          const getUser = this.$store.state.user.id // 当前用户的id
          this.commonList.forEach((value) => {
            if (value.key === getUser) {
              val.push(getUser)
            }
          })
          this.flag = false
        }
        this.$store.commit('setLeaderList', val)
      }
    },
    maxLength() { // 选择的最大长度
      return this.$route.params.maxLength
    },
    leaderType() { // 领导类型
      return this.$route.params.leaderType
    },
    tip: {
      get() {
        let text = ''
        const that = this
        const o = that.leaderList[0]
        that.commonList.forEach(({ key, value }) => {
          if (key === o) {
            text = value
            if (that.leaderList.length > 1) {
              text = `${text}等${that.leaderList.length}人`
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
          if (item.keyWord) { // keyWord是英文名字 可以根据首字母来搜索
            const length = this.filterInput.length
            if (item.keyWord.substring(0, length) === this.filterInput.toLowerCase()) {
              return true
            } else if (item.value.indexOf(this.filterInput) >= 0) {
              return true
            }
            return false
          }
          if (item.value.indexOf(this.filterInput) >= 0) {
            return true
          }
          return false
        })
      }
    },
    isShowUserContent() {
      if (this.leaderList) {
        return false
      }
      if (this.leaderList.length) {
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
  beforeRouteEnter(to, from, next) {
    next(() => {
      // vm.leaderList.push(getUser)
      // 通过 `vm` 访问组件实例
      // const leftOption = {
      //   showBack: false,
      //   backText: '',
      //   preventGoBack: true
      // }
      // vm.$store.commit('setHeaderLeft', leftOption)
      // 去掉回退,只能通过确定按钮离开选择领导页
    })
  },
  beforeRouteLeave(to, from, next) {
    const leftOption = {
      showBack: true,
      backText: '',
      preventGoBack: false
    }
    this.$store.commit('setHeaderLeft', leftOption)  // 离开当前页 加上回退
    next()
  },
  methods: {
//      初始化
    init() {
      this.leaderList = []
    },
    // 变更类型属性
    change() {
    },
    //
    query(val) {
      this.filterInput = val
    },
    // 显示拾取列表
    chooseUser() {
      this.$router.back()
    }
  }
}
</script>
