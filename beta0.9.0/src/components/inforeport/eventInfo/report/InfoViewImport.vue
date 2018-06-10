<!--
	这个界面显示了领导的批示意见，可以多选后进行转办

	checkList比较多时，应该可以滚动

	点击转办后跳转到另一个转办页面
 -->
<template>
  <div>
    <box>
      <checklist label-position="left" title=" " :options="leaderList"
                 v-model="leaderListValue" @on-change="change" :max="1" class="checkBox"></checklist>
      <!--<div class="nothingTips" v-show="showTips">该页面暂无信息</div>-->
      <!--<Group>
        <x-button type="default" @click.native="add" v-if="isHigherAuthorities === 1">+</x-button>
      </Group>-->
      <!--<Group v-show="leaderListValue.length > 0" class="transBtn">
        <x-button type="theme" @click.native="goSendPage">转办</x-button>
      </Group>-->
    </box>
  </div>
</template>
<style lang="less" scoped>
  .nothingTips {
    position: absolute;
    top: 200%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 24px;
    color: #a7a5a5;
    width: 100%;
    text-align: center;
  }
  .vux-label-desc {
    float: left;
    line-height: 2em;
    color: #34669c;
  }

</style>
<script>
  import { Group, CellBox, Checklist, Cell, Divider, XButton, Box } from 'vux'
  import { siteUrl } from '../../../../utils/common'

  export default {
    props: ['eventId'],
    mounted() {
//    this.init()
    },
    components: {
      Group,
      Checklist,
      Cell,
      Divider,
      XButton,
      CellBox,
      Box
    },
    methods: {
      change() {
        // console.log('change', val, label)
      },
      // 显示新增领导的栏位
      add() {
        console.log('showAddPopup')
        this.$emit('on-add-click')
      },
      // 进入转办确认
      goSendPage() {
        const eventId = this.eventId
        const msgid = this.leaderListValue
        const p = `/deal/send/${eventId}?msgid=${msgid}`
        this.$router.push(p)
      },
      // 加载领导批示列表
      init(id) {
        const url = `${siteUrl}/eventdispose/instruct/list/${id}`
        console.log(id)
        const vm = this
        vm.leaderListValue = []
        vm.leaderList = []
        this.$http.get(url).then(function (res) {
          const items = res.body.response
          if (items) {
            const itemArr = Object.values(items)
            itemArr.forEach((value) => {
              const tmp = value
              vm.leaderList.push(
                {
                  key: tmp.eventDisposeId, // createTime
                  value: `<b>${tmp.disposePersonName}</b><br /><span> 批示信息：${tmp.disposeDescription}</span>`,
                  inlineDesc: `批示时间：${tmp.disposeTimeStr}`
                }
              )
            })
          }
          if (vm.leaderList.length > 0) {
            this.showTips = false
          } else {
            this.showTips = true
          }
        })
      }
    },
    watch: {
    },
    data() {
      return {
        leaderList: [
        ],
        leaderListValue: [],
        dataLength: 0,
        showTips: false,
        isHigherAuthorities: this.$store.state.user.typeCode
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
</style>
