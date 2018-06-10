<template>
    <div :class="{'spread':expended}">
      <cell :title="label" @click.native="expended = !expended" is-link>{{tip}}</cell>
      <div class="detail-person-content">
        <span v-for="user in users" @click="commUser(user.handleUser)">
          <i class="gs-user-tie"></i>{{user.handleUserName}}
        </span>
      </div>
    </div>
</template>
<style lang="less" scoped>
  @import "../../styles/common.less";
  .detail-person-content{
    max-height: 0;
    overflow-y: hidden;
    transition: all .3s;
  }

  .spread .detail-person-content{
    max-height: 1000px;
  }

  .spread .weui_cell_ft.with_arrow:after {
    border-width: 0px 2px 2px 0;
  }

  .detail-person-content span{
    display: inline-block;
    padding: 5px;
    background: @themeColor;
    border-radius: 5px;
    margin-left: 10px;
    margin-bottom: 5px;
    color: #fff;
  }

  .detail-person-content span i{
    margin-right: 5px;
  }
</style>
<script>
import { Cell } from 'vux'
import { htmlUrl } from '../../utils/common'

export default{
  name: 'UserList',
  props: ['users', 'label'],
  data() {
    return {
      expended: false,
      communicateUrl: ''
    }
  },
  components: {
    Cell
  },
  computed: {
    tip: {
      get() {
        if (this.users && this.users.length > 0) {
          return `${this.users[0].handleUserName}等${this.users.length}人`
        }
        return '无'
      }
    }
  },
  created() {
  },
  methods: {
    commUser(userId) {
      const that = this
      that.communicateUrl = `${location.origin}${htmlUrl}/module/communicate.html#/CommunicateView/${userId}`
      const options = { url: that.communicateUrl, actionBarType: 1, title: '通讯录' }
      if (this.$gsafety) {
        this.$gsafety.openWindow(options)
      }
    }
  }
}
</script>
