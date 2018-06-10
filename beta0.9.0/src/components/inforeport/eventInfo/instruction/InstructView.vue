<template>
  <div class="info-list">
    <div class="item">
      <instruct-item :data="x"></instruct-item>
    </div>

    <div class="btn-item" v-show="isFeedback">
      <cell class="report-info-col" v-for="(item,index) in list" :key="index">
        <div class="document-desc" slot="inline-desc">
          <span class="read-status"><i :class="readColor(readFlag)"></i></span>
        </div>
        <div class="document-title" slot="inline-desc"><span>{{item.feedbackContent}}</span>
          <x-button class="feedback-btn" :type="change(item.reportFlag)" @click.native="Report">{{item.reportFlagStr}}
          </x-button>
        </div>
        <div class="document-desc" slot="inline-desc">
          <span>{{item.createTimeStr}}</span>
          <span>{{item.userOrgName}}</span>
        </div>
      </cell>
    </div>
    <div v-show="!isFeedback">
      <group title="反馈内容">
        <x-textarea placeholder="请输入反馈内容" v-model="fb.feedbackContent" :rows="4" :max="200">{{fb.feedbackContent}}
        </x-textarea>
      </group>
      <flexbox class="btn-item">
        <flexbox-item>
          <x-button type="theme" @click.native="Save">保存</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn" @click.native="Cancel">取消</x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="btn-item">
      <flexbox v-show="isFeedback">
        <flexbox-item>
          <x-button type="theme" @click.native="addFeedback">添加反馈</x-button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<style type="less" scoped>
  .info-list {
    background: #EDEDED;
  }

  .btn-item {
    margin-top: 6px !important;
  }

  .feedback-btn {
    padding: 0;
    font-size: 12px;
    width: 20% !important;
    height: 30px;
    margin-right: 3px;
  }

  .report-info-col {
    margin-top: 5px;
    background: #fff;
  }

  .document-desc span:first-child {
    display: inline-block;
    margin-left: 10px;
    margin-right: 50px;
  }

  .document-title {
    display: flex;
    font-size: 16px;
    margin-bottom: 3px;
    color: #000;
  }

  .document-title span:first-child {
    display: inline-block;
    max-width: 285px;
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .read-status {
    margin-left: 10px;
  }

  .read-status .read {
    color: inherit;
    font-style: normal;
  }

  .read-status .unread {
    color: #f65741;
    font-style: normal;
  }

</style>
<script>
  import { Cell, Scroller, XButton, Flexbox, FlexboxItem, Group, XTextarea } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../utils/common'
  import TransitionPage from '../../../mycomponents/TransitionPage'
  import InstructItem from './InstructItem'

  Vue.use(VueResource)

  export default {
    // 组件
    components: {
      Flexbox,
      FlexboxItem,
      Cell,
      Scroller,
      XButton,
      InstructItem,
      TransitionPage,
      Group,
      XTextarea
    },
    computed: {},
    // 数据模型
    data() {
      return {
        id: '',
        isFeedback: true,
        fb: {
          instructionId: '',
          feedbackContent: ''
        },
        x: {
          instructionUsername: '',
          instructionContent: '',
          eventTitle: '',
          list: []
        },
        list: [
          {
            feedbackContent: '',
            createTimeStr: '',
            userOrgName: '',
            type: '',
            reportStatus: '上报'
          }
        ],
        readFlag: false,
        readStatus: '未读',
        page: 0,
        size: 10
      }
    },
    beforeRouteEnter(to, from, next) {
      next(
        (vm) => {
          vm.$store.commit('setHeaderTitle', '批示详情')  // 设置头部文字
        }
      )
    },
    beforeCreate() {
      const that = this
      this.$nextTick(() => {
        that.$store.dispatch('showPageLoading')
      })
    },
    created() {
      this.id = this.$router.history.current.params.id
      this.loadPage(this.page)
    },
    // 方法
    methods: {
      Save() {
        const that = this
        that.fb.instructionId = that.id
        that.fb.reportFlag = '0'
        const data = that.fb
        const URL = siteUrl + this.$REST.INSTRUCT.ADDFEEDBACK
        this.$vux.confirm.show({
          title: '确认保存？',
          content: '',
          onConfirm() {
            that.$http.post(URL, data).then((response) => {
              console.log(response)
              if (response.body.code === 200) {
                this.$gsafety.closeWindow(response.body.code)
                that.$vux.toast.text('保存成功', 'middle')
                that.$vux.confirm.hide()
              }
            }, () => {
              that.$vux.toast.text('操作失败', 'middle')
              that.$vux.confirm.hide()
            })
          }
        })
      },
      Cancel() {
        this.isFeedback = true
      },
      Report() {
        const url = `${location.origin}${location.pathname}${this.$DEFAULT.REPORT.sendFeedback}/${this.id}`
        const options = { url, actionBarType: 1, title: '反馈上报' }
        if (this.$gsafety) {
          this.$gsafety.openWindow(options)
        }
      },
      addFeedback() {
        this.isFeedback = false
      },
      readColor(val) {
        if (val) return 'read'
        return 'unread'
      },
      change(val) {
//        console.log(val)
        let type
        if (val === 1) {
          type = 'primary'
        } else {
          type = 'warn'
        }
//        console.log(type)
        return type
      },
      loadPage(page) {
        const that = this
        const url = `${siteUrl}${this.$REST.INSTRUCT.FEEDBACKLIST}/${this.id}`
        this.$http.post(url).then(function (res) {
//          console.log(res)
          if (res.body.code === 200) {
            that.$store.dispatch('hidePageLoading')
            that.x = res.body.response
//            console.log(that.x)
            if (page === 0) {
              this.page = 0
              this.list = []
              // 添加加载效果图
            }

            if (that.x.list.length > 0) {
              const feedback = that.x.list
              if (feedback) {
                const feedbackValArr = Object.values(feedback)
                feedbackValArr.forEach((value) => {
                  that.list.push(value)
                })
              }
            }
          }
        })
      }
    }
  }
</script>
