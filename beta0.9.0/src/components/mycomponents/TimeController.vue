<!-- 时间选择组件  输出整个时间到页面 -->
<template>
  <div class="timeC">
    <datetime placeholder="必填"
              @on-change="yearChange"
              v-model="date"
              :mini-year=2000
              format="YYYY-MM-DD"
              :title="dateTitle"
              year-row="{value}年"
              month-row="{value}月"
              day-row="{value}日"
              confirm-text="完成"
              cancel-text="取消">
    </datetime>
    <cell class="time-select"
          :title="timeTitle"
          :value="timeObj | showTimeStr"
          @click.native="timeObj.comGmtMarker = 'A';showTimePopup = true"></cell>
    <popup v-model="showTimePopup">
      <p class="popup-action"><a @click="onTimeChange" href="javascript:">完成</a></p>
      <picker
        :data="dateDataList"
        v-model="dateTimeData"
        @on-change="slideChange">
      </picker>
    </popup>
  </div>
</template>
<script>
  import { Cell, Datetime, Popup, Picker } from 'vux'

  const timeArrItem = [] // 时间选择的第一项
  for (let i = 0; i < 26; i++) {
    let itemValue
    let itemName
    if (i === 0) {
      itemValue = 'AM'
      itemName = '上午'
    } else if (i === 1) {
      itemValue = 'PM'
      itemName = '下午'
    } else {
      itemValue = i - 2 >= 10 ? i - 2 : `0${i - 2}`
      itemName = i - 2 >= 10 ? `${i - 2}时` : `0${i - 2}时`
    }
    timeArrItem.push({
      name: itemName,
      value: itemValue
    })
  }

  const timeArrItemMinuter = [] // 时间选择的第二项
  for (let i = 0; i <= 60; i++) {
    let itemValue
    let itemName
    if (i === 0) {
      itemValue = '--'
      itemName = '--'
    } else {
      itemValue = i - 1 >= 10 ? i - 1 : `0${i - 1}`
      itemName = i - 1 >= 10 ? `${i - 1}分` : `0${i - 1}分`
    }
    timeArrItemMinuter.push({
      name: itemName,
      value: itemValue
    })
  }
  export default {
    props: {
      timeData: { // 初始化日期控件的值
        type: String,
        default: ''
      },
      dateTitle: { // 日期标题
        type: String,
        default: ''
      },
      timeTitle: { // 时间标题
        type: String,
        default: ''
      },
      gmtMarker: { // 时间类型标记 A-上午；P-下午；H-时；M-分
        type: String,
        default: ''
      }
    },
    components: {
      Cell,
      Datetime,
      Popup,
      Picker
    },
    data() {
      return {
        showTimePopup: false,
        dateDataList: [
          timeArrItem,
          ['--']
        ],
        dateStr: ''
      }
    },
    computed: {
      timeObj: { // 展示数据用时间对象
        get() {
          const timeStr = this.timeData.split(' ')[1]
          let timeArr = []
          if (timeStr) {
            timeArr = timeStr.split(':')
          }
          return {
            timeArr,
            comGmtMarker: this.gmtMarker
          }
        },
        set() {
        }
      },
      date: {
        get() {
          const dateStr = this.timeData.split(' ')[0]
          return dateStr
        },
        set(val) {
          this.dateStr = val
        }
      },
      dateTimeData: {
        get() {
          if (this.timeData !== '') {
            if (this.gmtMarker === 'A') {
              return ['AM', '--']
            } else if (this.gmtMarker === 'P') {
              return ['PM', '--']
            }
            const timeString = this.timeData.split(' ')[1]
            const selectArr = []
            selectArr.push(timeArrItem)
            selectArr.push(timeArrItemMinuter)
            this.dateDataList = selectArr
            const timeDataArr = timeString.split(':')
            if (this.gmtMarker === 'H') {
              return [timeDataArr[0], '--']
            }
            return timeDataArr
          }
          return ['', '--']
        },
        set(val) {
          this.timeObj.timeArr = val
          if (val[0] === 'AM') {
            this.timeObj.comGmtMarker = 'A'
          } else if (val[0] === 'PM') {
            this.timeObj.comGmtMarker = 'P'
          } else if (val[1] === '--') {
            this.timeObj.comGmtMarker = 'H'
          } else {
            this.timeObj.comGmtMarker = 'M'
          }
        }
      }
    },
    filters: {
      showTimeStr(val) {
        let timeDataStr
        if (val.comGmtMarker === 'A') {
          timeDataStr = '上午'
        } else if (val.comGmtMarker === 'P') {
          timeDataStr = '下午'
        } else if (val.comGmtMarker === 'H') {
          timeDataStr = `${val.timeArr[0]}时`
        } else if (val.comGmtMarker === '') {
          timeDataStr = ''
        } else {
          timeDataStr = `${val.timeArr[0]}:${val.timeArr[1]}`
        }
        return timeDataStr
      }
    },
    methods: {
      yearChange() {
        let serverTimeStr // 传给服务端的时间字符串
        if (this.timeObj.comGmtMarker === 'A') {
          serverTimeStr = '00:00'
        } else if (this.timeObj.comGmtMarker === 'P') {
          serverTimeStr = '00:00'
        } else if (this.timeObj.comGmtMarker === 'H') {
          serverTimeStr = `${this.timeObj.timeArr[0]}:00`
        } else {
          serverTimeStr = `${this.timeObj.timeArr[0]}:${this.timeObj.timeArr[1]}`
        }
        const timeVal = `${this.dateStr} ${serverTimeStr}`
        this.$emit('on-setTime', {
          timeStr: timeVal,
          gmtMarker: this.timeObj.comGmtMarker
        })
      },
      slideChange(val) {
        // 不是选择的上午下午 选择的时间那么后面可以选择分秒 否则態选择分秒
        const selectArr = []
        if (val[0] !== 'AM' && val[0] !== 'PM') {
          selectArr.push(timeArrItem)
          selectArr.push(timeArrItemMinuter)
          this.dateDataList = selectArr
        } else {
          selectArr.push(timeArrItem)
          selectArr.push(['--'])
          this.dateDataList = selectArr
        }
      },
      onTimeChange() {
        this.showTimePopup = false
        let serverTimeStr // 传给服务端的时间字符串
        if (this.timeObj.comGmtMarker === 'A') {
          serverTimeStr = '00:00'
        } else if (this.timeObj.comGmtMarker === 'P') {
          serverTimeStr = '00:00'
        } else if (this.timeObj.comGmtMarker === 'H') {
          serverTimeStr = `${this.timeObj.timeArr[0]}:00`
        } else {
          serverTimeStr = `${this.timeObj.timeArr[0]}:${this.timeObj.timeArr[1]}`
        }
        const timeVal = `${this.dateStr} ${serverTimeStr}`
        this.$emit('on-setTime', {
          timeStr: timeVal,
          gmtMarker: this.timeObj.comGmtMarker
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .timeC {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 92%;
      border-top: 1px solid #D9D9D9;
      z-index: 99;
      top: 0;
      left: 15px;
    }
    .vux-cell-box:not(:first-child):before {
      width: 92%;
    }

    .popup-action{
      height: 44px;
      line-height: 44px;
      background: #fff;
      text-align: right;
      padding-right: 10px;
      letter-spacing: 1px;
      border-bottom: 1px solid #e7e7e7;
      a{
        color: #04BE02;
      }
    }
  }
</style>
