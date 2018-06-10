<template>
	<div class="timeline-demo">
		<timeline>
			<timeline-item v-for=" (item,index) in list" :key="index">
        <div @click="showMore(item.operDescription)" class="timeline-Style">
          <h4 class="recent backP" v-show="'12'!==item.operType">
            <span v-if="'1'===item.operType || '4'===item.operType || '99'===item.operType || '30'===item.operType || '20'===item.operType" >
              {{item.operOrgName}}
            </span>
            {{item.operUserName}}{{item.remark}}：
          </h4>
          <h4 class="recent backP" v-show="'12'===item.operType">
            {{item.leaderPosition}}{{item.remark}}：
          </h4>
          <h4 class="recent">{{item.operDescription}}</h4>
          <p>
            <span class="time" :class="index == 0 ? 'blo' : 'dis'">{{item.operTimeStr}}</span>
          </p>
        </div>
			</timeline-item>
        <x-dialog v-model="showScrollBox" class="dialog-demo">
          <div @click="showScrollBox=false" class="closeDiv">
            <span class="vux-close gs-close-bold"></span>
          </div>
          <!--<p class="dialog-title">Long content</p>-->
          <div class="img-box">
            <span class="lineCss">{{getDisposeDescription}}</span>
          </div>
        </x-dialog>
		</timeline>

    <div v-show="list.length == 0" class="tipShow">
      当前页面暂无数据
    </div>
    <div class="loading" v-show="Loaded">
      <img src="../../../../assets/image/eventInfo/index/loading.gif" alt="">
    </div>
	</div>
</template>
<style lang="less" scoped>
  .timeline-demo {
    .time {
      font-size: 12px;
    }
    .fromP {
      color: #000;
      display: inline-block;
      width: 90px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      line-height: 1em;
    }
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
    font-size: 12px;
    position: absolute;
    top: 0px;
    right: 0;

  }
  .timeline-demo p.dis {
    font-size: 12px;
    color: #a6a7a7;
    position: absolute;
    top: 0px;
    right: 0;

    /*color: #000;*/
  }
  .timeline-demo .recent {
    color:#666;
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
  .tipShow{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 20px;
    color: #aba8a8;
  }
  .timeline-demo {
    background: #fff;
  }
  .timeline-demo > b {
    color: #0388ff;
  }

  /*timeline STYLE 20180403 ADD*/
  .timeline-Style{
    font-size: 14px;
    position: relative;
  }
  .closeDiv {
    width: 30px;
    height: 30px;
    margin-left: 89%;
    margin-top: 5px;
    color: #888;
    cursor: pointer;
    cursor:pointer;
  }
  .img-box {
    height:200px;
    padding: 5px 15px 15px 15px;
    overflow:scroll;
    text-align: left;
  }
  .lineCss {
    word-wrap: break-word;
    font-size: 14px;
  }

</style>
<script>
import { Timeline, TimelineItem, XDialog } from 'vux'
import { siteUrl } from '../../../../utils/common'

export default {
  name: 'InstructTimeline',
  props: ['infoId'],
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
  methods: {
    showMore(value) {
      this.getDisposeDescription = value
      this.showScrollBox = true
    },
      // 初始化数据
    init(id) {
      // const url = `${siteUrl}/eventInfo/handlelog/list-by-eventid/${this.eventId}`
      const url = `${siteUrl}/eventprogress/list/${id}`
      const that = this
      this.$http.get(url).then((res) => {
        that.list = []
        if (res.body.code !== 200) {
          return
        }
        const commonList = res.body.response
        that.$emit('on-init', commonList.length)
        if (commonList.length < 1) {
          return
        }
        if (commonList) {
          const tmpArr = Object.values(commonList)
          tmpArr.forEach((tmp) => {
            that.list.push({
              id: tmp.progressId,
              operUserName: tmp.operUserName,
              operName: tmp.operName,
              operDescription: tmp.operDescription,
              operTimeStr: tmp.operTimeStr,
              operOrgName: tmp.operOrgName,
              operPosition: tmp.operPosition,
              remark: tmp.remark,
              operType: tmp.operType,
              leaderPosition: tmp.leaderPosition
            })
          })
        }
      })
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
	.recent {
		color: rgb(4, 190, 2)
	}
}
</style>
