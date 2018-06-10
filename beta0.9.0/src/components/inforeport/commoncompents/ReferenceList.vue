<!-- 关联接报	 -->
<template>
  <div class="replyList-transList">
    <group>
      <div class="contenBig" v-show="list.length == 0">
        <div class="nofileContain">
          当前没有关联信息
        </div>
      </div>
      <div class="contenBig" v-show="list.length > 0">
        <div class="fileContain" v-for="(item, index) in list" :key='index' @click="gotoDetail(item)">
          <div class="area">
            <div class="info-title">
              {{item.infoTitle}}
            </div>
            <div class="info-detail">
              {{item.eventDescription}}
            </div>
            <div class="time">{{item.reportOrgName}} {{item.reportPerson}}</div>
            <div class="time">{{item.reportDateStr}}</div>
            <div v-if="isWatch && $store.state.user.typeCode === 1" class="cancelConnect" @click.stop="cancelConnect(item, index)">
              <i class="gs-close-bold cancel"></i>
              取消关联
            </div>
          </div>
        </div>
      </div>
      <div v-if="isWatch && $store.state.user.typeCode === 1" class="connectInfo">
          <span class="backConnect">
            <router-link :to="{path: '/deal/connectinfo/' + eventInfoId}">
              <i class="gs-attach_file connect"></i>
              新建关联
            </router-link>
          </span>
      </div>
    </group>
  </div>
</template>
<style lang="less" scpoed>
  .contenBig .fileContain {
    position: relative;
    padding: 2px 10px;
  }
  .nofileContain{
    padding:10px;
  }
  .backConnect {
    position: absolute;
    top: 25px;
    right: 10px;
    border: 1px solid #999;
    padding: 5px 10px;
    border-radius: 15px;
  }
  .cancelConnect {
    position: absolute;
    bottom: 6px;
    right: 10px;
    border: 1px solid #999;
    padding: 5px 10px;
    border-radius: 15px;
  }
  .connectInfo {
    position: relative;
    height: 40px;
    .backConnect {
      top: 4px;
    }
  }
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
.replyList-transList {
  margin-bottom: 40px;
  .area {
    padding-top: 0;
    border-bottom: 1px solid #ddd;
    .time {
      text-align: left;
      font-size: 12px;
      color: #999;
      font-weight: 400;
      line-height: 20px;
    }
    .info-title {
      font-weight: bold;
      line-height: 25px;
      font-size: 16px;
    }
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
        list: []
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
      // 取消关联
      cancelConnect(item, index) {
        const that = this
        const url = `${config.siteUrl}/eventInfo/mobilecancalconnectinfo?id=${item.eventInfoId}`
        // const data = { id }
        // console.log(id)
        that.$vux.confirm.show({
          title: '确认取消关联？',
          content: '',
          onConfirm() {
            that.axios.get(url)
              .then((res) => {
                if (res.data.code === 200) {
                  that.list.splice(index, 1)
                  this.$vux.toast.text('取消关联成功！', 'middle')
                } else {
                  this.$vux.toast.text('取消关联失败！', 'middle')
                }
              })
              .catch(() => {
              })
          },
          onCancel() {
          }
        })
      },
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
      // 显示补充信息列表
      async loadReference(infoId) {
        const vm = this
        const url = `${config.siteUrl}/eventInfo/${infoId}/referenceEventInfo`
        const response = await this.axios.get(url)
        vm.list = []
        if (response.data.code === 200) {
          vm.list = response.data.response.content
          // 初始化成功  回传数量到页面显示
          vm.$emit('on-init', vm.list.length)
        } else {
          console.error(`loadAddtional failed with code 500, id:${infoId}`)
        }
      },
      gotoDetail(item) {
        let r = ''
        if (item.eventTypeName === '预警信息') {
          r = `/instruct/warn/${item.eventInfoId}`
          this.$store.commit('setInfoPageManipulable', false)
          this.$router.push(r)
          return
        }
        r = `/deal/instructView/2/${item.eventInfoId}`
        this.$router.push(r)
      }
    },
    mounted() {
    }
  }
</script>
