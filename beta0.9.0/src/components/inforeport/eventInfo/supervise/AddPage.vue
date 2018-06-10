<template>
  <div>
    <group>
      <cell title="转办事项" :value="info" @click.native="thingsSelected"  is-link></cell>
      <cell title="批示指示" :value="dispose"></cell>
    </group>
    <group>
      <cell title="接收单位" :value="orgNames" @click.native="chooseOrg" is-link></cell>
      <cell title="接收人" :value="userNames" @click.native="chooseUser" is-link></cell>
    </group>
    <group title="转办督办意见">
      <!--XTextarea -->
      <x-textarea v-model="data.content" :rows="12" placeholder="输入转办督办意见"></x-textarea>
    </group>
    <group title="附件上传" class="fileUpload">
      <attach-upload
        :attachs="attachs"
        @on-action-success ="actionSuccess"
      ></attach-upload>
    </group>
    <box gap="10px 10px">
      <x-button type="default" @click.native="reportEvent" action-type="button">确定</x-button>
      <x-button type="theme" @click.native="backOn">返回</x-button>
    </box>
  </div>
</template>
<style type="less" scoped>
  /*cj新*/
  .fileUpload {
    margin-bottom: 60px;
  }
  .thingsSel {
    height:93% !important;
  }
  /*c新end*/
  .tipsText {
    text-align: center;
    color: #999;
  }
  .chartBox {
    margin-top: 40px;
    overflow: hidden;
  }
  #statChart{
    width: 100%;
    height: 300px;
  }
</style>
<script>
  import { PopupPicker, Cell, Group, Popup, Box, XButton, XTextarea } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import AttachUpload from '../../../mycomponents/AttachUpload'

  import OrgCheckList from '../../commoncompents/OrgCheckList'
  import { siteUrl } from '../../../../utils/common'

  Vue.use(VueResource)

  export default {
    props: [],
    // 组件
    components: {
      Cell,
      Group,
      OrgCheckList,
      PopupPicker,
      Popup,
      Box,
      XButton,
      XTextarea,
      AttachUpload
    },
    computed: {
      info() {
        if (this.data.eventInfoTitle) {
          return this.data.eventInfoTitle.substr(0, 20)
        }
        return ''
      },
      data: {
        get() {
          return this.$store.state.formSupervise
        },
        set() {}
      },
      dispose() {
        if (this.data.disposeTitle) {
          return this.data.disposeTitle.substr(0, 20)
        }
        return ''
      },
      members: { // 领导ID数组
        get() {
          return this.$store.state.leaderList
        },
        set() {
        }
      },
      targets: { // 机构ID数组
        get() {
          return this.$store.state.selectedOrgList
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
      chooseOrder() {
        this.selectOrders = this.$store.state.orderInfo
        return this.selectOrders.title
      },
      chooseTings() {
        this.selectThings = this.$store.state.transThings
        return this.selectThings.title
      },
      userNames() {
        let leaderList = []
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
    // 数据模型
    data() {
      return {
        attachs: [],
        //  代办事项显示隐藏
        waitThings: false,
      //  选择的事
        selectThings: {},
        selectOrders: {},
        transIdea: '',
        imgMaxSum: '3',
        maxFileSize: 30, // 文件的最大大小 单位M
        loadingShow: false,
        loadText: ''
      }
    },
    created() {
    },
    watch: {
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.$store.commit('setHeaderTitle', '添加转办督办')
      })
    },
    beforeRouteLeave(to, from, next) {
      if (to.name !== 'LeaderSelect' && to.name !== 'OrgSelect') { // 领导选择允许跳页
        this.$store.commit('resetSelectedOrgList')
        next()
      } else {
        next()
      }
    },
    mounted() {

    },
    // 方法
    methods: {
      actionSuccess(attachId) {
        this.data.attachId = attachId
      },
      // 取消
      backOn() {
        this.$router.go(-1)
      },
      // 表单验证
      validate(val) {
        if (!val.infoId) {
          this.$vux.toast.text('请选择转办事项', 'middle')
          return false
        }
        if (val.orgCodes.length === 0 && val.userids.length === 0) {
          this.$vux.toast.text('请选择接收单位或者接收人', 'middle')
          return false
        }
        if (!val.opinionContent) {
          this.$vux.toast.text('请输入转办督办意见', 'middle')
          return false
        }
        return true
      },
      // 内容提交
      reportEvent() {
        const that = this
        // 此处现在只支持绑定一个，后面可能支持多个
        const instructionId = that.data.disposeId ? [that.data.disposeId] : []
        const data = {
          orgCodes: that.targets,
          userids: that.members,
          opinionContent: that.data.content,
          infoId: that.data.eventInfoId,
          instructionId,
          disposeType: '5',
          attachId: that.data.attachId
        }
        if (!that.validate(data)) {
          return
        }
        that.$vux.confirm.show({
          title: '确认提交？',
          content: '',
          onConfirm() {
            // 提交的接口
            const url = `${siteUrl}/eventdispose/instruct/assign`
            that.$http.post(url, data).then(() => {
              // 返回码不正确时直接结束
              that.$vux.toast.text('批示转办成功')
              that.$store.commit('clearFormSupervise')
              that.$store.commit('resetLeaderList')
              that.$store.commit('resetSelectedOrgList')
              that.attachs = []
              that.$router.go(-1)
            })
          },
          onCancel() {
            // 隐藏弹窗
            that.$vux.confirm.hide()
          }
        })
      },
      orderSelected() {
        this.$router.push({
          name: 'SelectThings',
          params: {
            typeId: '2'
          }
        })
      },
      thingsSelected() {
        this.$router.push({
          name: 'SelectThings',
          params: {
          //  看到时候传什么
            typeId: '1'
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
      }
    }
  }
</script>
