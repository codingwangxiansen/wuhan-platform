<template>
<div>
  <ul>
    <li v-for="(item,index) in list"
        :key="index">
      <div>
        <i class="gs-file-text-o"></i>
        <span class="continue">续报{{index+1}}</span>
        <span class="user">{{item.reportPerson}}</span>
      </div>
      <div class="text">{{item.eventDescription}}</div>
      <div class="contain-img" v-if="item.attachExist">
          <attach-upload
            :attachs="item.attachId"
            :canUpload="false"></attach-upload>
      </div>
      <div class="footer">
        <span>{{item.reportDateStr}}</span>
        <span class="addr">{{item.reportOrgName}}</span>
      </div>
    </li>
  </ul>
</div>
</template>

<style scoped>
  ul,li{
    list-style: none;
  }
  li{
    background-color: #ffffff;
    margin: 3% auto 0 auto;
    padding: 2%;
    font-size: 0.9em;
  }
  i{
    font-size: 1.1em;
    margin-right: 1%;
  }
  .img{
    width: 30%;
    height: 5.5em;
    margin: 0 1%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .imgatt{
    width: 100%;
    height: 100%;
  }
  .continue{
    font-weight: bold;
  }
  .text{
    font-size: 1.1em;
  }
  .user{
    margin-left: 10%;
  }
  .addr{
    margin-left: 5%;
  }

</style>
<script>
  import VueResource from 'vue-resource'
  import { Cell, Scroller, Search, Group, XButton } from 'vux'
  import Vue from 'vue'
  import { siteUrl, fileserver } from '../../../../utils/common'
  import TransitionPage from '../../../mycomponents/TransitionPage'
  import AttachUpload from '../../../mycomponents/AttachUpload'

  Vue.use(VueResource)

  export default {
    name: 'connection-report',

    // 数据模型
    data() {
      return {
//        滚动高度
        scrollH: '-132',
        results: [],
        value: '',
        isDiffTime: '99',
        currentUser: {},
        infos: {},
        list: [],
        attachs: [],
        page: 0,
        size: 25,
        imgsrc: require('assets/image/img-05NotExist.png'),
        pullup_config: {
          content: '',
          downContent: '数据加载中...',
          upContent: '',
          loadingContent: '数据加载中...',
          hight: 60
        },
        pulldown_config: {
          content: '',
          downContent: '松开刷新',
          upContent: '松开刷新',
          loadingContent: '数据加载中...',
          hight: 60
        },
        // 提示图
        promptDiagram: {
          show: false,
          imgUrl: '',
          content: '',
          myColor: {
            type: String,
            default: '#e45050'
          }
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        const leftOption = {
          showBack: true,
          backText: '',
          preventGoBack: false
        }
        vm.id = vm.$router.history.current.params.id
        vm.getListItem(vm.id)
        vm.$store.commit('setHeaderLeft', leftOption) // 离开首页 加上回退
        vm.$store.commit('setHeaderTitle', '续报查看') // 设置头部文字
      })
    },
    beforeRouteLeave(to, from, next) {
      this.searchShow = false
      this.$store.commit('setHeaderRightIcon', '')
      next()
    },
    // 组件
    components: { Cell, Scroller, TransitionPage, Search, Group, XButton, AttachUpload },
    beforeCreate() {
      this.$store.dispatch('showPageLoading')
    },
    // 页面加载
    created() {
      this.id = this.$router.history.current.params.id
      this.currentUser = this.$store.state.user
      this.getListItem(this.id)
    },
    // 方法
    methods: {
      // next中为了避免修改形参，改成函数修改
      changeVal(key, val) {
        this[key] = val
      },
      getAttachPath(item) {
        return fileserver + item
      },
      // 模糊查询
      getListItem(id) {
        this.$store.dispatch('showPageLoading')
        const URL = `${siteUrl}/eventInfo/list/continuedReport/${id}`
        const that = this
        const param = {
          keyWord: that.value
        }
        that.axios.post(URL, param)
          .then((response) => {
            that.list = []
            const infos = response.data.response.result
            if (infos) {
              const infosValArr = Object.values(infos)
              infosValArr.forEach((value) => {
                that.list.push(value)
              })
            }
            that.$store.dispatch('hidePageLoading')
          })
          .catch(() => {

          })
      },
      // 滑动时 清除长按事件
      moveTouch() {
        this.showAction = true
        clearTimeout(this.Loop)
      },
      // 上报时间与当前时间相比的间隔时长
      getDiffTimer(reportTime) {
        const date = new Date(reportTime)
        // 计算时间间隔，单位为分钟
        return parseInt((new Date().getTime() - date.getTime()) / 1000 / 60, 10)
      }
    }
  }
</script>
