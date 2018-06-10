<!-- 与我相关的时间信息列表 -->
<template>
  <div class="main-page">
    <div v-show="infoList.length > 0">
      <cell v-for="(info,index) in infoList"
            @click.native="goDetail(info)"
            class="info-cell"
            :key="index">
        <i slot="icon" class="gs-bell2"></i>
        <div slot="title">
          您有{{1}}条来自于[{{info.disposePersonName}}]的{{getDisposeType(info.disposeType)}}
        </div>
        <div slot="inline-desc">{{info.disposeTimeStr}}</div>
        <i class="gs-chevron-right"></i>
      </cell>
    </div>
    <div v-show="infoList.length == 0">
      <i slot="icon" class="gs-bell2"></i>
      <div slot="title">
        暂无消息
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.main-page{
  background: #FFFFFF;
}

.info-cell{
  line-height: 30px;
}

.info-cell i.gs-bell2{
  margin-right: 10px;
  font-size: 30px;
  color: green;
}


</style>
<script>
  import { Cell } from 'vux'
  import { siteUrl } from '../../../utils/common'

  export default {
    components: {
      Cell
    },
    data() {
      return {
        infoList: []
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        vm.$store.commit('setHeaderTitle', '与我相关') // 设置头部文字
        vm.id = vm.$router.history.current.params.id
        vm.feachData(vm.id)
      })
    },
    methods: {
      feachData(id) {
        const url = `${siteUrl}/eventInfo/get-about-me-info/${id}`
        // const that = this
        this.axios.get(url).then((res) => {
          if (res.data.code === 200) {
            this.infoList = res.data.response
          }
        })
      },
      goDetail(info) { // 返回办理页面
        this.$store.commit('setDealWindow', info.disposeType)
        this.$router.back()
      },
      getDisposeType(type) { // 获取事件处理类型
        switch (type) {
          case '1':
            return '上报信息'
          case '2':
            return '拟办意见'
          case '3':
            return '审核意见'
          case 4:
            return '续报信息'
          case 5:
            return '转办督办意见'
          case 6:
            return '转办督办意见'
          case 7:
            return '反馈意见'
          case 8:
            return '呈报意见'
          case 9:
            return '关联信息'
          case 10:
            return '退报信息'
          case 11:
            return '送审意见'
          case 12:
            return '批示信息'
          case 13:
            return '回复意见'
          case 14:
            return '接报信息'
          case 15:
            return '批示转办'
          case 16:
            return '办结意见'
          case 20:
            return '签收意见'
          case 99:
            return '编辑'
          default:
            return ''
        }
      }
    }
  }
</script>
