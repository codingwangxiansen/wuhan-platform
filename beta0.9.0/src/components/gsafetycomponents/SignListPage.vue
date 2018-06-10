<!-- 接收单位/人展示  已签收/未签收 -->
<template>
  <div>
    <tab>
      <tab-item active-class="red"
                :selected="currentItem === item.key"
                v-for="(item,index) in showTabs" :key="index"
                @on-item-click="getData(item.key)">
        {{item.value}}
      </tab-item>
    </tab>
    <group gutter="0">
      <cell v-for="(data,index) in dataList"
            :title="data.name"
            :value="data.time"
            :key="index">
      </cell>
    </group>
  </div>
</template>
<style lang="less">

</style>
<script>
  import { Tab, TabItem, Group, Cell } from 'vux'
  import { siteUrl } from '../../utils/common'

  export default {
    name: 'SignOrgPage',
    components: {
      Tab,
      TabItem,
      Group,
      Cell
    },
    data() {
      return {
        dataList: [], // 当前tab显示的机构
        id: '',
        waitNum: 0, // 未读的数量
        listNum: 0, // 全部的数量
        partType: '2', // 1 人员 2 机构
        currentItem: 'WAIT',
        tabs: [{
          key: 'WAIT',
          value: '未签收'
        }, {
          key: 'OK',
          value: '已签收'
        }]
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        const pageTitle = vm.$route.params.pageTitle
        vm.$store.commit('setHeaderTitle', pageTitle)  // 设置头部文字
        vm.id = vm.$route.params.id
        vm.partType = vm.$route.params.partType
        vm.currentItem = 'WAIT'
        vm.getData(vm.currentItem)
      })
    },
    computed: {
      showTabs() {
        const showTabs = this.tabs.map(({ key, value }) => {
          if (key === 'WAIT') {
            return {
              key,
              value: `${value}(${this.waitNum})`
            }
          }
          return {
            key,
            value: `${value}(${this.listNum - this.waitNum})`
          }
        })
        return showTabs
      }
    },
    methods: {
      getData(itemKey) {
        this.currentItem = itemKey
        const url = `${siteUrl}/eventreceipt/watiteOrgAndUser/${this.id}`
        this.axios.get(url).then((res) => {
          if (res.data.code === 200) {
            if (res.data.response.length) {
              this.dataList = []
              const typeList = res.data.response.filter((resData) => {
                if (resData.partType === this.partType) {
                  return true
                }
                return false
              })
              this.listNum = typeList.length
              const lists = typeList.filter((resData) => {
                if (resData.receiptStatus === this.currentItem) {
                  return true
                }
                return false
              })
              if (this.currentItem === 'WAIT') {
                this.waitNum = lists.length
              }
              lists.forEach((list) => {
                let name = list.receiptUserName
                let receiptTime = ''
                if (this.partType === '2') {
                  name = list.org.orgName
                } else {
                  name = `${list.receiptUserPosition} ${list.receiptUserName}`
                }
                if (this.currentItem === 'OK') {
                  receiptTime = list.receiptTime
                }
                this.dataList.push({
                  name,
                  time: receiptTime,
                  status: list.receiptStatus
                })
              })
            }
          } else {
            this.$vux.toast.text('系统繁忙，请稍后再试', 'middle')
          }
        })
      }
    }
  }
</script>
