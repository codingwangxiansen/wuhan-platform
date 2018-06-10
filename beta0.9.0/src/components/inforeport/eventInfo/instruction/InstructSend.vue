<template>
  <div class="infoSend">
  	<box>
      <group title="转办事项" label-margin="10px">
        <cell value-align="left" title="" align-items="after-title" :value="eventBase.infoTitle"></cell>
      </group>
      <group title="批示指示" label-margin="10px">
        <cell value-align="left" title="" align-items="after-title" :value="leaderBack"></cell>
      </group>
      <group>
        <cell title="接收单位" :value="orgNames" @click.native="chooseOrg" is-link></cell>
        <cell title="接收人" :value="userNames" @click.native="chooseUser" is-link></cell>
      </group>
      <x-textarea title="" v-model="comment" placeholder="输入转办督办意见"></x-textarea>
      <group class="fileUpload">
        <attach-upload
          :attachs="attachs"
          @on-action-success ="actionSuccess"
          :showAudioPart="showAudioPart"
        ></attach-upload>
      </group>
	    <divider></divider>
      <group class="transBtn">
        <x-button type="default" @click.native="commit">确定</x-button>
        <x-button type="theme" @click.native="goback">返回</x-button>
      </group>
	</box>
  </div>
</template>
<script>
import { ConfirmPlugin, Group, CellBox, Checklist, Cell, Divider, XButton, Box, XTextarea } from 'vux'
import Vue from 'vue'
import OrgSelector from '../../../gsafetycomponents/OrgSelector'
import OrgCheckList from '../../commoncompents/OrgCheckList'
import LeaderSelector from '../../../gsafetycomponents/LeaderSelector'
import UserSelector from '../../../gsafetycomponents/UserSelector'
import AttachUpload from '../../../mycomponents/AttachUpload'
import { siteUrl } from '../../../../utils/common'

Vue.use(ConfirmPlugin)

export default {
  mounted() {
  },
  components: {
    ConfirmPlugin,
    Group,
    Checklist,
    Cell,
    Divider,
    XButton,
    CellBox,
    Box,
    XTextarea,
    OrgSelector,
    OrgCheckList,
    LeaderSelector,
    UserSelector,
    AttachUpload
  },
  computed: {
    members: { // 领导ID数组
      get() {
        return this.$store.state.leaderList
      },
      set() {
      }
    },
    orgs: { // orgcode数组
      get() {
        return this.$store.state.selectedOrgList
      },
      set() {
      }
    },
    orgNames() {
      const orgList = this.$store.state.orgList
      let text = ''
      const o = this.orgs[0]
      orgList.forEach(({ orgCode, orgName }) => {
        if (orgCode === o) {
          text = orgName
          if (this.orgs.length > 1) {
            text = `${text}等${this.orgs.length}个单位`
          }
        }
      })
      return text
    },
    userNames() {
      let leaderList
      if (this.leaderType === '1') {
        leaderList = this.$store.state.groupLeader
      } else if (this.leaderType === '2') {
        leaderList = this.$store.state.cityLeader
      } else {
        leaderList = this.$store.state.allUser
      }
      let text = ''
      const o = this.members[0]
      leaderList.forEach(({ key, value }) => {
        if (key === o) {
          text = value
          if (this.members.length > 1) {
            text = `${text}等${this.members.length}人`
          }
        }
      })
      return text
    }
  },
  beforeRouteEnter(to, from, next) {
      // cons
    next((vm) => {
      vm.leaderBack = vm.$store.state.leaderBack
      if (from.name === 'InfoView' || from.name === 'LeaderSelect') {
        return
      }
      vm.init()
    }
    )
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'LeaderSelect' && to.name !== 'OrgSelect') { // 领导选择允许跳页
      this.$store.commit('resetSelectedOrgList')
      next()
    } else {
      next()
    }
  },
  methods: {
//     附件上传
    actionSuccess(attachId) {
      this.attachId = attachId
    },
//    change() {
//    },
    init() {
      this.id = this.$router.history.current.params.id
      this.msgid = this.$router.history.current.query.msgid
      this.attachs = []
      this.selectLeadList = []
      this.orgs = []
      this.comment = ''
      this.getEventBase()
    },
    /*
     * 提交呈报
     */
    commit() {
      const vm = this
      if (!vm.comment) {
        vm.$vux.toast.text('请输入转办督办意见', 'middle')
        return
      }
      if (vm.orgs.length < 1 && vm.members.length < 1) {
        vm.$vux.toast.text('请选择接收单位或接收人！')
        return
      }
      this.$vux.confirm.show({
        title: '确认转办？',
        content: '',
        onConfirm() {
          const url = `${siteUrl}/eventdispose/instruct/assign`
          const data = {
            orgCodes: vm.orgs,
            userids: vm.members,
            opinionContent: vm.comment,
            infoId: vm.id,
            instructionId: [vm.msgid],
            disposeType: '5',
            attachId: vm.attachId
          }
          vm.$http.post(url, data).then((res) => {
            if (res.status !== 200) {
              vm.$vux.toast.text('批示转办失败')
            } else {
              vm.$vux.toast.text('批示转办成功')
              vm.$store.commit('resetLeaderList')
              vm.$store.commit('resetSelectedOrgList')
            }
            vm.$router.go(-1)
          })
        }
      })
    },
    // 选择机构
    chooseOrg() {
      this.$router.push({
        name: 'OrgSelect',
        params: {
          maxLength: 100
        }
      })
    },
    // 选择用户
    chooseUser() {
      this.$router.push({
        name: 'LeaderSelect',
        params: {
          leaderType: '3',
          maxLength: 10
        }
      })
    },
    /*
    * 取消
    */
    goback() {
      this.$router.go(-1)
    },
    relInfo() {
      const r = `/report/infoview/${this.id}`
      this.$router.push(r)
    },
    getEventBase() {
      const URL = `${siteUrl}${this.$REST.EventInfo.VIEW}/${this.id}`
      this.$http.get(URL).then(
        (response) => {
          if (response.body.code === 200) {
            this.eventBase = response.body.response
          } else {
            console.log('error')
          }
        })
    }
  },
  data() {
    return {
      leaderBack: '',
      attachs: [],
      showAudioPart: false,
      id: '',
      msgid: '',
      fullValues: [],
      labelPosition: '',
      error: '',
      orgList: [],
      leaderList: [],
      selectOrgList: [],
      selectLeadList: [],
      comment: '',
      imgMaxSum: '3',
      eventBase: {}
    }
  }
}
</script>

<style scoped>
.error {
  padding-left: 15px;
  line-height: 28px;
  color: #888;
  font-size: 12px;
}
.release {
  color: #03A9F4;
  float: left;
  line-height: 46px;
  margin-left: 10px;
}
</style>
