<template>
  <div class="register">
    <group>
        <!--<org-check-list class="unitName" class="eventAd" v-model="orgs" label="单位名称" :maxLength="1"></org-check-list>-->
        <x-input class="readonly" title="用户姓名:" readonly v-model='dataUser.username' :show-clear="false"></x-input>
        <x-input class="readonly" title="单位名称:" readonly v-model='dataUser.orgName' :show-clear="false"></x-input>
        <x-input title="处所科室:" placeholder="必填" v-model='dataUser.department' :show-clear="false"></x-input>
        <cell title="手机号码:" class="tel eventPhone" :value="dataUser.tel" @click.native="changeTel(dataUser.tel)" is-link></cell>
        <!-- <x-input class="readonly" title="邮箱:"  :readonly="isWrite" v-model='dataUser.email' :show-clear="false"></x-input> -->
        <x-input title="用户职务:" placeholder="必填" v-model='dataUser.position' :show-clear="false"></x-input>
        <!--<popup-radio title="用户性别:" :options="options" v-model="dataUser.sex"></popup-radio>-->
        <x-input title="办公电话:"  placeholder="必填" v-model='dataUser.officeTel' :show-clear="false" keyboard="number" ></x-input>
        <x-input title="邮箱:" v-model='dataUser.email' :show-clear="false"  is-type="email"></x-input>
        <x-input title="QQ:" v-model='dataUser.qq' :show-clear="false" keyboard="number" ></x-input>
    </group>
    <box class="positionBtn">
      <x-button type="default" @click.native="agree">保存</x-button>
    </box>
  </div>
</template>

<style lang="less" scoped>
  @import "../../styles/common.less";
  .positionBtn {
    position: fixed;
    bottom: 0;
    width: 95%;
    background: #ededed;
    padding: 10px;
    z-index: 99;
  }
</style>
<script>
  import {
    PopupRadio,
    XInput,
    Group,
    XButton,
    Box,
    Divider,
    Cell
    } from 'vux'
  import { siteUrl } from '../../utils/common'
  import OrgSelector from '../gsafetycomponents/OrgSelector.vue'
  import OrgCheckList from '../inforeport/commoncompents/OrgCheckList'

  export default {
      // 数据模型
    data() {
      return {
        dataUser: {
        },
        isWrite: false,
        orgs: [],
        options: [{ key: '0', value: '男' }, { key: '1', value: '女' }]
      }
    },
    // 组件
    components: {
      PopupRadio,
      XInput,
      Group,
      XButton,
      OrgSelector,
      OrgCheckList,
      Box,
      Divider,
      Cell
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        vm.$store.commit('setHeaderTitle', '修改个人信息') // 设置头部文字
      })
    },
    // vue实例创建后调用
    created() {
      this.dataUser = this.$store.state.user
    },
    // 定义方法区
    methods: {
      validate(val) {
        console.log(val)
        if (!val.officeTel) {
          this.$vux.toast.text('请输入办公电话', 'middle')
          return false
        }
        if (!val.position) {
          this.$vux.toast.text('请输入职务', 'middle')
          return false
        }
        if (!val.department) {
          this.$vux.toast.text('请输入科室', 'middle')
          return false
        }
        if (val.email) {
          const regex = '^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$'
          const reg = new RegExp(regex)
          if (!reg.test(val.email)) {
            this.$vux.toast.text('输入邮箱格式不对', 'middle')
            return false
          }
        }
        return true
      },
      agree() {
        const that = this
        const data = {
          officeTel: this.dataUser.officeTel,
          email: this.dataUser.email,
          position: this.dataUser.position,
          qq: this.dataUser.qq,
          department: this.dataUser.department
        }
        if (!that.validate(data)) {
          return
        }
        that.$vux.confirm.show({
          title: '确认修改？',
          content: '',
          onConfirm() {
            const url = `${siteUrl}/basedata/user/userInfo`
            that.axios.post(url, data)
              .then((response) => {
                that.$vux.confirm.hide()
                if (response.data.code === 200) {
                  that.setUser(that.dataUser)
                  that.$router.push('/user')
                }
              })
              .catch(() => {
                that.$vux.toast.text('修改失败', 'middle')
                that.$vux.confirm.hide()
              })
          }
        })
      },
      changeTel(val) {
        const url = `/user/changephonenum/${val}`
        this.$router.push(url)
      },
      setUser(userInfo) {
        this.$store.commit('setUser', userInfo)
      }
    }
  }
</script>
