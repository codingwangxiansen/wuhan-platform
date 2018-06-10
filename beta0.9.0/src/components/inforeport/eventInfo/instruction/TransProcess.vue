<template>
    <div class="main">
      <div>
        <div>
          <!--begin效果图-->
          <div v-show="checklists.length == 0">
            <transition-page :options="promptDiagram"></transition-page>
          </div>
          <!--<div class="instr-cell" v-for="x in checklists">-->
          <div class="">
            <process-detail ref="processid" :id="id"></process-detail>
          </div>
        </div>
      </div>
    </div>
</template>
<style lang="less" scoped>
  @import "../../../../styles/common.less";
  .telPhone {
    margin-left: 1em;
  }
  .creatName {
    float: left;
    margin-left: 0.4em;
    font-size: 1.2em;
    color: #34669c;
  }
  .vux-popup-dialog {
    height: 94% !important;
  }
  .head {
    color: #444;
    background-color: #f2f2f2;
    text-align: center;
    font-weight: 700;
    line-height: 56px;
    font-size: 16px;
  }
  .actBtn {
    text-align: right;
    margin-top: 1em;
  }
  .actBtn button.weui-btn,.actBtn input.weui-btn {
    width: 25%;
    display: inline-block;
    height: 2em;
    line-height: 2em;
    font-size: 1em;
  }
  .infoBack {
    position: relative;
  }
  .rel-info {
    position: relative;
  }
  .backAct {
    margin-left: 0.4em;
  }
  .isBack {
    margin-left: 0.5em;
    position: relative;
    color:#34669c;
  }
  .instr-cell {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    background: #fff;
  }
  .instr-content {
    margin: 5px 10px;
    font-weight: bold;
  }
  .leader-info {
    text-align: right;
    margin-right: 20px;
  }
  .rel-info {
    display: block;
  }
  .i-release {
    color: #454545;
    margin: 0 20px 0 6px;
  }
  .release {
    color: #03A9F4;
  }
</style>
<script>
  // 导入页面所需的标签
  import TransitionPage from './../../../mycomponents/TransitionPage'
  import watchPopup from './watchPopup'
  import ProcessDetail from '../../commoncompents/ProcessDetail'

  export default {
    name: 'InstructItem',
    props: ['id'],
    data() {
      return {
        checklists: [],
        objPop: {},
        tel: 15623544711,
// 回复状态
        readStatusSt: '',
        backContent: '',
        watchObj: {},
        beginPic: true,
        page: 0,
        size: 10,
        handleMessage: '',
        url: '',
        showV: false,
        p1: '1',
        checkMessage: '',
        pullup_config: {
          content: '',
          downContent: '数据加载中...',
          upContent: '',
          loadingContent: '数据加载中...',
          hight: 60
        },
        pulldown_config: {
          content: '',
          downContent: '松开刷新',
          upContent: '松开刷新',
          loadingContent: '数据加载中...',
          hight: 60
        },
        imgsrc: require('assets/image/img-05NotExist.png'),
        promptDiagram: {
          show: false,
          imgUrl: '',
          content: '',
          myColor: {
            type: String,
            default: '#e45050'
          }
        }
      }
    },
    components: {
      TransitionPage,
      watchPopup,
      ProcessDetail
    },
    created() {
      this.id = this.$router.history.current.params.id
    },
    methods: {
      HandleCancel() {
        this.showV = false
      },
      call() {
        window.location.href = `tel:${this.tel}`
      },
      toBack(obj) {
        this.showV = true
        this.$refs.popShow.showPop(obj.transactContent)
        const data = {
          infoId: obj.infoId,
          transactId: obj.transactId
        }
        this.objPop.transactContent = obj.transactContent
        this.objPop.watchObj = data
      },
      getData(item) {
        this.checkList = []
        const that = this
        const oldItem = that.currentItem
        that.currentItem = item
        that.changeTab(item)
        if (oldItem !== item) {
          this.attachs = []
          that.attachExist = false
        }
      },
      beforeRouteEnter(to, from, next) {
        next((vm) => {
          // 通过 `vm` 访问组件实例
          vm.id = vm.$router.history.current.params.id
        })
      },
      loadPage(id) {
        this.$refs.processid.init(id)
      }
    }
  }
</script>
