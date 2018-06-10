<template>
  <div class="statis">
    <section>
      <!--<h3>近5个月信息数量统计</h3>-->
      <div class="search">
        <popup-picker title="查询时间:" placeholder="请选择截止时间" @on-change="onChange" show-name :data="times" :columns="2" v-model="value3" ref="picker3"></popup-picker>
      </div>
      <section class="chartBox">
        <div v-show="chartShow" ref="statChart" id="statChart">
        </div>
        <div class="tipsText" v-show="!chartShow">页面暂无数据</div>
      </section>
    </section>
  </div>
</template>
<style type="less" scoped>
  .tipsText {
    text-align: center;
    color: #999;
  }
  .chartBox {
    margin-top: 40px;
    overflow: hidden;
  }
  #statChart{
    width: 100%;
    height: 300px;
  }
</style>
<script>
  import { PopupPicker } from 'vux'
  import config from 'src/config/index'
  import Vue from 'vue'
  import VueResource from 'vue-resource'

  Vue.use(VueResource)


  export default {
    props: [],
    // 组件
    components: {
      PopupPicker
    },
    // 数据模型
    data() {
      return {
        value: '',
        chartTitle: '',
        val: '',
        myChart: '',
//        时间
        currentTime: '',
        resultNum: null,
        chartShow: true,
        value3: [],
        times: [],
        timeLists: [],
        Axis: ''
      }
    },
    created() {
    },
    watch: {
    },
    beforeRouteEnter(to, from, next) {
      // 通过 `vm` 访问组件实例
      next((vm) => {
        setTimeout(() => {
          vm.init()
          vm.getSearchTime(vm.$route.params.id)
        }, 400)
      })
    },
    mounted() {
      this.myChart = this.$store.state.echarts.init(this.$refs.statChart)
    },
    // 方法
    methods: {
      onChange(val) {
        if (val.length > 0) {
          this.currentTime = `${val[0]}${val[1]}`
          this.loadChart(this.$route.params.id)
          console.log('val change', this.currentTime)
        }
      },
      init() {
        this.times = []
        this.timeLists = []
        this.value3 = []
        this.currentTime = ''
      },
      getSearchTime(id) {
        const URL = `${config.siteUrl}/eventinforpt/getSearchTime/${id}`
        this.$store.dispatch('showPageLoading')
        this.axios.get(URL)
          .then((response) => {
            if (response.data.code === 200) {
              this.timeLists = response.data.response
              const len = this.timeLists.length
              for (let index = 0; index < len; index++) {
                const element = this.timeLists[index]
                this.times.push(element)
              }
            }
            this.$store.dispatch('hidePageLoading')
          })
          .then(() => {
            this.loadChart(id)
          })
          .catch(() => {
          })
      },
      getChartData(type, date, title) {
        const URL = `${config.siteUrl}/eventinforpt/getListByType/${type}?date=${date}`
        this.$store.dispatch('showPageLoading')
        this.axios.get(URL)
          .then((response) => {
            if (response.data.code === 200) {
              this.resultNum = response.data.response.result.length
              if (this.resultNum) {
                this.chartShow = true
                this.chartTitle = `近${this.resultNum}个${title}的信息数量统计`
                this.drawLineChart(response.data.response.result, type)
              } else {
                this.chartShow = false
              }
            }
            this.$store.dispatch('hidePageLoading')
          })
          .catch(() => {
          })
      },
      // 为图表赋值
      drawLineChart(chartData, type) {
        const options = {
          title: {
            text: this.chartTitle,
            textStyle: {
              color: '#4c98ff'
            }
          },
          xAxis: [{
            type: 'category',
            data: [],
            name: this.XAxis
          }],
          yAxis: [{
            type: 'value',
            name: '数量'
          }],
          series: []
        }
        const colors = ['#b3b3b3', '#46b79e', '#fec469', '#6cb2d7', '#fe7769', '#e28de3']
        const xData = []
        let yData
        let yobject
        let xzhou
        for (const index in chartData) {
          if (chartData[index]) {
            xzhou = parseInt(chartData[index][type], 10)
            yData = []
            yobject = {
              name: '数量',
              type: 'bar',
              stack: '统计结果',
              itemStyle: {
                normal: {
                  color: colors[index % 6]
                }
              },
              data: []
            }
            xData.push(xzhou)
            for (const dex in chartData) {
              if (dex === index) {
                yData.push(chartData[index].total)
              } else {
                yData.push('-')
              }
            }
            yobject.data = yData
            options.series.push(yobject)
          }
        }
        options.xAxis[0].data = xData
        this.myChart.setOption(options, true)
      },
      getListItem() {
        console.log('搜索')
      },
      loadChart(id) {
        if (id === '0') {
          this.XAxis = '季度'
          this.getChartData('season', this.currentTime, '季度')
        } else if (id === '1') {
          this.XAxis = '月'
//          this.chartTitle = `近${this.resultNum}个月的信息数量统计`
          this.getChartData('month', this.currentTime, '月')
        } else {
          this.XAxis = '星期'
          this.getChartData('week', this.currentTime, '星期')
        }
      }
    }
  }
</script>
