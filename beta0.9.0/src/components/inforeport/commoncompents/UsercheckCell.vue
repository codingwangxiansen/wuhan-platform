<template>
  <div class="cellBox">
    <group  class="chunk" v-for="(item,index) in checked" :key="index">
      <x-input readonly title="单位:"  placeholder="必填" v-model='item.OrgName' :show-clear="false" text-align="right"></x-input>
      <x-input readonly title="用户名:" placeholder="必填" v-model='item.Name' :show-clear="false" text-align="right"></x-input>
      <x-input readonly title="手机号:" placeholder="必填" v-model='item.userCellPhone' :show-clear="false" text-align="right"></x-input>
      <x-input readonly title="办公电话:" placeholder="必填" v-model='item.userTel' :show-clear="false" text-align="right"></x-input>
      <!--default item.auditStatus === 0 ? false : true  item.auditStatus === 0 ? theme : default-->
      <x-button :disabled="btnCl(item.auditStatus)" :type="btnCol(item.auditStatus)" @click.native="check(item.id)">
        {{btnName}}
      </x-button>
    </group>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../styles/common.less";
  .chunk {
    transition: all 0.5s;
    margin-bottom: 1em;
  }
  .chunk:hover {
    box-shadow: 4px 6px 5px 1px rgba(33,33,33,.3);
  }
  .checkUser {
    background: #10aeff;
    color: #fff;
    line-height: 2.5em;
    padding-left: 1em;
    border-radius: 8px 8px 0 0;
    margin-left: 10px;
    margin-right: 10px;
    position: fixed;
    z-index: 99;
    width: 91%;
    top: 0;
  }
</style>
<script>
  import { XButton, Box, Search, XInput, Group } from 'vux'
  import CheckNative from './CheckNative'

  export default {
    name: 'CheckCell',
    props: ['checked', 'btnName'],
    data() {
      return {

      }
    },
    components: {
      CheckNative,
      XButton,
      Box,
      Search,
      XInput,
      Group
    },
    mounted() {
      console.log(this.btnName)
    },
    methods: {
      // 点击当前节点
      check(id) {
        this.$emit('on-info-click', id)
      },
      btnCl(sta) {
        let disable
        if (sta === 1) {
          disable = true
        } else if (sta === 0) {
          disable = false
        } else {
          disable = false
        }
        return disable
      },
      btnCol(sta) {
        let btnColor
        if (sta === 1) {
          btnColor = 'defalut'
        } else if (sta === 0) {
          btnColor = 'theme'
        } else {
          btnColor = 'theme'
        }
        return btnColor
      }
    }
  }
</script>
