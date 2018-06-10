<!--信息接报首页-->
<template>
  <div>
    <app-scroller ref="appScroll" @on-refresh="refresh">
      <nav class="menu-part">
        <ul>
          <li :class="item.menuImg" @click="jumpPage(item.url)" v-for="(item,index) in menus" :key="index">
            <a>
              <i></i>
              <i v-if="item.toHandler && (currentUser.typeCode === 1 || index != 0)" class="status-num">{{getMenuNum(item.toHandler)}}</i>
              <i v-if="item.toRead && (currentUser.typeCode === 1 || index != 0)" class="menu-status"></i>
            </a>
            <p>{{item.menuName}}</p>
          </li>
        </ul>
      </nav>
      <section class="message-content">
        <header><i class="gs-commenting-o"></i>最近消息</header>
        <section>
          <div>
            <cell class="report-info-col"
                  v-for="(item,index) in info"
                  :key="index"
                  @click.native="goDetailPage(item,index)"
                  v-show="isNew">
              <!--区域+标题-->
              <div class="document-index-title"
                   :title="item.infoTitle"
                   :class="{'Done':item.handleStatus === '4' && item.userHandler!=='1', 'unRead': item.userRead == 0}">
                <span class="title-span">{{item.infoTitle}}</span>
                <span class="descTime">{{getTimeStr(item.createTimeStr)}}</span>
              </div>
            </cell>
            <cell v-show="!isNew" class="report-info-col report-info">
              <p class="title">暂无最新消息！</p>
            </cell>
          </div>
          <router-link v-show="isNew" to="/deal" class="addMore">更多</router-link>
        </section>
      </section>
      <section class="amount-content" v-if="isHigherAuthorities === 1">
        <header><i class="gs-line-chart"></i>统计汇总<span @click.prevent="upDownChange" :class="isSuperior ? 'gs-caret-down' : 'gs-caret-up' "></span></header>
        <div :class="isSuperior ? '' : 'nohig'">
          <div class="tab-width">
            <tab :line-width="2">
              <tab-item active-class="red"
                        :selected="currentItem === item.itemValue"
                        v-for="(item,index) in taglist" :key="index"
                        @on-item-click="getData(item.itemValue)">{{item.itemKey}}
              </tab-item>
            </tab>
          </div>
          <div class="moreposition">
            <router-link to="/statisbtn" class="moreStat addMore">更多</router-link>
          </div>
          <section v-show="statCharts" class="canvas-position">
            <div id="statChart" ref="statChart">
            </div>
          </section>
          <section  v-show="PieCharts" class="canvas-position">
            <div id="PieChart" ref="PieChart">
            </div>
          </section>
          <section v-show="UpCharts" class="canvas-position">
            <div id="UpChart" ref="UpChart">
            </div>
          </section>
        </div>
      </section>
    </app-scroller>
  </div>
</template>
<style lang="less" scoped>
  .document-index-title{
    .title-span{
      display: inline-block;
      width: calc(~"100% - 30px");
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
    &.unRead:before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: #d43e2f;
      border-radius: 5px;
      position: absolute;
      left: 6px;
      top: 16px;
    }
    &.Done{
      color: #999999;
    }
    text-align: left;
    color: #000;
    font-size: 16px;
    padding: 3px;
  }

  .canvas-position {
    position: relative;
  }
  .message-content ul .activeColor {
    background-color: #ebebeb;
  }
  .addMore {
    text-align: center;
    line-height: 2em;
    background: #fafafb;
    color: #555;
    display: block;
  }
  .moreStat {
    background-color: #fff;
  }
  .gs-commenting-o {
    color:#527baa;
    margin-right: 0.5em;
  }
  .menuNav {
    overflow: hidden;
  }
  li{
    list-style: none;
  }

  .menu-part{
    background: #fff;
    border-bottom:1px solid #e2e2e2;
    padding: 0 15px;
  }

  .menu-part ul{
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0 1px 0;
  }

  .menu-part ul li{
    flex: 1;
    text-align: center;
    line-height: 28px;
    min-width:25%;
    max-width: 25%;
  }

  .menu-part ul li a{
    position: relative;
    display: block;
    margin: auto;
    width: 12vw;
    height: 12vw;
    line-height:12vw;
    -webkit-border-radius: 12vw;
    -moz-border-radius: 12vw;
    border-radius: 12vw;
    text-align:center;
    .status-num{
      position: absolute;
      top: 0;
      display: block;
      width: 20px;
      height: 20px;
      font-size: 12px;
      right: -5px;
      text-align: center;
      line-height: 20px;
      border-radius: 50%;
      background: #d43e2f;
      color: #fff;
      font-style: normal;
      z-index: 100;
    }
    .menu-status{
      position: absolute;
      top: 2px;
      display: block;
      width: 12px;
      height: 12px;
      right: 1px;
      border-radius: 50%;
      background: #d43e2f;
      z-index: 99;
    }
  }

  .menu-part ul li p{
    font-weight: bold;
    color: #666666;
    font-size: 13px;
  }

  .btn-1 a{
    background: url("../../assets/image/eventInfo/index/menu-btn-bg-3.png");
    background-size: 100% 100%;
    box-shadow: 2px 2px 5px #fecf7d;
  }

  .btn-2 a{
    background: url("../../assets/image/eventInfo/index/menu-btn-bg-2.png");
    background-size: 100% 100%;
    box-shadow: 2px 2px 5px #8cc3ff;
  }

  .btn-3 a{
    background: url("../../assets/image/eventInfo/index/menu-btn-bg-1.png");
    background-size: 100% 100%;
    box-shadow: 2px 2px 5px #63a7f0;
  }

  .btn-4 a{
    background: url("../../assets/image/eventInfo/index/menu-btn-bg-4.png");
    background-size: 100% 100%;
    box-shadow: 2px 2px 5px #a3e8ac;
  }

  .btn-5 a{
    background: url("../../assets/image/eventInfo/index/menu-btn-bg-3.png");
    background-size: 100% 100%;
    box-shadow: 2px 2px 5px #a6e1e8;
  }

  .btn-6 a{
    background: url("../../assets/image/eventInfo/index/menu-btn-bg-2.png");
    background-size: 100% 100%;
    box-shadow: 2px 2px 5px #8cc3ff;
  }

  .btn-7 a{
    background: url("../../assets/image/eventInfo/index/menu-btn-bg-4.png");
    background-size: 100% 100%;
    box-shadow: 2px 2px 5px #a3e8ac;
  }

  .btn-8 a{
    background: url("../../assets/image/eventInfo/index/menu-btn-bg-5.png");
    background-size: 100% 100%;
    box-shadow: 2px 2px 5px #9de6dc;
  }

  .menu-part a i{
    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: url("../../assets/image/eventInfo/index/menu-icon-1.png");
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .btn-2 a i{
    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: url("../../assets/image/eventInfo/index/menu-icon-2.png");
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .btn-3 a i{
    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: url("../../assets/image/eventInfo/index/menu-icon-3.png");
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .btn-4 a i{
    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: url("../../assets/image/eventInfo/index/menu-icon-9.png");
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .btn-5 a i{
    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: url("../../assets/image/eventInfo/index/menu-icon-5.png");
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .btn-6 a i{
    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: url("../../assets/image/eventInfo/index/menu-icon-6.png");
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .btn-7 a i{
    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: url("../../assets/image/eventInfo/index/menu-icon-7.png");
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .btn-8 a i{
    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: url("../../assets/image/eventInfo/index/menu-icon-8.png");
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .message-content{
    background: transparent;
    margin-top: 10px;
  }

  .message-content header{
    line-height: 34px;
    font-size: 16px;
    color: #555;
    background:#fff;
    border-bottom: 1px solid #e2e2e2;
    padding: 0 15px;
    font-weight: bold;
  }

  .message-content ul li{
    line-height: 25px;
    position: relative;
    margin: 5px 10px;
    background: #fafafa;
    padding: 5px 15px;
    border-radius: 5px;
    overflow: hidden;
  }
  .message-content .title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  .message-content ul li p:last-child{
    color: #999999;
  }

  .message-content .status{
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 24px;
    border-top-right-radius: 5px;
    background: #ef6b6b;
  }

  .message-content .dealing .status{
    background: #ffb818;
  }
  .message-content .done .status{
    background: #4c98ff;
  }
  .message-content .status .status-icon{
    position: absolute;
    color: #fff;
    font-weight: bold;
    right: 5px;
    top: 3px;
    font-size: 10px;
    line-height: 10px;
  }

  .message-content .dealing .status .status-icon{
    right: 3px;
    top: 1px;
    font-size: 6px;
    line-height: 6px;
  }

  .message-content .done .status .status-icon{
    right: 3px;
    top: 4px;
    font-size: 6px;
    line-height: 6px;
  }
  .message-content .btn-more{
    line-height: 40px;
    text-align: center;
    background: #fafafa;
    color: #8e8e8e;
  }

  .amount-content{
    background: #fff;
    margin-top: 10px;
  }

  .amount-content header{
    line-height: 34px;
    font-size: 16px;
    color: #000;
    border-bottom: 1px solid #eceef1;
    padding: 0 15px;
    font-weight: bold;
    position: relative;
    span {
      position: absolute;
      right: 0.5em;
      text-align: right;
      font-size: 1.5em;
      color: #666;
      top: 0.2em;
      width: 10em;
    }
  }
  .amount-content img{
    width: 100%;
  }
  .gs-message{
    color: #527baa;
    margin-right: 10px;
    vertical-align: -2px;
    font-size: 20px;
  }
  .gs-line-chart{
    color: #527baa;
    margin-right: 10px;
    vertical-align: -2px;
    font-size: 20px;
  }
  .message-content .desc span{
    display: block;
  }
  .gs-location{
    margin-right: 4px;
  }
  .gs-clock{
    margin-right: 4px;
  }
  #statChart, #PieChart {
    height: 300px;
    width: 100%;
  }
  #UpChart{
    height: 500px;
    width: 100%;
  }
  div.nohig {
    height: 0;
    overflow: hidden;
    padding: 0;
  }
  .tab-width {
    width:  60%;
  }
  .moreposition {
    width: 30%;
    position: relative;
    right: 0;
    display: block;
    height: 44px;
    top: -38px;
    float: right;
  }
  /*重新*/
  .titleDown {
    text-align: left;
    margin-top: 5px;
  }
  .vux-label-desc .document-title  span.Done {
    color: #888;
  }
  .descTime {
    font-size: 12px;
    float: right;
    margin-top: 8px;
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
    width: 10%;
    margin: 50% auto 0 auto;
    display: block;
  }
  .info-list{
    background: #EDEDED;
  }

  .report-info-col{
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    border-top: 1px solid #fff;
    margin: 0px 0;
    padding: 2px 15px;
    &:before {
      display: none;
    }
  }
  .report-info {
    margin: 0;
    .title {
      font-size: 16px;
    }
  }
  /*状态*/
  .dealDone {
    color: #999;
    font-weight: 100;
  }
</style>
<script>
  import config from 'src/config'
  import { Tab, TabItem, Cell } from 'vux'
//  import { pageUtils } from '../../utils/common'
  import AppScroller from '../mycomponents/AppScroller.vue'

  export default{
    data() {
      return {
        statCharts: true,
        PieCharts: false,
        UpCharts: false,
        myChart: null, // 当前页的echart实例
        myUpChart: null, // 当前页的echart实例
        myPieChart: null, // 当前页的echart实例
        activeIndex: null,
        detailUrl: '',
        menus: [],
        info: [],
        type: 'week',
        typename: '周',
        xname: '星期',
        currentItem: '2',
        taglist: [
          { itemKey: '类别', itemValue: '2' },
          { itemKey: '区域', itemValue: '0' }
        ],
        isSuperior: false,
        isNew: false,
        amountImg: '../static/image/amountImg.png'
      }
    },
    // 组件
    components: {
      Tab,
      TabItem,
      Cell,
      AppScroller
    },
    created() {
      this.$store.dispatch('showPageLoading')
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.getData(vm.currentItem)
        vm.activeIndex = null
        // 通过 `vm` 访问组件实例
        const leftOption = {
          showBack: false,
          backText: '',
          preventGoBack: true
        }
        vm.$store.commit('setHeaderLeft', leftOption)  // 进入首页 去掉回退
        vm.$store.commit('setHeaderTitle', '武汉市应急值班平台')  // 设置头部文字
        vm.$store.commit('setHeaderRightIcon', 'setting')  // 右边设置按钮
        vm.refresh()
//        // 看看有没有云信token
//        const userToken = pageUtils.getCookie('sdktoken')
//        alert(userToken)
      })
    },
    beforeRouteLeave(to, from, next) {
      const leftOption = {
        showBack: true,
        backText: '',
        preventGoBack: false
      }
      this.$store.commit('setHeaderLeft', leftOption)  // 离开首页 加上回退
      this.$store.commit('setHeaderRightIcon', '') // 隐藏右边按钮
      next()
    },
    computed: {
      // 与父组件通信用属性
      currentUser: {
        get() {
          return this.$store.state.user
        }
      },
      isHigherAuthorities: {
        get() {
          return this.$store.state.user.typeCode
        }
      }
    },
    methods: {
      async refresh() { // 刷新页面数据
        await this.getMenu()
        await this.getUnControl()
        await this.getNewestInfo()
        await this.drawPieChart()
        this.$store.dispatch('hidePageLoading')
        this.$nextTick(() => {
          this.$refs.appScroll.scrollDone()
        })
      },
      iconShortTxt(eventType) { // 四大类首字 作为cell头部 参数为事件类型code 返回类型首字
        let txt = ''
        if (eventType) {
          this.info.map(() => {
            if (eventType.substring(0, 2) === '11') {
              txt = '自然灾害'
            } else if (eventType.substring(0, 2) === '12') {
              txt = '事故灾难'
            } else if (eventType.substring(0, 2) === '13') {
              txt = '公共卫生'
            } else if (eventType.substring(0, 2) === '14') {
              txt = '社会安全'
            } else if (eventType.substring(0, 2) === '30') {
              txt = '预警信息'
            } else if (eventType.substring(0, 2) === '40') {
              txt = '其它信息'
            }
            return txt
          })
        }
        return txt
      },
      iconShortClass(eventLevelCode, userRead) { // 四大类首字 作为cell头部 参数为事件类型code 返回类型颜色样式类
        let colorCss = 'blue'
        if (eventLevelCode === '1') {
          colorCss = 'red'
        } else if (eventLevelCode === '2') {
          colorCss = 'orange'
        } else if (eventLevelCode === '3') {
          colorCss = 'yellow'
        } else if (eventLevelCode === '4') {
          colorCss = 'blue'
        }
        if (userRead === '0') {
          colorCss += ' unread'
        }
        return colorCss
      },
      getData(val) {
        this.currentItem = val
        if (val === '0') {
          this.type = 'season'
          this.xname = '季度'
          this.typename = '季'
          this.drawUpLineChart()
        } else {
          this.drawPieChart()
        }
      },
      // 为图表赋值
      drawUpLineChart() {
        let chartData = []
        this.UpCharts = true
        this.statCharts = false
        this.PieCharts = false
        const options = {
          grid: {
            left: '0',
            right: '10%',
            bottom: '5%',
            containLabel: true
          },
          color: ['#418cff'],
          title: {
            text: '近一个月上报信息',
            textStyle: {
              color: '#4c98ff'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          calculable: true,
          xAxis: {
            type: 'value',
            boundaryGap: [0, 1],
            name: '数量'
          },
          yAxis: {
            type: 'category',
            data: [],
            name: '区划',
            axisLabel: {
              interval: 0,
              rotate: 45
            }
          },
          series: [{
            type: 'bar',
            itemStyle: {
              normal: {
                label: { show: true, position: 'right' }
              }
            },
            data: []
          }]
        }
        const URL = `${config.siteUrl}/eventinforpt/geteventinfolingstat/district?startTime=&endTime=`
        this.axios.get(URL)
          .then((response) => {
            if (response.data.code === 200) {
              chartData = response.data.response.district
              // 对返回的数组进行排序
              chartData.forEach((val) => {
                options.yAxis.data.push(val.key)
                options.series[0].data.push(val.value)
              })
              if (this.myUpChart) {
                this.myUpChart.setOption(options, true)
              } else {
                this.$store.dispatch('initChart').then((echarts) => { // 异步加入echart插件
                  // ...加载echarts插件后的回调
                  if (this.$refs.UpChart) {
                    this.myUpChart = echarts.init(this.$refs.UpChart) // 根据当前页dom初始化echart实例
                    this.myUpChart.setOption(options, true)
                  }
                })
              }
            }
          })
          .catch(() => {
          })
      },
      async drawPieChart() {
        let chartData = []
        this.UpCharts = false
        this.statCharts = false
        this.PieCharts = true
        const options = {
          title: {
            text: '近一个月上报信息',
            x: 'left',
            textStyle: {
              color: '#4c98ff'
            }
          },
          color: ['#46b79e', '#fec469', '#6cb2d7', '#fe7769'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          calculable: true,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              label: { // 饼图图形上的文本标签
                normal: {
                  show: true,
                  // position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 12, // 文字的字体大小
                    align: 'rigth',
                    baseline: 'bottom'
                    // fontStyle: 'italic'
                  },
                  formatter: '{b}\n{c}件({d}%)'
                }
              },
              labelLine: {
                show: true
              },
              data: []
            }
          ]
        }
        const URL = `${config.siteUrl}/eventinforpt/geteventinfolingstat/eventtype?startTime=&endTime=`
        const response = await this.axios.get(URL)
        if (response.data.code === 200) {
          chartData = response.data.response.eventtype
          chartData.forEach((val) => {
            options.series[0].data.push({ value: val.value, name: val.key })
          })
          if (this.myPieChart) {
            this.myPieChart.setOption(options, true)
          } else {
            await this.$store.dispatch('initChart').then((echarts) => { // 异步加入echart插件
              // ...加载echarts插件后的回调
              if (this.$refs.UpChart) {
                this.myPieChart = echarts.init(this.$refs.PieChart) // 根据当前页dom初始化echart实例
                this.myPieChart.setOption(options, true)
              }
            })
          }
        }
      },
      async getMenu() {
        const URL = `${config.siteUrl}/eventInfo/eventInfoMenu`
        const that = this
        const response = await this.axios.get(URL)
        if (response.data.code === 200) {
          that.menus = response.data.response.menus
        }
      },
      async getUnControl() { // 获取未处理的消息
        const URL = `${config.siteUrl}/countSignup/countUnreadTotal`
        const response = await this.axios.post(URL)
        if (response.data.code === 200) {
          const unControlData = response.data.response
          this.menus.forEach((menu, index) => {
            switch (index) {
              case 0:
                menu.toRead = unControlData.toReadEmergency // 事件未读
                menu.toHandler = unControlData.toHandleEmergency // 事件待办
                break
              case 1:
                menu.toRead = unControlData.toReadNotice // 通知公告未读
                menu.toHandler = unControlData.toHandleNotice // 通知公告待办
                break
              case 2:
                menu.toRead = unControlData.toReadTransact // 转办督办未读
                menu.toHandler = unControlData.toHandleTransact // 转办督办待办
                break
              default:
                break
            }
          })
        }
      },
      async getNewestInfo() {
        const URL = `${config.siteUrl}/eventInfo/list/search/new?size=10`
        this.info = []
        const response = await this.axios.get(URL)
        if (response.data.code === 200) {
          if (response.data.response.result) {
            const messArr = Object.values(response.data.response.result)
            this.info = this.info.concat(messArr)
            if (this.info.length > 0) {
              this.isNew = true
            } else {
              this.isNew = false
            }
          }
        }
      },
      handleStr(handleStatus) {
        if (handleStatus === '1') {
          return '待办'
        } else if (handleStatus === '0') {
          return ''
        }
        return '未处理'
      },
      async upDownChange() {
        const falg = !this.isSuperior
        this.isSuperior = falg
        if (falg) {
          await this.drawPieChart()
          this.currentItem = '2'
        } else {
          this.currentItem = '0'
        }
        this.$nextTick(() => {
          this.$refs.appScroll.scrollDone()
        })
      },
      jumpPage(r) {
        if (r) {
          this.$store.dispatch('showPageLoading')
          this.$router.push(r)
        } else {
          this.$vux.toast.text('此功能正在开发中，敬请期待~~', 'middle')
        }
      },
      // 点击头部右边跳转用户审核修改密码页面
      headerRightClick() {
        const r = '/user'
        this.$router.push(r)
      },
      async goDetailPage(item, index) {
        this.activeIndex = index
        let r = ''
//        点击去掉红点
        if (item.userRead === '0') {
          const readUrl = `${config.siteUrl}/eventInfo/markread/${item.eventInfoId}`
          await this.axios.post(readUrl, '')
            .then(() => {
            })
            .catch(() => {
            })
          item.userRead = '1'
        }
        r = item.info.link.view
        this.$store.dispatch('showPageLoading')
        if (r === '') {
          this.$router.push('/error')
          return
        }

        this.$store.commit('setHeaderTitle', '信息办理')  // 设置头部文字
        this.$store.commit('setInfoPageManipulable', true) // 进入可操作的信息管理页面
        this.$router.push(r)
      },
      getMenuNum(num) { // 转换菜单上显示的数字
        return num > 99 ? '99+' : num
      },
      getTimeStr(timeStr) {
        let showTimeStr
        if (timeStr) {
          showTimeStr = timeStr.split(' ')[0]
          const date = new Date(showTimeStr)
          showTimeStr = `${date.getDate()}/${date.getMonth() + 1}`
        }
        return showTimeStr
      }
    }
  }

</script>
