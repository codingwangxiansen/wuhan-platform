<template>
  <div class="cellBox">
    <!-- 这一块固定在顶部 -->
    <div>
      <!-- 搜索框 -->
      <!--
          <search placeholder="搜索机构"  v-model="filterInput" autoFixed
              cancel-text="清空" @on-change="query">
          </search>
          -->
      <!-- 树节点路由 -->
      <check-native	@on-root-click="goRoot" @on-node-click="goNode"
                     :route="nodeRoute">
      </check-native>
      <!-- 机构显示清单列表 -->
      <div align="left" class="checkedDiv"><span v-for="(one, index) in currentValue" class="checkedOrg" @click="clearOrg(one)"> {{one.name}} </span></div>
    </div>
    <!-- 机构列表 -->
    <div class="weui-cells weui-cells_checkbox">
      <div v-for="(one, index) in list" class="containerBox" :class="one.isEntity?'':'disableClick'">
        <label class="weui-cell weui-check__label">
          <div class="weui-cell__hd" >
            <input type="checkbox" class="weui-check" v-model="currentValue" :value="one" @change="onOrgChange(one,one.isEntity)">
            <i class="weui-icon-checked" v-show="one.isEntity"></i>
          </div>
          <div class="weui-cell__bd">
            <p>{{one.name}}</p>
          </div>
        </label>
        <p @click.stop="expendNode(one)" v-show="one.childNum > 0" class="coll org-child-btn">></p>
      </div>
    </div>
    <!-- 确定按钮 固定在底部 -->
    <box class="gaBtn" gap="10px 10px">
      <x-button type="theme" @click.native="confirm">确定</x-button>
    </box>
  </div>
</template>
<style lang="less" scoped>

  .weui-cells {
    margin-bottom: 40px;
    height: 66%;
    overflow:scroll;
  }
  .gaBtn {
    position:fixed;
    bottom:0;
    width:95%;
  }
  .cellBox {
    height:100%;
    position:relative;
    background-color: #fff;
    .weui-cells:after {
      border: none;
    }
  }
  .containerBox {
    position:relative;
  }
  .disableClick {
    color: #999;
  }
  .coll {
    position:absolute;
    right:13px;
    top: 0;
  }
  .checkedDiv{
    padding: 0 1rem;
  }
  .checkedOrg{
    color: #fff;
    background-color: #67c23a;
    border-radius: 0.3rem;
    padding:0.2rem;
    display: inline-block;
    margin: 0.1rem;
  }
  .org-child-btn{
    color: #909399;
    font-size: 1.5rem;
    padding: 0.2rem 1.5rem 0.2rem 9rem;
    right: 0.2rem;
  }
</style>
<script>
  import { XButton, Box, Search } from 'vux'
  import CheckNative from './CheckNative'
  import { siteUrl } from '../../../utils/common'

  export default {
    name: 'CheckCell',
    props: ['value', 'maxLength', 'valid'],
    data() {
      return {
        isFirst: true,
        // 用一个变量来记录点击的是否是同一个节点
        idSame: '',
        root: { name: '', value: '-1' },
        nodeRoute: {
          history: [],
          current: { name: '', value: '-1' }
        },
        filterInput: '',
        list: [],
        flag: true,
        currentP: this.$store.state.supervisePerson
      }
    },
    computed: {
      currentValue: {
        get() {
          const selectUser = this.$store.state.supervisePerson
          // 第一进入的时候flag是true，将当前用户push进入，之后直接改为false，不能再push
          // 添加转办督办的时候选择相关事件带入机构
          if (this.currentP.orgCode !== selectUser.orgCode) {
            if (this.currentP.orgCode) {
              this.value.pop(1)
            }
            this.value.push({
              childNum: 0,
              inlineDesc: '',
              isEntity: true,
              name: selectUser.orgName,
              value: selectUser.orgCode
            })
            this.currentP = selectUser
          }
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {
      $route() {
        this.idSame = ''
      }
    },
    components: {
      CheckNative,
      XButton,
      Box,
      Search
    },
    mounted() {
      this.goRoot()
    },
    methods: {
      // 点击当前节点
      expendNode(one) {
        // 添加当前节点到历史，并指向新的节点
        this.nodeRoute.history.push(this.nodeRoute.current)
        this.nodeRoute.current = one

        // 加载新节点列表
        this.pullNodes()
      },
      onOrgChange(one, flag) {
        if (!flag) {
          this.currentValue = []
          return
        }
        if (this.idSame === one.childNum) {
          this.currentValue = []
          this.idSame = ''
          return
        }
        if (this.maxLength > 1) {
          return
        }
        this.idSame = one.childNum
        const l = []
        l.push(one)
        this.currentValue = l
      },
      // 切换到根节点
      goRoot() {
        // 清空路由信息
        this.nodeRoute.history = []
        this.nodeRoute.current = this.root

        // 刷新页面
        this.pullNodes()
      },
      // 切换到指定节点
      goNode(item) {
        // 获取栈顶节点
        const t = this.nodeRoute.history.pop()
        if (t === item) {
          // 如果与点击节点一致，结束并拉取数据
          this.nodeRoute.current = t
          this.pullNodes()
        } else {
          // 否则继续返回
          this.goNode(item)
        }
      },
      clearOrg(one) {
        this.currentValue.shift(one)
      },
      // 从服务端拉取列表
      pullNodes() {
        const parentid = this.nodeRoute.current.value
        let url
        if (this.valid) {
          url = `${siteUrl}/basedata/org/mobileOrgList?orgCode=${parentid}`
        } else {
          url = `${siteUrl}/basedata/org/listValidOrg`
        }
        const vm = this
        this.$http.get(url).then((res) => {
          vm.list = []
          const array = res.body.response
          if (array) {
            const itemArr = Object.values(array)
            itemArr.forEach((value) => {
              const record = {
                name: value.orgName,
                value: value.orgCode,
                childNum: value.isLeaf,
                inlineDesc: '',
                isEntity: value.isEntity
              }
              vm.list.push(record)
            })
          }
        })
      },
      // 确定提交消息
      confirm() {
        this.goRoot()
        this.$emit('on-org-select', this.currentValue)
      },
      //
      query() {
      }
    }
  }
</script>
