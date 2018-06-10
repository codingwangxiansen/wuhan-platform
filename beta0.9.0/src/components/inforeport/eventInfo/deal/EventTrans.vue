<!-- 拟办提交组件	 -->
<template>
	<popup v-model="show" class="popContainer">
    	<div class="head">
        <span class="headBtnL" @click="cancel">取消</span>
        <div class="headTitle">转办</div>
        <span class="headBtnR" @click="commit">✔ 确定</span>
      </div>
      <box class="transContent">
        	<div class="popup0">
            <group>
              <cell title="接收单位"
                    :value="orgNames"
                    @click.native="chooseOrg"
                    is-link></cell>
              <cell title="接收人"
                    :value="userNames"
                    @click.native="chooseUser"
                    is-link></cell>
            </group>
            <group title="转办事项：" class="transNew">
              <cell title="" :value="title" value-align="left"></cell>
              <x-textarea :rows="5" v-model="comment" placeholder="输入转办督办意见"></x-textarea>
            </group>
            <group class="fileUpload">
              <attach-upload
                :attachs="attachs"
                @on-action-success ="actionSuccess"
                :showAudioPart="showAudioPart"
              ></attach-upload>
            </group>
        	</div>
      	</box>
    </popup>
</template>
<style lang="less" scoped>
  .transContent {
    height: 88%;
    overflow: scroll;
  }
  .popContainer {
    /*height:70% !important;*/
  }
 .head {
   color: #444;
   background-color: #f2f2f2;
   text-align: center;
   font-weight: 500;
   line-height: 45px;
   font-size: 16px;
   z-index: 99;
   span {
     font-size: 14px;
   }
  }
  .headTitle {
    display: inline-block;
  }
  .headBtnL {
    float: left;
    color: #a5a4a4;
    font-weight: normal;
    padding: 0 1em;
  }
  .headBtnR{
    float: right;
    color: #0faaff;
    font-weight: normal;
    padding: 0 1em;
  }
  .fileUpload {
    margin-top: -20px;
    padding-left: 10px;
    background: #fff;
    box-sizing: border-box;
  }
</style>
<script>
import { Box, Popup, Group, Cell, XButton, XTextarea, Checklist } from 'vux'
import AttachUpload from '../../../mycomponents/AttachUpload'

export default {
  name: 'EventTrans',
  props: ['value', 'title', 'description'],
  data() {
    return {
      attachs: [],
      showAudioPart: false,
      comment: '',
      imgMaxSum: '3',
      leaderType: '3',
      attachId: [] // 转办督办的附件ID数组
    }
  },
  computed: {
    targets: { // 机构ID数组
      get() {
        return this.$store.state.selectedOrgList
      },
      set() {
      }
    },
    members: { // 领导ID数组
      get() {
        return this.$store.state.leaderList
      },
      set() {
      }
    },
    orgNames() {
      const orgList = this.$store.state.orgList
      let text = ''
      const o = this.targets[0]
      orgList.forEach(({ orgCode, orgName }) => {
        if (orgCode === o) {
          text = orgName
          if (this.targets.length > 1) {
            text = `${text}等${this.targets.length}个单位`
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
    },
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  components: {
    Box,
    Popup,
    Group,
    Cell,
    XButton,
    XTextarea,
    AttachUpload,
    Checklist
  },
    //
  methods: {
    // 附件选择
    actionSuccess(attachId) {
      this.attachId = attachId
    },
    // 用户取消选择
    cancel() {
      this.show = false
      this.$store.commit('resetLeaderList')
      this.$store.commit('resetSelectedOrgList')
      this.$store.commit('setDealWindow', '')
    },
    //
    clear() {
      this.targets = []
      this.members = []
      this.comment = ''
      this.attachs = []
      this.attachId = []
    },
    commit() {
      this.$emit('on-confirm', this.targets, this.members, this.comment)
    },
    // 选择机构
    chooseOrg() {
      this.$store.commit('setDealWindow', 'trans')
      this.$router.push({
        name: 'OrgSelect',
        params: {
          maxLength: 100
        }
      })
    },
    // 选择用户
    chooseUser() {
      this.$store.commit('setDealWindow', 'trans')
      this.$router.push({
        name: 'LeaderSelect',
        params: {
          leaderType: '3',
          maxLength: 10
        }
      })
    }
  }
}
</script>
