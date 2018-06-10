<!-- 转办列表显示控件控件	 -->
<template>
  <div class="replylist-transList" :class="{'has-list':timeLine.length}">
    <div class="contenBig">
      <div v-for="(item, index) in timeLine" :key="index">
        <div v-for="(temp) in item.data" class="area">
          <div class="replyList-content"
               v-html="getDescription(temp.disposeDescription)">
          </div>
          <div class="time">{{temp.disposeTimeStr}}</div>
        </div>
      </div>
      <div class="bottom" v-if="options.showFooter && isWatch">
        <span class="btnBottom" @click="showAddtionalDialog">
          <i class="gs-commenting-o"></i>
          补充信息
        </span>
      </div>
    </div>
    <feed-back @on-save='setList' ref="feed" :options="{title: '补充事件信息',
      placeholder: '请输入内容'}"></feed-back>
  </div>
</template>
<style lang="less" scpoed>
  .contenBig .bottom {
    overflow: hidden;
    padding: 0 0 7px 40px;
    position: relative;
    height: 30px;
  }
  .contenBig .btnBottom {
    padding: 5px 15px;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 12px;
    float: right;
    line-height: 20px;
    font-weight: 600;
    margin-left: 5px;
  }

  .contenBig .btnBottom.unSign{
    border-color: #E64340;
    background: #E64340;
    color: #ffffff;
  }

  .contenBig .btnBottom.sign{
    border-color: #dddddd;
    background: #dddddd;
    color: #666;
  }
  .area {
    padding-top: 3px;
  }
  .area .time {
    text-align: left;
    font-size: 12px;
    color: #999;
    font-weight: 400;
    line-height: 20px;
  }
  .area .replyList-content {
    // margin: 1px 3px 3px 3px;
    // padding: 5px 16px 0 16px;
  }
  .replyList-author {
    font-size: 12px;
    color: #999;
    font-weight: 400;
    margin: 8px;
  }
  .contenBig .clear {
    overflow: hidden;
    padding: 0 0 7px 40px;
    position: relative;
    height: 30px;
  }
.replylist-transList {
  padding: 5px 16px;
  margin-top: -15px;
  &.has-list{
    margin-top:0;
  }
  .area {
    padding-top: 3px;
    border-bottom: 1px solid #ddd;
  }
  .backContent {
    background-color: #e2e2e2;
    padding: 5px 10px 0 10px;
    border-radius: 6px;
    position: relative;
    margin: 13px 10px 0 10px;
    &:after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: #e2e2e2;
      top: -8px;
      transform: rotateZ(39deg);
      left: 25px;
      border-radius: 5px;
    }
    .backInfo {
      font-size: 14px;
      line-height: 22px;
      color: #444;
      position: relative;
      z-index: 99;
      span:nth-child(2) {
        font-size: 12px;
      }
    }
    .backMsg {
      color: #111;
      line-height: 20px;
    }
  }
  p {
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
<script>
  import { Cell, Popup, Panel, Group, Divider } from 'vux'
  import config from 'src/config'
  import FeedBack from './FeedBack'

  export default {
    props: ['eventInfoId', 'options', 'isWatch'],
    data() {
      return {
        list: [
          {},
          {}]
      }
    },
    components: {
      Cell,
      Popup,
      Panel,
      Group,
      Divider,
      FeedBack
    },
    computed: {
      // 按人聚合事件
      group: {
        get() {
          const t = []
          const index = {}
          this.list.forEach((item) => {
            const key = `key_${item.disposePersonId}`
            let tmp = index[key]
            if (tmp) {
              tmp.push(item)
            } else {
              tmp = []
              index[key] = tmp
              tmp.push(item)
              t.push({ data: tmp, group: item })
            }
          })
          return t
        }
      },
      // 按时间分类，然后聚合显示
      timeLine: {
        get() {
          const t = []
          let last = ''
          let tmp
          this.list.forEach((item) => {
            const current = item.disposePersonId
            if (last === current) {
              tmp.data.push(item)
            } else {
              last = current
              const p = { data: [], group: item }
              p.data.push(item)
              tmp = p
              t.push(p)
            }
          })
          return t
        }
      }
    },
    methods: {
      // 提交确定提交
      setList(obj) {
        const vm = this
        vm.$refs.feed.hideMask()
        vm.$vux.confirm.show({
          title: '追加事件信息',
          content: '确认保存？',
          onConfirm() {
            // 用户确认，保存信息
            vm.saveAdditional(obj)
          },
          onCancel() {
            // 用户取消，重新显示dialog
            vm.$refs.feed.showMask({ selfFlag: true })
          }
        })
      },
      // 显示新增窗口
      showAddtionalDialog() {
        this.$refs.feed.showMask({ selfFlag: true })
      },
      // saveAddtional
      saveAdditional(obj) {
        const vm = this
        const url = `${config.siteUrl}/eventInfo/${vm.eventInfoId}/additional`
        const data = {
          description: obj
        }
        this.axios.post(url, data)
          .then((response) => {
            if (response.data.code === 200) {
              vm.$vux.toast.text('信息追加完成', 'middle')
              // 追加完成之后清空回复框
              vm.loadAdditional()
              vm.$refs.feed.clear()
            } else {
              vm.$vux.toast.text(response.data.message, 'middle')
              vm.$emit('on-error', response.data)
            }
          })
          .catch(() => {
            vm.$vux.toast.text('系统繁忙，请稍后再试', 'middle')
            const errorMessage = { code: 500, message: '系统繁忙，请稍后再试' }
            vm.$emit('on-error', errorMessage)
          })
      },
      // 显示补充信息列表
      async loadAdditional() {
        const vm = this
        const disposeType = '30'
        const url = `${config.siteUrl}/eventInfo/${vm.eventInfoId}/timeline/${disposeType}`
        vm.list = []
        const response = await this.axios.get(url)
        if (response.data.code === 200) {
          vm.list = response.data.response
          vm.$emit('on-init', vm.list)
        } else {
          console.error(`loadAddtional failed with code 500, id:${vm.eventInfoId}`)
        }
      },
      getDescription(description) {
        let newDescription = ''
        if (description) {
          newDescription = description
          newDescription = newDescription.replace(/\r\n/g, '<br/>')
          newDescription = newDescription.replace(/\n/g, '<br/>')
          newDescription = newDescription.replace(/\s/g, '&nbsp;')
        }
        return newDescription
      }
    }
  }
</script>
