<!-- 办结列表显示控件控件	 -->
<template>
  <div class="transList">
    <group :title="title"  class="deal gs-credit-card">
      <i class="icon" @click.prevent="transShow = !transShow" :class="transShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
      <!--<panel header=""  :list="list" type="4" ></panel>-->
      <div class="contenBig" v-show="transShow">
        <div class="transComplete" v-for="(item, index) in list" :key="index">
          <h3>
            <i  class="gs-user-circle"></i>
            <span :class="userId === item.desc? 'hightLight': ''">{{item.desc}}</span>
            <span class="transP" v-show="item.recvPersonNames">办结：
            </span>
            <span class="time pull-right">{{item.date}}</span>
          </h3>
          <div class="transMsg">
            <p class="content">{{item.title}}</p>
          </div>
          <div class="backContent" v-for="(keys, index) in item.replys" :key="index">
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
  </div>
</template>
<style lang="less" scpoed>
  .transList {
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
    .contenBig {
      padding: 5px 5px 1px 5px;
      .transComplete {
        position: relative;
        padding: 15px 10px 5px 10px;
        background: #f8f8f8;
        border-top: 1px solid #f8f8f8;
        border-bottom: 1px solid #e2e2e2;
        border-radius: 5px;
        margin-bottom: 5px;
        h3 {
          font-size: 14px;
          position: relative;
          width: 80%;
          padding-left: 20px;
          box-sizing: border-box;
          & > i {
            position: absolute;
            left: 0;
            top: 3px;
          }
          .backBtn {
            position: absolute;
            top: 10px;
            right: -65px;
            padding: 5px 15px;
            border: 1px solid #ccc;
            border-radius: 20px;
            font-size: 12px;
            z-index: 9;
          }
        }
        .transMsg {
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
        .transP {
          padding-left: 0px;
          font-size: 12px;
          font-weight: 400;
          color: #000;
        }
        .time {
          position: absolute;
          font-weight: 400;
          font-size: 12px;
          right: -60px;
          top: -15px;
        }
      }
    }
    p {
      font-size: 14px;
      line-height: 30px;
    }
  }
</style>
<script>
  import { Cell, Popup, Panel, Group } from 'vux'

  export default {
    props: ['data', 'userId', 'backContent', 'showOperation', 'showEdit'],
    data() {
      return {
        transShow: true
      }
    },
    components: {
      Cell,
      Popup,
      Panel,
      Group
    },
    computed: {
      // 与父组件通信用属性
      title: {
        get() {
          const expend = this.show ? '' : ''
          return `办结情况${expend}`
        }
      },
      list: {
        get() {
          const result = []
          this.data.forEach((value) => {
            result.push({
              title: value.disposeDescription,
              desc: value.disposePersonName,
              date: value.disposeTimeStr,
              recvOrgNames: value.recvOrgNames,
              recvPersonNames: value.recvPersonNames,
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
    methods: {
      backMsg(obj, index) {
        this.index = index
        this.$emit('maskShow', obj)
      },
      setList() {
        this.list[this.index].replys.push({
          disposeDescription: this.backContent,
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
    mounted() {
    }

  }
</script>
