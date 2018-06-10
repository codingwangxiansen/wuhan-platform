<template>
  <div class="main">
   <!-- <div class="content">
      <div class="title">常用事件类型</div>
      <ul class="clear-float">
        <li  @click="chooseEventType(item)" v-for="(item,index) in commonList"><div>{{item.name}}</div></li>
      </ul>
    </div>-->
    <div class="content" v-for="items in typeData">
      <div class="title">{{items.value}}</div>
      <ul class="clear-float">
        <li
          :class="{'active': chooseCode === item.key}"
          @click="chooseEventType(item)"
          v-for="item in items.children">
          <div>{{item.value}}</div>
        </li>
      </ul>
    </div>
   <!-- <div class="content">
      <div class="title">事故灾难</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.value}" @click="chooseEventType(item)" v-for="item in accidentDisaster"><div>{{item.name}}</div></li>
      </ul>
    </div>
    <div class="content">
      <div class="title">医疗卫生</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.value}" @click="chooseEventType(item)" v-for="item in healthSecurity"><div>{{item.name}}</div></li>
      </ul>
    </div>
    <div class="content">
      <div class="title">社会安全</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.value}" @click="chooseEventType(item)" v-for="item in socialSecurity"><div>{{item.name}}</div></li>
      </ul>
    </div>-->

  </div>
</template>

<script>
  // import { siteUrl } from '../../utils/common'

  export default {
    name: 'event-type-selector',
    props: [],
    data() {
      const eventdata = this.$store.state.eventType
      const leaderdata = this.$store.state.orgUserLeaderGroup
      // const natural = []
      // const accident = []
      // const health = []
      // const social = []
      // for (let i = 0; i < eventType.length; i += 1) {
      //   if (eventType[i].parent === '11000') {
      //     natural.push(eventType[i])
      //   }
      //   if (eventType[i].parent === '12000') {
      //     accident.push(eventType[i])
      //   }
      //   if (eventType[i].parent === '13000') {
      //     health.push(eventType[i])
      //   }
      //   if (eventType[i].parent === '14000') {
      //     social.push(eventType[i])
      //   }
      // }
      return {
        chooseCode: '',
        // commonList: [],
        // typeList: eventType,
        secondTyp: '',
        eventData: eventdata,
        leaderData: leaderdata,
        typeData: [],
        // naturalDisaster: natural,
        // accidentDisaster: accident,
        // healthSecurity: health,
        // socialSecurity: social,
        common: ''
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (vm.$route.params.type === 'eventType') {
          vm.typeData = vm.eventData
          vm.$store.commit('setHeaderTitle', '选择事件类型') // 设置头部文字
          vm.chooseCode = vm.$route.params.code
        } else {
          vm.typeData = vm.leaderData
          vm.$store.commit('setHeaderTitle', '选择领导') // 设置头部文字
        }
        //  循环遍历事件常用次数，排序
        // const commonListStr = localStorage.getItem('commonList')
        // if (commonListStr) {
        //   vm.commonList = JSON.parse(commonListStr)
        // }
        // vm.getEventData()
      })
    },
    created() {
    },
    methods: {
      //  从大到小排序
      compare(x, y) {
        const val1 = x.count
        const val2 = y.count
        if (val1 < val2) {
          return 1
        } else if (val1 > val2) {
          return -1
        }
        return 0
      },
      //  选择事件类型
      chooseEventType(item) {
        const eventType = {
          code: item.key,
          name: item.value
        }
        this.$store.commit('setChooseEventType', eventType)
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
.main{
  background-color: #fff;
  .content{
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 1%;

    .title{
      margin: 2% 0 1% 3%;
      color: #c8c8cd;
    }

    ul{
      padding: 0 0 0 3%;

      li{
        float: left;
        height: 3em;
        line-height: 3em;
        width: 27%;
        margin: 0 2% 2% 0;
        padding: 0 2% 1% 2%;
        background-color: #dddddd;
        text-align: center;
        border-radius: 0.5em;
        font-size: 12px;

        > div {
          line-height: 1.5;
          display: inline-block;
          vertical-align: middle;
        }
      }

      li.active{
        background-color: #248bff;
        color: #FFFFFF;
      }
    }
  }
}
</style>
