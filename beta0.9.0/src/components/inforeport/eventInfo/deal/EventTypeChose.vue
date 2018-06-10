<!--
	事件类型选择器
-->
<template>
<div class="eventType-list">
    <div class="searchInput">
      <search
        placeholder="搜索"
        v-model="value"
        position="relative"
        top="0"
        @on-change="getListItem"
        ref="search"></search>
    </div>
    <h4>常用事件类型：</h4>
    <cell class="report-info-col"
              v-for="(item,index) in oftenTypeList"
              :key="index">
	    <div class="codeType">
  		  {{item.eventTypeName}}
    	</div>
    </cell>
    <div>

    </div>
</div>
</template>
<style lang="less" scoped>
  .vux-label-desc .document-title  span.Done {
    color: #999;
  }
  .report-info-col.activeColor {
    background-color: #ebebeb;
  }
  .searchInput {
    position: relative;
    p {
      text-align: center;
    }

  }
  .vux-search-box {
    z-index: 10001;
  }
  .loading {
    height: 46em;
    position: relative;
    background: #fff;
    overflow: hidden;
  }
  .loading img {
    width: 83%;
    margin: 0em auto;
    display: block;
  }
  .info-list{
    background: #EDEDED;
  }

  .report-info-col{
    background: #fff;
  }
  .document-img{
    width: 20px;
    margin-top: 8px;
  }

  .document-title{
    width: calc(~"100vw - 160px");
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #000;
  }

  .document-title span:first-child{
    display: inline-block;
    vertical-align: middle;
    color: #222;
    font-size: 1.3em;
    font-weight: 600;
  }

  .document-content{
    width: calc(~"100vw - 160px");
    color: #999999;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .document-desc span:first-child{
    display: inline-block;
    width: 160px;
  }

  .document-desc .type-name{
    display: block;
    vertical-align: bottom;
    color: #666;
    font-size: 1.1em;
  }

  .unimp-status{
    display: block;
    color: #ffffff;
    line-height: 30px;
    height: 30px;
    width: 70px;
    position: absolute;
    right: 10px;
    top: 50%;
    text-align: center;
    margin-top: -22px;
    background: #36ba4f;
    border-radius: 30px;
  }

  .read-status{
    display: block;
    color: #ffffff;
    line-height: 30px;
    height: 30px;
    width: 70px;
    position: absolute;
    right: 15px;
    top: 50%;
    text-align: center;
    margin-top: -15px;
    background: #f15a4a;
    border-radius: 30px;
  }
  .dealDone {
    background: #888;
  }
  .read-status .read{
    color: #ffffff;
    font-style: normal;
  }

  .read-status .unread{
    color: #36ba4f;
    font-style: normal;
  }

  .dist-info-type{
    margin-right: 10px;
    float: right;
    color: #03A9F4;
  }

  .document-desc span {
    color : #b6b6b6;
  }

  .document-desc span i {
    color : #03A9F4;
  }

  span.typeMain {
    color:#222;
  }
  /*左边条*/
  .report-info-col .leftLine {
    display: inline-block;
    width: 5px;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }

  .cell-icon{
    width: 50px;
    height: 50px;
    position: relative;
    text-align: center;
    border-radius: 5px;
    font-size: 22px;
    font-weight: bold;
    color: #ffffff;
    margin-right: 10px;
    line-height: 25px;
  }
  .icon-done .cell-icon{
    opacity: 0.6;
  }
  .cell-icon.unread:after{
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    background: #d43e2f;
    border-radius: 5px;
    position: absolute;
    right: -6px;
    top: -6px;
  }

  .cell-icon.red{
    background:  #f15a4a;
  }

  .cell-icon.yellow{
    background:  #fdc400;
  }

  .cell-icon.orange{
    background:  #ff890a;
  }

  .cell-icon.blue{
    background:  #138ce9;
  }

  /*不同等级颜色*/
  .lineRed {
    background-color: #f73535;
  }
  .lineYellow {
    background-color: #ffb818;
  }
  .lineOrange {
    background-color: #ff7418;
  }
  .lineBlue {
    background-color: #2d41bb;
  }
</style>
<script>
  import { Cell, Scroller, Search, Group, XButton } from 'vux'
  import Vue from 'vue'
  import { siteUrl, $gsafety, fileserver } from '../../../../utils/common'

  export default {
    name: 'EventTypeChose',
    props: ['value', 'options', 'typeCode'],
    data() {
      const eventType = this.$store.state.eventType
      for (let i = 0; i < eventType.length; i += 1) {
        eventType[i].parent = eventType[i].parent === '10000' ? 0 : eventType[i].parent
      }
      return {
        oftenTypeList: [],
        secondTyp: ''
      }
    },
    created() {
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        console.log('我进来了')
        vm.getListItem()
        vm.$store.state.isRefresh = false
      })
    },
    // 组件
    components: {
      Group,
      Cell,
      Vue,
      XButton,
      Search
    },
    //
    computed: {
    // 与父组件通信用属性
      itemArray: {
        get() {
          // 查找事件类型的父类型
          let p = ''
          if (typeof (this.typeList) === 'undefined') {
            return ['', '']
          }
          this.typeList.forEach(
              /* eslint no-unused-vars: 0 */
              ({ name, value, parent }) => {
                if (value === this.value) {
                  p = parent
                }
              })
          if (typeof this.value === 'object' && this.value) {
            this.secondTyp = this.value[0]
          } else {
            this.secondTyp = this.value
          }
          return ['', this.secondTyp]
        },
        set(val) {
          this.$emit('input', val[1])
        }
      }
    },
    methods: {
      getListItem() {
        this.$store.dispatch('showPageLoading')
        const URL = `${siteUrl}/eventInfo/list/eventTypeList`
        const that = this
        const param = {}
        that.axios.post(URL, param)
          .then((response) => {
            that.oftenTypeList = []
            const allTypes = response.data.response.often
            if (allTypes) {
              const infosValArr = Object.values(allTypes)
              infosValArr.forEach((value) => {
                that.oftenTypeList.push(value)
              })
            }
            that.$store.dispatch('hidePageLoading')
          })
          .catch(() => {})
      }
    }
  }
</script>
