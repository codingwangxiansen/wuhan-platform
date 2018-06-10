<template>
  <div class="communicateSearch" style="background:#f4f4f4">
    <div class="header">
      <x-header @on-click-back="back"
                :left-options="{showBack:false,backText:'',preventGoBack:true}">
        <div slot class="selectHeader">
          <input v-focus="focusStatus"
                 @search="goSearchResult"
                 type="search"
                 v-model="searchWords"
                 :placeholder="placeholderValue"/>
          <button class="searchBtn gs-search3" @click="goSearchResult"></button>
        </div>
      </x-header>
    </div>
    <group title="历史搜索">
      <div class="historyOption">
        <a v-for="item in historyItems" @click="popSearchWords(item.keyword)">{{item.keyword}}</a>
      </div>
    </group>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
  // 导入页面所需的标签
  import {
    XHeader,
    Group
  } from 'vux'
  import GsafetySelect from './../gsafetycomponents/GsafetySelect'
  import { searchHistoryController } from '../../utils/common'

  export default {
    // 数据模型
    data() {
      return {
        placeholderValue: '可按手机号、拼音、名字、机构查询',
        searchWords: '',
        historyItems: [],
        preferItems: '',
        focusStatus: false
      }
    },
  // 组件
    components: {
      XHeader,
      GsafetySelect,
      Group
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        vm.searchWords = ''
        vm.focusStatus = true
      })
    },
  // vue实例创建后调用
    created() {
    },
    mounted() {
      const that = this
      that.$nextTick(() => {
        that.focusStatus = true
      })
      that.historyItems = searchHistoryController.getPageHistory('userHistory')
    },
  // 定义方法区
    methods: {
      /**
       * 去结果页面
       */
      goSearchResult() {
        if (this.$gsafety) {
          if (!this.searchWords) {
            alert('请您输入查询内容！')
          } else {
            const historyData = {
              type: 'userHistory',
              keyword: this.searchWords
            }
            const r = encodeURI(`CommunicateQueryResult?${this.searchWords}`)
            this.$router.push(r)
            searchHistoryController.addPageHistory(historyData)
          }
        }
      },
      /**
       * 切换输入内容并且直接跳转结果页
       */
      popSearchWords(newWord) {
        this.searchWords = newWord
        this.goSearchResult()
      },
      /**
       * 返回上页activity
       */
      back() {
        if (this.$gsafety) {
          this.$router.go(-1)
        }
      }
    },
    directives: {
      focus: {
        // directive definition
// eslint-disable-next-line object-shorthand
        update: function (el) {
          el.focus()
        }
      }
    }
  }
</script>
