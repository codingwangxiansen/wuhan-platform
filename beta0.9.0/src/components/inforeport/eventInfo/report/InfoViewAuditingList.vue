<!-- 转办控件	 -->
<template>
  <div class="auditList transList">
    <group title ="审核意见" class="deal gs-drivers-license-o">
      <i class="icon" @click.prevent="auditShow = !auditShow" :class="auditShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
      <!--<panel header=""  :list="content" type="4" ></panel>-->
      <div class="auditBig" v-show="auditShow">
        <div class="auditContent" v-for="(item, index) in content" :key="index">
          <h3>
            <i class="gs-user-circle"></i>
            <span :class="userId === item.desc? 'hightLight': ''">{{item.desc}}</span>
            <span class="time">{{item.date}}</span>
            <!--回复按钮-->
            <!--<span class="backBtn" @click.stop="backMsg({
            'disposeType': '17',
            'transactId': item.eventDisposeId,
            'eventInfoId': item.eventInfoId
            }, index)" v-show="showOperation">
              <i class="gs-commenting-o"></i>
              回复
            </span>-->
          </h3>
          <div class="backC">
            <p class="content">{{item.title}}</p>
          </div>
          <p v-show="item.reportTo">报送至： <span :class="userId === item.other? 'hightLight': ''">{{item.reportTo}}</span></p>
          <div class="toldTo">
            <p v-show="item.informTo">
              通知至：
              <span :class="userId === item.other? 'hightLight': ''">{{item.informTo}}</span>
            </p>
          </div>
          <div class="backContent" v-for="(keys, index) in item.replys">
            <p class="backInfo">
              <span>{{keys.reportPerson}}：</span>
              <span class="pull-right">{{keys.disposeTimeStr}}</span>
            </p>
            <p class="backMsg">
              {{keys.disposeDescription}}
            </p>
          </div>
        </div>
      </div>
    </group>
  </div>
</template>
<style lang="less" scpoed>
  .auditList {
    .auditBig {
      padding: 10px;
    }
    .backContent {
      background-color: #e2e2e2;
      padding: 10px;
      border-radius: 6px;
      position: relative;
      margin-top: 20px;
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
        line-height: 30px;
        color: #444;
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
      padding: 10px;
      background: #f8f8f8;
      border-top: 1px solid #f8f8f8;
      border-bottom: 1px solid #e2e2e2;
      border-radius: 5px;
      margin-bottom: 5px;
      h3 {
        font-size: 14px;
        .time {
          float: right;
          font-weight: 400;
          font-size: 12px;
        }
        .backBtn {
          position: absolute;
          top: 28px;
          right: 8px;
          padding: 5px 15px;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 12px;
        }
      }
      p {
        font-size: 12px;
        color: #666;
        line-height: 35px;
      }
      .backC {
        border-bottom: 1px dotted #e2e2e2;
      }
      .content {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        width: 76%;
        padding-bottom: 10px;
      }
    }
    .toldTo {
      position: relative;
      border-bottom: 1px dotted #e2e2e2;
    }
  }
</style>
<script>
  import { Cell, Popup, Panel, Group } from 'vux'

  export default {
    props: ['list', 'userId', 'backContent', 'showOperation'],
    data() {
      return {
        auditShow: false
      }
    },
    components: {
      Cell,
      Popup,
      Panel,
      Group
    },
    created() {
    },
    methods: {
      backMsg(obj, index) {
        this.index = index
        this.$emit('maskShow', obj)
      },
      setList() {
        this.list[this.index].replys.push({
          disposeDescription: this.backContent,
          disposeTimeStr: this.getTime(),
          reportPerson: this.userId
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
          this.list.forEach((value) => {
            result.push({
              title: value.disposeDescription,
              desc: value.disposePersonName,
              date: value.disposeTimeStr,
              reportTo: value.reportTo,
              informTo: value.informTo,
              checkReplys: value.checkReplys,
              replys: value.replys,
              eventInfoId: value.eventInfoId,
              eventDisposeId: value.eventDisposeId
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
