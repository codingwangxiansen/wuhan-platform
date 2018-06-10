<template>
  <div class="statis">
    <group class="timeBox">
      <datetime
        title="开始时间"
        v-model="value1"
        @on-change="onChange"></datetime>
    </group>
    <group class="timeBox">
      <datetime
        title="结束时间"
        v-model="value2"
        @on-change="onChangeEnd"></datetime>
    </group>
    <section>
          <!--<img :src="amountImg">-->
        <!-- <section class="canvas-position">
          <div id="statChart" ref="statChart">
          </div>
        </section> -->
        <section class="canvas-position">
          <div id="PieChart" ref="PieChart">
          </div>
        </section>
        <section class="canvas-position">
          <div id="UpChart" ref="UpChart">
          </div>
        </section>
    </section>
  </div>
</template>
<style type="less" scoped>
  .weui-cell:before {
    right: 15px;
  }
  #statChart, #PieChart {
    height: 300px;
    width: 100%;
  }
  #UpChart{
    height: 500px;
    width: 100%;
  }
</style>
<script>
  import { Group, Cell, PopupPicker, Datetime } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import config from 'src/config'

  Vue.use(VueResource)


  export default {
    props: [],
    // 组件
    components: {
      Group,
      Cell,
      PopupPicker,
      Datetime
    },
    // 数据模型
    data() {
      return {
        value1: '',
        value2: '',
        times: [],
        dataVal: [],
        dataTime: ['季报', '月报', '周报'],
        setData: {
          district: [],
          eventtype: [],
          month: []
        },
        startTime: '',
        endTime: ''
      }
    },
    created() {
      this.loadData()
      // this.getChartData()
      // this.value1 = new Date()
      this.drawLineChart()
      this.drawUpLineChart()
      this.drawPieChart()
    },
    // 方法
    methods: {
      onChange(val) {
        if (val) {
          this.startTime = val
        }
        this.loadData()
      },
      onChangeEnd(val) {
        if (val) {
          this.endTime = val
        }
        this.loadData()
      },
      loadData() {
        const that = this
        const URL = `${config.siteUrl}/eventinforpt/geteventinfolingstat/all?startTime=${that.startTime}&endTime=${that.endTime}`
        this.axios.get(URL)
          .then((response) => {
            if (response.data.code === 200) {
              if (response.data.response.district) {
                that.setData.district = response.data.response.district
              }
              if (response.data.response.eventtype) {
                that.setData.eventtype = response.data.response.eventtype
              }
              if (response.data.response.month) {
                that.setData.month = response.data.response.month
              }
              that.drawUpLineChart(that.setData)
              that.drawPieChart(that.setData)
              that.drawLineChart(that.setData.month)
            } else {
              that.$vux.toast.text(response.data.message, 'middle')
            }
          })
          .catch(() => {
          })
      },
      getChartData() {
        const URL = `${config.siteUrl}/eventinforpt/getListByType/month?date=`
        this.axios.get(URL)
          .then((response) => {
            if (response.data.code === 200) {
              this.drawLineChart(response.data.response.result)
            }
          })
          .catch(() => {
          })
      },
      // 为图表赋值
      drawLineChart(chartData) {
        this.UpCharts = false
        this.statCharts = true
        this.PieCharts = false
        const options = {
          title: {
            text: '该段时间内上报信息数量对比',
            textStyle: {
              color: '#4c98ff'
            }
          },
          // toolbox: {
          //   show: true,
          //   feature: {
          //     // mark : {show: true},
          //     // dataView : {show: true, readOnly: false},
          //     magicType: { show: true, type: ['line', 'bar'] }
          //     // restore: { show: true },
          //     // saveAsImage: { show: true }
          //   }
          // },
          xAxis: [{
            type: 'category',
            name: '月',
            data: []
          }],
          yAxis: [{
            type: 'value',
            name: '数量'
          }],
          series: []
        }
        const colors = ['#b3b3b3', '#46b79e', '#fec469', '#6cb2d7', '#fe7769', '#e28de3']
        if (chartData && chartData instanceof Array) {
          chartData.forEach((dataItem, index) => {
            const seriesObj = {
              name: '数量',
              type: 'bar',
              stack: '统计结果',
              itemStyle: {
                normal: {
                  color: colors[index % 6],
                  label: { show: true, position: 'top' }
                }
              },
              data: []
            }
            for (let i = 0; i < chartData.length; i++) {
              if (i === index) {
                seriesObj.data.push(dataItem.value)
              } else {
                seriesObj.data.push('-')
              }
            }
            options.xAxis[0].data.push(dataItem.key)
            options.series.push(seriesObj)
          })
        }
        if (this.myChart) {
          this.myChart.setOption(options, true)
        } else {
          this.$store.dispatch('initChart').then((echarts) => { // 异步加入echart插件
            // ...加载echarts插件后的回调
            if (this.$refs.statChart) {
              this.myChart = echarts.init(this.$refs.statChart) // 根据当前页dom初始化echart实例
              this.myChart.setOption(options, true)
            }
          })
        }
      },
      drawUpLineChart() {
        this.UpCharts = true
        this.statCharts = false
        this.PieCharts = false
        const options = {
          grid: {
            left: '-20%',
            right: '10%',
            bottom: '5%',
            containLabel: true
          },
          color: ['#418cff'],
          title: {
            text: '区划统计',
            textStyle: {
              color: '#4c98ff'
            }
          },
          // toolbox: {
          //   show: true,
          //   feature: {
          //     // mark : {show: true},
          //     // dataView : {show: true, readOnly: false},
          //     magicType: { show: true, type: ['line', 'bar'] }
          //     // restore: { show: true },
          //     // saveAsImage: { show: true }
          //   }
          // },
          tooltip: {
            trigger: 'axis'
          },
          calculable: true,
          xAxis: [
            {
              type: 'value',
              boundaryGap: [0, 1],
              name: '数量'
            }
          ],
          yAxis: [
            {
              type: 'category',
              data: [],
              name: '地区'
            }
          ],
          series: [
            {
              name: '2011年',
              type: 'bar',
              data: [],
              itemStyle: {
                normal: {
                  label: { show: true, position: 'right' }
                }
              }
            }
          ]
        }
        const setDate = this.setData.district
        // 对返回的数组进行排序
        // setDate.sort(this.compare('value'))
        setDate.forEach((val) => {
          options.yAxis[0].data.push(val.key)
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
      },
      drawPieChart() {
        this.UpCharts = false
        this.statCharts = false
        this.PieCharts = true
        const options = {
          title: {
            text: '类型统计',
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
        const setDate = this.setData.eventtype
        setDate.forEach((val) => {
          options.series[0].data.push({ value: val.value, name: val.key })
        })
        if (this.myPieChart) {
          this.myPieChart.setOption(options, true)
        } else {
          this.$store.dispatch('initChart').then((echarts) => { // 异步加入echart插件
            // ...加载echarts插件后的回调
            if (this.$refs.UpChart) {
              this.myPieChart = echarts.init(this.$refs.PieChart) // 根据当前页dom初始化echart实例
              this.myPieChart.setOption(options, true)
            }
          })
        }
      }
      // 对象排序
      // compare(property) {
      //   return ((a, b) => {
      //     const value1 = a[property]
      //     const value2 = b[property]
      //     return value1 - value2
      //   })
      // }
    }
  }
</script>
