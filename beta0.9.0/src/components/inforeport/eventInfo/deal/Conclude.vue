<template>
  <div class="conclude" id="multiForm">
    <div>
      <group title="办结意见">
        <x-textarea placeholder="请输入办结意见" :max="200" v-model="content"></x-textarea>
      </group>
      <group class="concludeBtn">
        <x-button type="default" @click.native="confirm">确认</x-button>
        <x-button type="theme" @click.native="cancel">取消</x-button>
      </group>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
  .conclude button{
    text-align: center;
  }
  button.weui-btn{
    width: 90%;
    margin-top: 10px;
  }
</style>
<script>
  // 导入页面所需的标签
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { XTextarea, Group, XButton, ConfirmPlugin, Box } from 'vux'
  import { siteUrl } from '../../../../utils/common'

  Vue.use(VueResource)
  Vue.use(ConfirmPlugin)

  export default{
    name: 'InfoItem',
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      attachs: {
        type: Array,
        default() {
          return []
        }
      },
      auditingList: {
        type: Array,
        default() {
          return []
        }
      },
      instList: {
        type: Array,
        default() {
          return []
        }
      },
      showAllInfo: { // 控制隐藏显示详细情况部分
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        id: null,
        content: ''
      }
    },
    components: {
      XTextarea,
      Group,
      XButton,
      ConfirmPlugin,
      Box
    },
    created() {
    },
    computed: {
    },
    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
          vm.id = vm.$router.history.current.params.id
        }
      )
    },
    methods: {
      cancel() {
        this.$router.go(-1)
      },
      confirm() {
        const that = this
        const url = `${siteUrl}/eventdispose/finish`
        const data = {
          disposeType: '16',
          disposeDescription: that.content,
          eventInfoId: that.id
        }
        if (!that.content || !that.content.trim()) {
          this.$vux.toast.text('请输入办结意见', 'middle')
          this.submitStatus = false
          return
        }
        that.$vux.confirm.show({
          title: '确认办结？',
          content: '',
          onConfirm() {
            that.$http.post(url, data).then((response) => {
              that.loadingShow = false
              console.log(response)
              if (response.status === 200) {
                const resp = response.body
                if (resp.code === 200) {
                  that.$vux.toast.text('办结完毕', 'middle')
                  that.$vux.confirm.hide()
                  that.content = ''
                  that.$router.go(-1)
                } else {
                  that.$vux.toast.text(resp.message, 'middle')
                  that.$vux.confirm.hide()
                }
              }
            }, () => {
              that.$vux.confirm.hide()
              that.$vux.toast.text('回复失败！', 'middle')
              that.content = ''
            })
          }
        })
      },
      chooseOpinion(e) {
        console.log(e.target.innerText)
        this.content = e.target.innerText
      }
    }
  }
</script>
