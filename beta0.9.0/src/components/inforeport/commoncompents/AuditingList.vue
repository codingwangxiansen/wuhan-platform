<!-- 转办控件	 -->
<template>
  <div class="auditList transList">
    <group title ="审核意见" class="deal gs-drivers-license-o">
      <i class="icon" @click.prevent="auditShow = !auditShow" :class="auditShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
      <!--<panel header=""  :list="content" type="4" ></panel>-->
      <div class="auditBig" v-show="auditShow">
        <div class="auditContent" v-for="(item, index) in content" :key="index">
          <span class="time">{{item.date}}</span>
          <!--回复按钮-->
          <span class="backBtn" @click.stop="backMsg({
            'disposeType': '17',
            'transactId': item.eventDisposeId,
            'eventInfoId': item.eventInfoId
            }, index)" v-show="showOperation && showEdit && isWatch">
              <i class="gs-commenting-o"></i>
              回复
          </span>
          <h3>
            <i class="gs-user-circle"></i>
            <span :class="userId === item.desc? 'hightLight': ''">{{item.desc}}</span>
            <span class="transP" v-show="item.recvPersonNames.length > 0">
              发送至<span>
              <!-- 由于报送的人员要高亮显示，所以用数组展示，i里面的逻辑是判断是否添加逗号，是否有逗号-->
              <a  :class="userId === join? 'hightLight': ''" v-for="(join, index) in item.recvPersonNames" :key="index">
                {{join}}<i v-if="item.recvPersonNames.length > 0 && index < item.recvPersonNames.length - 1">,</i>
              </a>
            </span>
            </span>
            <span class="transP" v-show="item.recvPersonNames.length > 0">：</span>
          </h3>
          <div class="toldTo">
          </div>
          <div class="backC">
            <p class="content">{{item.title}}</p>
          </div>
          <div class="backContent" v-for="(keys, index) in item.replys">
            <p class="backInfo">
              <span :class="userId === keys.disposePersonName? 'hightLight': ''">{{keys.disposePersonName}}：</span>
              <span class="pull-right">{{keys.disposeTimeStr}}</span>
            </p>
            <p class="backMsg">
              {{keys.disposeDescription}}
            </p>
          </div>
        </div>
      </div>
    </group>
    <feed-back @on-save='setList' ref="feed"></feed-back>
  </div>
</template>
<style lang="less" scpoed>
  .auditList {
    .auditBig {
      padding: 5px 5px 1px 5px;
    }
    .backContent {
      background-color: #e2e2e2;
      padding: 5px 10px;
      border-radius: 6px;
      position: relative;
      margin: 13px 10px 0 10px;
      &:after {
         content: '';
         position: absolute;
         width: 20px;
         height: 20px;
         background-color: #e2e2e2;
         top: -8px;
         transform: rotateZ(39deg);
         left: 25px;
         border-radius: 5px;
       }
      .backInfo {
        font-size: 14px;
        line-height: 22px;
        color: #444;
        position: relative;
        z-index: 99;
        span:nth-child(2) {
          font-size: 12px;
        }
      }
      .backMsg {
        color: #111;
        line-height: 20px;
      }
    }
    .auditContent {
      position: relative;
      padding: 15px 10px 5px 10px;
      background: #f8f8f8;
      border-top: 1px solid #f8f8f8;
      border-bottom: 1px solid #e2e2e2;
      border-radius: 5px;
      margin-bottom: 5px;
      .time {
        position: absolute;
        font-weight: 400;
        font-size: 12px;
        right: 15px;
        top: 0px;
      }
      .transP {
        display: inline;
        padding-left: 0px;
        font-size: 12px;
        font-weight: 400;
        color: #000;
      }
      h3 {
        font-size: 14px;
        position: relative;
        width: 80%;
        line-height: 20px;
        padding-left: 20px;
        box-sizing: border-box;
        & > i {
          position: absolute;
          left: 0;
          top: 3px;
        }
      }

      .backBtn {
        padding: 5px 15px;
        border: 1px solid #ccc;
        border-radius: 20px;
        font-size: 12px;
        float: right;
        line-height: 20px;
        font-weight: 600;
        position: absolute;
        top: 22px;
        right: 10px;
      }
      p {
        font-size: 14px;
        color: #888;
        line-height: 35px;
      }
      .content {
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        width: 75%;
        padding-bottom: 0;
        box-sizing: border-box;
        padding-left: 20px;
        color: #000;
      }
    }
    .toldTo {
      position: relative;
    }
  }
</style>
<script>
  import { Cell, Popup, Panel, Group } from 'vux'
  import FeedBack from './FeedBack'

  export default {
    props: ['list', 'userId', 'showOperation', 'showEdit', 'isWatch'],
    data() {
      return {
        auditShow: true
      }
    },
    components: {
      Cell,
      Popup,
      Panel,
      Group,
      FeedBack
    },
    created() {
    },
    methods: {
      backMsg(obj, index) {
        this.index = index
        this.$refs.feed.showMask(obj)
      },
      setList(backContent) {
        this.list[this.index].replys.push({
          disposeDescription: backContent,
          disposeTimeStr: this.getTime(),
          reportPerson: this.userId,
          disposePersonName: this.$store.state.user.username
        })
      },
      getTime() {
        const date = new Date()
        const seperator1 = '-'
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        let strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = `0${month}`
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = `0${strDate}`
        }
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        const currentdate = `${year}${seperator1}${month}${seperator1}${strDate} ${hour}:${minute}`
        return currentdate
      }
    },
    computed: {
      content: {
        get() {
          const result = []
//          let recvP = []
          this.list.forEach((val) => {
            result.push({
              title: val.disposeDescription,
              desc: val.disposePersonName,
              date: val.disposeTimeStr,
              reportTo: val.reportTo,
              recvPersonNames: val.recvPersonNames ? val.recvPersonNames.split(',') : [],
              checkReplys: val.checkReplys,
              replys: val.replys,
              eventInfoId: val.eventInfoId,
              eventDisposeId: val.eventDisposeId
            })
          })
          return result
        }
      }
    },
    mounted() {
    }

  }
</script>
