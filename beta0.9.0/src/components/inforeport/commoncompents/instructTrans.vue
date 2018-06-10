<!-- 转办控件	 -->
<template>
  <div class="transList">
    <group title="转办督办" class="deal gs-tune">
      <i class="icon" @click.prevent="transShow = !transShow" :class="transShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
      <!--<panel header="" :list="content" type="4" ></panel>-->
      <div class="bigContent" v-show="transShow">
        <div class="transItem" v-for="(item, index) in content">
          <h3>
            <i class="gs-user-circle"></i>
            <span :class="userId === item.desc? 'hightLight': ''">{{item.desc}}</span>
            <span class="transP">
              转办至
              <span
                :class="userId === item.recvOrgNames? 'hightLight': ''">
                {{getTransTarget(item.recvOrgNames,item.recvPersonNames)}}：
              </span>
            </span>
            <span class="pull-right time">{{item.date}}</span>
          </h3>
          <p class="transContent">
            {{item.title}}
          </p>
          <attach-upload
            :attachs="item.attachs"
            :canUpload="false"
          ></attach-upload>
        </div>
      </div>
    </group>
  </div>
</template>
<style lang="less" scpoed>
  .transList {
    .bigContent {
      padding: 5px 5px 1px 5px;
      h3 {
        font-size: 14px;
        position: relative;
        .time {
          font-weight: 400;
          font-size: 12px;
          position: absolute;
          right: 5px;
          top: -10px;
        }
      }
      .transItem {
        padding: 12px 10px 5px 10px;
        background: #f8f8f8;
        border-top: 1px solid #f8f8f8;
        border-bottom: 1px solid #e2e2e2;
        border-radius: 5px;
        margin-bottom: 5px;
      }
    }
    .transContent {
      line-height: 20px;
      font-size: 14px;
      padding-left: 22px;
    }
    .transP {
      display: inline;
      padding-left: 0px;
      font-size: 12px;
      font-weight: 400;
      color: #000;
    }
  }
</style>
<script>
  import { Cell, Popup, Panel, Group } from 'vux'
  import AttachUpload from '../../mycomponents/AttachUpload'

  export default {
    props: ['listTrans', 'userId'],
    data() {
      return {
        transShow: true
      }
    },
    components: {
      Cell,
      Popup,
      Panel,
      Group,
      AttachUpload
    },
    created() {
    },
    methods: {
      getTransTarget(recvOrgNames, recvPersonNames) {
        if (recvOrgNames && recvPersonNames) { // 转办到了机构和人
          return recvOrgNames
        } else if (recvPersonNames) {
          return recvPersonNames
        }
        return recvOrgNames
      }
    },
    computed: {
      content: {
        get() {
          const result = []
          this.listTrans.forEach((value) => {
            let attachs = []
            if (value.attachs) {
              attachs = JSON.parse(value.attachs)
            }
            result.push({
              title: value.disposeDescription,
              desc: value.disposePersonName,
              date: value.disposeTimeStr,
              recvOrgNames: value.recvOrgNames,
              recvPersonNames: value.recvPersonNames,
              attachs
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
