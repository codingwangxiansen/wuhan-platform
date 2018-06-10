<template>
  <div class="searchH">
    <!--<div class="status">-->
      <!--<ul>-->
        <!--<li v-for="(item, index) in readType" :key="index" @click="changeValue(item)">{{item}}</li>-->
      <!--</ul>-->
    <!--</div>-->
    <div class="thingsType">
      <ul>
        <li v-for="(item, index) in commonList" :key="index" @click="changeValue(item.name, item.code)">
          {{item.name}}
        </li>
      </ul>
    </div>
    <div class="history">
      <h3>搜索历史</h3>
      <ul>
        <li v-for="(item, index) in historyList" :key="index" @click="clickHistory(item)">
          <i class="gs-clock"></i>
          {{item}}
          <i class="gs-close2" @click.stop="deletList(index)"></i>
        </li>
        <li class="delet" @click="clearAll()" v-show="historyList.length > 0">
          <i class="gs-trash-o"></i>
          清除历史记录
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .searchH {
    padding: 12px;
    font-size: 12px;
    color: #333;
    .thingsType {
      padding: 10px 0;
      li {
        display: inline-block;
        padding: 5px 0;
        background: #ddd;
        border-radius: 15px;
        width: 32%;
        text-align: center;
        margin-right: 1%;
        margin-bottom: 10px;
      }
    }
    .history {
      font-size: 14px;
      li {
        line-height: 30px;
        border-bottom: 1px solid #e2e2e2;
        position: relative;
      }
    }
    .gs-close2 {
      padding: 10px;
      font-size: 16px;
      font-weight: 700;
      width: 40px;
      text-align: right;
      position: absolute;
      right: 0;
    }
  }
</style>
<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
//  数据模型
  data() {
    return {
      historyList: [],
      readType: [
        '代办信息',
        '未读信息'
      ],
      commonList: [
        { name: '自然灾害', code: '11000' },
        { name: '事故灾难', code: '12000' },
        { name: '公共卫生事件', code: '13000' },
        { name: '社会安全事件', code: '14000' },
        { name: '预警信息', code: '19000' },
        { name: '其它信息', code: '20000' }
      ]
    }
  },
  created() {
  },
  methods: {
//    改变父组件中的值
    changeValue(item, code) {
      const that = this
      that.$emit('on-change-value', item, code)
    },
//    删除某条历史记录
    deletList(index) {
      this.historyList.splice(index, 1)
//    删除缓存里面的历史记录
      window.localStorage.setItem('historyItem', this.historyList)
    },
//    清除所有历史记录
    clearAll() {
      this.historyList = []
//      清空local里面所有的历史缓存
      window.localStorage.setItem('historyItem', [])
    },
    setHistory() {
//      先获取localStorage里面的值，然后往historyList里面push
      console.log('我获取了')
      if (!window.localStorage.getItem('historyItem')) {
        this.historyList = []
      } else {
        this.historyList = []
        const historyI = window.localStorage.getItem('historyItem').split(',')
        this.historyList = this.historyList.concat(historyI)
      }
    },
//    点击历史缓存
    clickHistory(item) {
      console.log('完了，触发历史了')
      this.$emit('on-change-history', item)
    }
  }
}
</script>
