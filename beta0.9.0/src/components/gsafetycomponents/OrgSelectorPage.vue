<!-- 机构选择页面 用于选择单位-->
<template>
  <div>
    <search  title="title" v-model="filterInput" position="absolute" cancel-text="清空" @on-change="query"></search>
    <div class="check-line">
      <div v-show="selectedOrgList.length"
           v-for="orgCode in selectedOrgList" class="component-person-content">
        <span>
          {{getOrgName(orgCode)}}
        </span>
      </div>
    </div>
    <div class="action-group">
      <check-icon :value.sync="isCheckAll">全选</check-icon>
      <!--<button @click="checkAll" class="">全选</button>-->
      <!--<button @click="checkReverse" class="">反选</button>-->
    </div>
    <div class="user-select-panel" :class="{'down':selectedOrgList.length}">
      <checklist title="机构列表" :label-position="labelPosition" required
                 :options="filterList" v-model="selectedOrgList" @on-change="change" :max="mLength"></checklist>
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
  .check-line{
    overflow-x: auto;
    white-space: nowrap;
  }
  .action-group{
    padding: 10px 15px;
  }
  button.weui-btn, input.weui-btn{
    width:95%;
  }
</style>
<script>
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { Cell, Checklist, XButton, Search, Popup, Box, CheckIcon } from 'vux'

  Vue.use(VueResource)

  export default{
    name: 'OrgSelect',
    data() {
      return {
        labelPosition: 'right',
        filterInput: '', // 搜索框的值
        isCheckAll: false,
        commonList: [] // 机构列表
      }
    },
    components: {
      Cell,
      Checklist,
      XButton,
      Search,
      Popup,
      Box,
      CheckIcon
    },
    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
          const orgList = vm.$store.state.orgList
          const allOrgCode = orgList.map(v => v.orgCode)
          const selectedOrgList = vm.$store.state.selectedOrgList
          vm.isCheckAll = true
          allOrgCode.forEach((code) => {
            if (selectedOrgList.indexOf(code) === -1) {
              vm.isCheckAll = false
            }
          })
        })
    },
    watch: {
      isCheckAll(val) {
        if (val) {
          this.checkAll()
        } else {
          this.unCheckAll()
        }
      }
    },
    computed: {
      selectedOrgList: { // 选择的机构列表
        get() {
          return this.$store.state.selectedOrgList
        },
        set(val) {
          this.$store.commit('setSelectedOrgList', val)
        }
      },
      maxLength() { // 选择的最大长度
        return this.$route.params.maxLength
      },
      tip: {
        get() {
          let text = ''
          const that = this
          const o = that.selectedOrgList[0]
          that.commonList.forEach(({ orgCode, orgName }) => {
            if (orgCode === o) {
              text = orgName
              if (that.selectedOrgList.length > 1) {
                text = `${text}等${that.selectedOrgList.length}个单位`
              }
            }
          })
          return text
        }
      },
      filterList: {
        get() {
          const orgList = this.$store.state.orgList
          this.commonList = []
          orgList.forEach((orgItem) => {
            const key = orgItem.orgCode
            const value = orgItem.orgName
            this.commonList.push({
              key, value
            })
          })
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
      mLength() {
        return parseInt(this.maxLength, 10)
      }
    },
    created() {
    },
    methods: {
//      初始化
      init() {
        this.selectedOrgList = []
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
      },
      getOrgName(code) {
        const orgList = this.$store.state.orgList
        let orgNameStr = ''
        orgList.forEach(({ orgCode, orgName }) => {
          if (code === orgCode) {
            orgNameStr = orgName
          }
        })
        return orgNameStr
      },
      checkAll() {
        const orgList = this.$store.state.orgList
        const allOrgCode = orgList.map(v => v.orgCode)
        this.$store.commit('setSelectedOrgList', allOrgCode)
      },
      unCheckAll() {
        this.$store.commit('resetSelectedOrgList')
      },
      checkReverse() { // 反选
        const selectedOrgList = this.$store.state.selectedOrgList
        const orgList = this.$store.state.orgList
        const allOrgCode = orgList.map(v => v.orgCode)
        const reverseCode = allOrgCode.filter((code) => {
          if (selectedOrgList.indexOf(code) === -1) {
            return true
          }
          return false
        })
        this.$store.commit('setSelectedOrgList', reverseCode)
      }
    }
  }
</script>
