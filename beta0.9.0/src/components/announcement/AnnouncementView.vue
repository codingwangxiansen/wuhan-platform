<template>
  <div id="instruction">
    <div class="tabNav">
      <tab :line-width="2">
        <tab-item
          active-class="red"
          :selected="currentItem === item.itemValue"
          v-for="(item, index) in taglist"
          :key="index"
          @on-item-click="getData(item.itemValue)">
          {{item.itemKey}}
        </tab-item>
      </tab>
    </div>
    <div class="tab-content">
      <!--办理信息-->
      <announcement-detail @on-init="initAnnouncement" v-show="showinstr" ref="loadInit" :id="id"></announcement-detail>
      <!--处理过程-->
      <trans-process v-show="showDetail" ref="loadInitPro" :id="id"></trans-process>
    </div>
    <group class="btnPri">
      <flexbox>
        <flexbox-item>
          <x-button text="回复"
                    @click.native.stop="toBack(announcement.disposeDescription)">
          </x-button>
        </flexbox-item>
        <flexbox-item v-show="announcement.receipt.hasReceipt">
          <x-button :show-loading="buttonLoading"
                    :text="announcement.receipt.receiptStatus === 'WAIT' ? '签收' : '已签'"
                    :disabled="announcement.receipt.receiptStatus !== 'WAIT'"
                    :class="{'disable':announcement.receipt.receiptStatus !== 'WAIT'}"
                    :type="announcement.receipt.receiptStatus === 'WAIT' ? 'warn' : 'theme'"
                    @click.native="preSign(announcement.receipt.receiptStatus)" >
          </x-button>
        </flexbox-item>
      </flexbox>
    </group>
    <watch-popup :popMsg="objPop" ref="popShow" @backChange="backChange"></watch-popup>
  </div>
</template>

<script>
    import { Tab, TabItem, Flexbox, FlexboxItem, Group, XButton } from 'vux'
    import Vue from 'vue'
    import VueResource from 'vue-resource'
    import config from 'src/config'
    import watchPopup from '../inforeport/eventInfo/instruction/watchPopup'
    import TransProcess from '../inforeport/eventInfo/instruction/TransProcess'
    import AnnouncementDetail from './AnnouncementDetail'

    Vue.use(VueResource)
    export default {
      // 组件
      components: {
        Tab,
        TabItem,
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        watchPopup,
        TransProcess,
        AnnouncementDetail
      },
      computed: {
      },
      beforeRouteEnter(to, from, next) {
        next((vm) => {
          // 通过 `vm` 访问组件实例
          vm.id = vm.$router.history.current.params.id
          vm.$store.commit('setHeaderTitle', '通知详情') // 设置头部文字
          vm.getData('instr')
        })
      },
      beforeCreate() {
        const that = this
        this.$nextTick(() => {
          that.$store.dispatch('showPageLoading')
        })
      },
      // 页面加载
      created() {
        this.id = this.$router.history.current.params.id
      },
      mounted() {
      },
      data() {
        return {
          showDetail: 'false',
          showinstr: 'true',
          id: '',
          taglist: [
            { itemKey: '通知内容', itemValue: 'instr' },
            { itemKey: '处理过程', itemValue: 'detailInfo' }
          ],
          currentItem: [],
          announcement: {
            receipt: {}
          }, // 通知公告对象
          objPop: {}, // 传到弹窗子组件的值,
          buttonLoading: false // 控制按钮是否显示loading
        }
      },
      // 方法
      methods: {
        getData(item) {
          const that = this
          const oldItem = that.currentItem
          that.currentItem = item
          that.changeTab(item)
          if (oldItem !== item) {
            this.attachs = []
            that.attachExist = false
          }
        },
        initAnnouncement(announcement) {
          this.announcement = announcement
          const watchObj = {
            infoId: announcement.eventInfoId,
            transactId: announcement.eventDisposeId
          }

          const objPop = {
            watchObj,
            transactContent: announcement.transactContent,
            readType: announcement.readType
          }
          this.objPop = objPop
        },
        changeTab(item) {
          if (item === 'instr') {
            this.showinstr = true
            this.showDetail = false
            this.$refs.loadInit.loadPage(this.id)
          } else {
            this.showinstr = false
            this.showDetail = true
            this.$refs.loadInitPro.loadPage(this.id)
          }
        },
        toBack(txt) {
          this.$refs.popShow.showPop(txt)
        },
        // 确认签收
        preSign(status) {
          if (status === 'OK') { // 已签收点击弹出已经签收
            this.$vux.toast.text('已经签收，不能再次签收！', 'middle')
            return
          }
          const vm = this
          this.$vux.confirm.show({
            title: '确认签收？',
            content: '',
            onConfirm() {
              vm.buttonLoading = true
              vm.sign()
            }
          })
        },
        // 签收动作
        sign() {
          // 签收
          const url = `${config.siteUrl}/eventdispose/${this.id}/signDispose`
          this.$http.get(url).then((res) => {
            if (res.body.code === 200) {
              // 签收后更新状态，刷新签收列表
              this.$refs.loadInit.loadPage(this.id)
              this.$vux.toast.text('签收成功', 'middle')
            }
            this.buttonLoading = false
          })
        },
        backChange() { // 回复之后的操作
          this.$refs.loadInit.loadPage(this.id)
        }
      }
    }
</script>

<style scoped>
.tab-content{
  position: absolute;
  width: 100%;
  top: 44px;
  bottom: 40px;
  overflow: auto;
}

.btnPri {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.disable{
  color: #999999;
}
</style>
