<template>
  <div>
    <scroller height="-161" lock-x scrollbar-y
              use-pullup
              :pullup-config="pullup_config"
              ref="scroll1"
              use-pulldown
              :pulldown-config="pulldown_config"
              @on-pulldown-loading="loadPage(0, true)"
              @on-pullup-loading="loadPage(page,false)">
      <div>
        <transition-page :options="promptDiagram"></transition-page>
        <checklist label-position="right" required :options="list" v-model="checklists" @on-change="changeCheck"></checklist>
      </div>
    </scroller>
    <div class="loading" v-show="Loaded">
      <img src="../../../../assets/image/eventInfo/index/loading.gif" alt="">
    </div>
    <div class="bottomBtn">
      <x-button type="default" @click.native="confirmConnect">关联信息</x-button>
      <x-button type="theme" @click.native="backPage">返回</x-button>
    </div>
  </div>
</template>
<script>
  import { Scroller, Cell, Checklist, XButton } from 'vux'
  import config from 'src/config'
  import TransitionPage from '../../../mycomponents/TransitionPage'

  export default {
    data() {
      return {
        // 列表信息
        checklists: [],
        list: [],
        // 选择的val
        selectVal: [],
        page: 0,
        pullup_config: {
          content: '',
          downContent: '数据加载中...',
          upContent: '',
          loadingContent: '数据加载中...',
          height: 60
        },
        pulldown_config: {
          content: '',
          downContent: '松开刷新',
          upContent: '松开刷新',
          loadingContent: '数据加载中...',
          height: 60
        },
        id: this.$router.history.current.params.id,
      //  提示图
        promptDiagram: {
          show: false,
          imgUrl: '',
          content: '',
          myColor: {
            type: String,
            default: '#e45050'
          }
        },
        Loaded: false
      }
    },
    components: {
      Scroller,
      Cell,
      Checklist,
      XButton,
      TransitionPage
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.id = vm.$router.history.current.params.id
        vm.loadPage(0, true)
        // 清空列表
        vm.init()
      })
    },
    methods: {
      init() {
        this.list = []
        this.checklists = []
      },
      backPage() {
      //  返回上一页
        this.$router.go(-1)
      },
      confirmConnect() {
      //   关联信息、construction
        const that = this
        const url = `${config.siteUrl}/eventInfo/mobileconnectinfo?ids=${JSON.stringify(that.selectVal)}&id=${that.id}`
        // const data = {}
        // data.ids = JSON.stringify(that.selectVal)
        if (that.selectVal.length < 1) {
          that.$vux.toast.text('请至少选择一个关联信息', 'middle')
          return
        }
        that.$vux.confirm.show({
          title: '信息关联',
          content: '确认关联？',
          onConfirm() {
            that.axios.get(url)
              .then((res) => {
                if (res.data.code === 200) {
                  that.$vux.toast.text('关联成功', 'middle')
                  that.$router.go(-1)
                  that.init()
                } else {
                  that.$vux.toast.text(res.data.message, 'middle')
                }
              })
              .catch(() => {
              })
          },
          onCancel() {
          }
        })
      },
      changeCheck(val) {
        this.selectVal = val
      },
      loadPage(page, flag) {
        const that = this
        that.Loaded = true
        if (!flag) {
          let changePage = page
          changePage += 1
          that.page = changePage
        } else {
          this.page = 0
          that.list = []
        }
        const url = `${config.siteUrl}/eventInfo/beforeconnectlist/${that.id}?page=${that.page}&size=10`
        that.axios.get(url)
          .then((res) => {
            const resData = res.data.response.result
            if (resData.length > 0) {
              that.$refs.scroll1.enablePullup()
              resData.forEach((val) => {
                that.list.push({ key: val.eventInfoId,
                  value: val.infoTitle,
                  inlineDesc: val.createTimeStr })
              })
              that.Loaded = false
              that.promptDiagram.show = false
            } else if (that.list.length <= 0) {
              that.promptDiagram.show = true
              that.promptDiagram.imgUrl = require('assets/image/img-02Notdata.png') // eslint-disable-line global-require
              that.promptDiagram.content = '暂无数据'
            } else if (resData.length < 10) {
              that.$refs.scroll1.disablePullup()
            }
            that.$refs.scroll1.donePullup()
            that.$refs.scroll1.donePulldown()
            that.$nextTick(() => { that.$refs.scroll1.reset() })
          })
          .catch(() => {
          })
      }
    }
  }
</script>
<style lang="less" scoped>
.bottomBtn {
  position: fixed;
  bottom: 0;
  width: 95%;
  background: #ededed;
  padding: 10px;
  z-index: 99;
}
.loading {
  height: 46em;
  position: absolute;
  background: #fff;
  overflow: hidden;
  top: -36px;
}
.loading img {
  width: 10%;
  margin: 50% auto 0 auto;
  display: block;
}
</style>
