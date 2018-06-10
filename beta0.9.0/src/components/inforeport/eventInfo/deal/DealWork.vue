<!-- 批示控件	 -->
<template>
  <div class="transList">
    <group title="批示指示" class="deal gs-person2">
      <i class="icon" @click.prevent="tranShow = !tranShow" :class="tranShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
      <!--<panel header=""  :list="list" type="4" ></panel>-->
      <div class="bigContent" v-show="tranShow">
        <div class="transItem" v-for="(item, index) in list" :key="index">
          <h3>
            <i  class="gs-user-circle"></i>
            <span :class="userId === item.desc? 'hightLight': ''">{{item.desc}}</span>
            <span class="time pull-right">{{item.meta}}</span>
          </h3>
          <div class="transMsg">
            <p class="content">{{item.title}}</p>
          </div>
        </div>
      </div>
      <!--
      <i class="icon" @click.prevent="tranShow = !tranShow" :class="tranShow ? 'gs-keyboard_arrow_down' : 'gs-keyboard_arrow_up' "></i>
      <div class="bigcontent" v-show="tranShow">
        <div class="widthContent" :style="'width:'+ 11 * list.length +'em;'">
          <div class="workContant" v-for="(item, index) in list" @click="showMore(item.title)">
            <h3><i class="gs-vcard-o"></i><span :class="userId === item.desc? 'hightLight': ''">{{item.desc}}</span></h3>
            <h4>{{item.meta}}</h4>
            <p>{{item.title}}</p>
          </div>
        </div>
      </div>
      -->
    </group>
    <x-dialog class="dialog-demo" v-model="showScrollBox">
      <div class="closeDiv" @click="showScrollBox=false">
        <span class="vux-close gs-close-bold"></span>
      </div>
      <!--<p class="dialog-title">Long content</p>-->
      <div class="img-box" >
        <span class="lineCss">{{moreContent}}</span>
      </div>
    </x-dialog>
  </div>
</template>
<style lang="less" scpoed>
  .bigContent {
    padding: 5px 5px 1px 5px;
  }
  .transList {
    .content {
      line-height: 20px;
      font-size: 14px;
      padding-left: 22px;
    }
    .transItem {
      padding: 12px 10px 5px 10px;
      background: #f8f8f8;
      border-top: 1px solid #f8f8f8;
      border-bottom: 1px solid #e2e2e2;
      border-radius: 5px;
      margin-bottom: 5px;
    }
    .dialog-demo {
      .weui-mask {
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
        font-size: 14px;
      }
      .img-box {
        height:200px;
        padding: 15px 17px;
        overflow:scroll;
        text-align: left;
      }
    }
    .workContant {
      display: inline-block;
      width: 9em;
      border: 1px solid #e2e2e2;
      margin: 0.5em;
      border-radius: 5px;
      padding: 6px;
      vertical-align: text-top;
      height: 150px;
      h3 {
        font-size: 14px;
        text-align: center;
      }
      h4 {
        font-size: 12px;
        text-align: center;
      }
      p {
        font-size: 12px;
        text-align: left;
        color: #676767;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
        line-height: 24px;
      }
    }
    .time {
      text-align: right;
      font-size: 12px;
      color: #999;
      font-weight: 400;
    }
  }
</style>
<script>
  import { Cell, Popup, Panel, Group, XDialog } from 'vux'

  export default {
    props: ['listDeal', 'userId'],
    data() {
      return {
        tranShow: true,
        showScrollBox: false,
        moreContent: ''
      }
    },
    components: {
      Cell,
      Popup,
      Panel,
      Group,
      XDialog
    },
    created() {
    },
    methods: {
      showMore(content) {
        this.moreContent = content
        this.showScrollBox = true
      }
    },
    computed: {
      list: {
        get() {
          const result = []
          this.listDeal.forEach(({ indirectPerson, disposeDescription, disposeTimeStr,
          disposePersonPosition }) => {
            result.push({
              title: disposeDescription,
              desc: indirectPerson,
              meta: disposeTimeStr,
              position: disposePersonPosition
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
