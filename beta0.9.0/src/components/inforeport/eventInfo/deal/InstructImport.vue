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
	  	<box gap="10px 10px">
	  		<x-button type="default" @click.native="add" v-if="isHigherAuthorities === 1 && isWatch">录入</x-button>
	  	</box>
	  	<box  gap="10px 10px" v-show="leaderListValue.length > 0 && isWatch && isHigherAuthorities === 1">
	  		<x-button type="default" @click.native="goSendPage">转办</x-button>
        <x-button type="default" @click.native="upLeaderList">上移</x-button>
	  	</box>
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
  props: ['eventId', 'isWatch'],
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
    },
    // 显示新增领导的栏位
    add() {
      this.$emit('on-add-click')
    },
    // 进入转办确认
    goSendPage() {
      const eventId = this.eventId
      const msgid = this.leaderListValue
      this.infoArr.forEach((value) => {
        if (msgid[0] === value.key) {
          this.$store.commit('setLeaderBack', value.desc)
        }
      })
      const p = `/deal/send/${eventId}?msgid=${msgid}`
      this.$router.push(p)
    },
    upLeaderList() {
      const msgid = this.leaderListValue
      const url = `${siteUrl}/eventInfo/upleaderlist/${msgid}`
      this.$http.get(url).then((res) => {
        this.$vux.toast.text(res.body.response, 'middle')
        this.init(this.eventId)
      })
    },
    // 加载领导批示列表
    async init(id) {
      const url = `${siteUrl}/eventdispose/instruct/list/${id}`
      const vm = this
      vm.leaderListValue = []
      const res = await this.$http.get(url)
      vm.leaderList = []
      const items = res.body.response
      if (items) {
        const itemArr = Object.values(items)
        vm.$emit('on-init', itemArr.length)
        itemArr.forEach((value) => {
          const tmp = value
          vm.infoArr.push({ key: tmp.eventDisposeId, desc: tmp.disposeDescription })
          vm.leaderList.push(
            {
              key: tmp.eventDisposeId, // createTime
              value: `<b>${tmp.indirectPerson}</b><span>${tmp.disposeTimeStr}</span>`,
              inlineDesc: `批示信息：${tmp.disposeDescription}`
            }
          )
        })
      }
      if (vm.leaderList.length > 0) {
        this.showTips = false
      } else {
        this.showTips = true
      }
    }
  },
  watch: {
//    leaderList(cur) {
//      if (cur.length > 0) {
//        this.showTips = false
//      } else {
//        this.showTips = true
//      }
//    }
  },
  data() {
    return {
      infoArr: [],
      leaderList: [
      //  {key: '1', value: '市长 某某', inlineDesc: '从 v2.6.2 开始，max=1即为单选模式，不会要求先取消上一个选中的才能选中下一个值。'},
      //  {key: '2', value: '副市长 某某', inlineDesc: '从 v2.6.2 开始，max=1即为单选模式，不会要求先取消上一个选中的才能选中下一个值。
      // 从 v2.6.2 开始，max=1即为单选模式，不会要求先取消上一个选中的才能选中下一个值。'},
      //  {key: '3', value: '秘书长 某某', inlineDesc: '从 v2.6.2 开始，max=1即为单选模式，不会要求先取消上一个选中的才能选中下一个值。'}
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
