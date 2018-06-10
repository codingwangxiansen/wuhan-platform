<template>
  <div class="timeline-demo">
    <timeline>
      <timeline-item v-for=" (item,index) in list" :key="index">
        <div class="timeline-Style">
            <h4 class="recent backP">
              <span>{{item.disposeOrgName}}</span>
              <span>{{item.disposePersonName}}</span>
              <b v-if="item.disposeType != '回复'">{{item.disposeType}}</b>
              <span v-if="item.disposeType == '回复'">{{item.disposeType}}：</span>
            </h4>
            <h4 class="recent" @click="showMore(item.disposeDescription)">{{item.disposeDescription}}</h4>
            <p><span class="time" :class="index == 0 ? 'blo' : 'dis'">{{item.disposeTimeStr}}</span></p>
        </div>
      </timeline-item>
      <x-dialog v-model="showScrollBox" class="dialog-demo">
        <div @click="showScrollBox=false" class="closeDiv">
          <span class="vux-close gs-close-bold"></span>
        </div>
        <div class="img-box">
          <span class="lineCss">{{getDisposeDescription}}</span>
        </div>
      </x-dialog>
    </timeline>

    <div v-show="list.length == 0" class="tipShow">
      当前页面暂无数据
    </div>
    <div class="loading" v-show="Loaded">
      <img src="../../../assets/image/eventInfo/index/loading.gif" alt="">
    </div>
  </div>
</template>
<style lang="less" scoped>
  .timeline-Style{
    font-size: 14px;
    position: relative;
  }
  .timeline-demo .recent{
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    font-size: 14px;
  }
  .recent.backP {
    color: #666;
    span:nth-last-child(1) {
      color: #666;
    }
  }
  .timeline-demo .vux-timeline-item-head {
    width: 20px;
    height: 20px;
    background-color: #f00;
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
  .personH {
    color: #444;
    margin-right: 0.3em;
    font-size: 1em;
  }
  .timeline-demo p.blo {
    font-size: 1em;
    color: #0388ff;
  }
  .timeline-demo p.dis {
    font-size: 1em;
    color: #a6a7a7;
  }
  .tipShow{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 22px;
    color: #aba8a8;
  }
  .timeline-demo {
    background: #fff;
  }
  .timeline-demo > b {
    color: #0388ff;
  }
  .fontCss {
    font-size: 13px;
  }
  .floatCss {
    float: right;
  }
  .closeDiv {
    width: 30px;
    height: 30px;
    margin-left: 89%;
    border-radius: 50px;
    border-color: #dbd4d4;
    cursor:pointer;
  }
  .lineCss {
    word-wrap: break-word;
    font-size: 16px;
  }
  .img-box {
    height:200px;
    padding: 15px 17px;
    overflow:scroll;
    text-align: left;
  }
  .notExistCss {
    display: none;
  }
</style>
<script>
  import { Timeline, TimelineItem, XDialog } from 'vux'
  import { siteUrl } from '../../../utils/common'

  export default {
    name: 'InstructTimeline',
    props: ['processid'],
    components: {
      Timeline,
      TimelineItem,
      XDialog
    },
    data() {
      return {
        list: [],
        Loaded: false,
        showScrollBox: false,
        getDisposeDescription: ''
      }
    },
    created() {
      this.id = this.$router.history.current.params.id
      // this.init()
    },
    methods: {
      // 初始化数据
      init(id) {
        const url = `${siteUrl}/eventdispose/assign/process/${id}`
        const that = this
        this.$http.get(url).then((res) => {
          that.list = []
          if (res.body.code !== 200) {
            return
          }
          const commonList = res.body.response
          if (commonList.length < 1) {
            return
          }
          if (commonList) {
            const tmpArr = Object.values(commonList)
            let showdata = ''
            tmpArr.forEach((tmp) => {
              showdata = this.getDisposeType(tmp.disposeType)
              that.list.push({
                disposePersonName: tmp.disposePersonName,
                disposeOrgName: tmp.disposeOrgName,
                disposeType: showdata,
                disposeTimeStr: tmp.disposeTimeStr,
                recvPersonNames: tmp.recvPersonNames,
                disposeDescription: tmp.disposeDescription
              })
            })
          }
        })
      },
      getDisposeType(showid) {
        let showdata = ''
        if (showid === '13') {
          showdata = '回复'
        } else if (showid === '2') {
          showdata = '拟办'
        } else if (showid === '3') {
          showdata = '审核'
        } else if (showid === '4') {
          showdata = '续报'
        } else if (showid === '5') {
          showdata = '转办督办'
        } else if (showid === '6') {
          showdata = '转办督办'
        } else if (showid === '16') {
          showdata = '办结'
        } else if (showid === '20') {
          showdata = '签收'
        } else if (showid === '12') {
          showdata = '批示'
        } else if (showid === '0') {
          showdata = '新增'
        }
        return showdata
      },
      showMore(value) {
        this.getDisposeDescription = value
        this.showScrollBox = true
      },
      isExistCss(state) {
        let classNam
        if (state) {
          classNam = ''
        } else {
          classNam = 'notExistCss'
        }
        return classNam
      }
    }
  }
</script>

<style lang="less">
  .timeline-demo {
    p {
      color: #888;
      font-size: 0.8rem;
    }
    h4 {
      color: #666;
      font-weight: normal;
    }
  }
</style>
