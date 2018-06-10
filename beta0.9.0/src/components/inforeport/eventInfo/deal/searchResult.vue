<template>
  <div class="searchR">
    <p class="searchNum">共搜索到<span>{{titleList.length}}</span>条</p>
    <div class="searchResult">
      <ul>
        <li v-for="(item, index) in titleList" :key="index" @click="searchItem(item.link)">
          <p>{{item.first}}<b>{{item.second}}</b>{{item.three}}</p>
          <p v-show="!item.second">内容包含：<b>{{item.content}}</b></p>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .searchNum {
    font-size: 12px;
    color: #333;
    padding: 0 12px;
    line-height: 40px;
  }
  .searchResult {
  li {
    font-size: 14px;
    color: #333;
    margin: 0 12px;
    padding: 10px 0;
    border-bottom: 1px solid #e2e2e2;

  }
  }
</style>
<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      list: {
        type: Array,
        default() {
          return []
        }
      }
    },
//  数据模型
    data() {
      return {
        changeList: [],
        titleList: []
      }
    },
    created() {
//      this.splitStr()
    },
    watch: {
    },
    methods: {
//      分割关键字
      splitStr(pList, key) {
        const that = this
        let titltStr = {}
        let titleArr = []
        that.titleList = []
        pList.forEach((value) => {
          titleArr = []
          titltStr = {}
          titleArr = value.infoTitle.split(key)
//          假如是草稿的话就进入编辑 假如是上报的话就进入详情
          const typeCode = (value.infoStatus === '0') || (value.isBack === '1')
//          编辑路由
          const editRout = value.info.link.draft
//          详情路由
          const viewRout = value.info.link.view
          if (value.infoTitle.indexOf(key) === 0) {
            titltStr = {
              first: '',
              second: key,
              three: titleArr.join(''),
              content: key,
              link: typeCode ? editRout : viewRout
            }
          } else if (value.infoTitle.indexOf(key) === -1) {
            titltStr = {
              first: '',
              second: '',
              three: value.infoTitle,
              content: key,
              link: typeCode ? editRout : viewRout
            }
          } else {
            titltStr = {
              first: titleArr[0],
              second: key,
              three: titleArr[1],
              content: key,
              link: typeCode ? editRout : viewRout
            }
          }
          that.titleList.push(titltStr)
        })
      },
//      点击列表时进入详情
      searchItem(r) {
        const that = this
//        储存历史记录的historyItem
//        获取该本地存储
        const historyI = window.localStorage.getItem('historyItem')
        that.$router.push(r)
//        判断是否有改储存
        if (!historyI) {
//          如果为空就直接赋值
          window.localStorage.setItem('historyItem', that.value)
        } else {
//          如果搜索值为空
          if (!that.value) {
            return
          }
//          如果不为空，先获取到值，再网里面push添加
          const getItems = window.localStorage.getItem('historyItem').split(',')
          getItems.push(that.value)
//          再设置
          window.localStorage.setItem('historyItem', getItems)
        }
      }
    }
  }
</script>
