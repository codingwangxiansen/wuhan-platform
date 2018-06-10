<template>
  <div>
    <div class="add-info" v-show="showApprove">
    	<div :class="orgClass" class="square-o" @click="expandOrg"><span>审批领导</span></div>
        <div v-show="isExpandOrg">
        <group title="上级" v-show="isSuperior">
          <user-list label="主报领导" :users="data.applyRrecord"></user-list>
          <user-list label="抄报领导" :users="data.applyRecordDtos"></user-list>
        </group>
        <group title="下级" v-show="!isSuperior">
          <user-list label="审批领导" :users="data.applyRrecord"></user-list>
        </group>
  		</div>
	  </div>
    <div v-show="showHandle">
      <group v-show="record.handleStatus=='1'" title="审核意见">
        <x-textarea readonly v-model="record.handleMsg" :rows="4"></x-textarea>
      </group>
      <group v-show="record.handleStatus=='0'" title="退回原因">
        <x-textarea readonly v-model="record.handleMsg" :rows="4"></x-textarea>
      </group>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "../../styles/common.less";
  .square-o{
    padding: 5px 10px;
  }
  .square-o span:first-child{
    margin-left: 7px;
  }
  .add-info{
    margin-bottom: 15px;
  }
</style>
<script>
// 导入页面所需的标签
import { Group, XTextarea } from 'vux'
import Vue from 'vue'
import VueResource from 'vue-resource'
import UserList from './../gsafetycomponents/UserList'

Vue.use(VueResource)

export default {
  name: 'ApproveInfo',
  props: ['data', 'record'],
  data() {
    return {
      orgClass: 'gs-plus-square-o',
      isExpandOrg: false,
      checkStatus: true,
      refuseStatus: false,
      isSuperior: true
    }
  },
  computed: {
    showApprove() {
      if (this.data.applyRrecord.length || this.data.applyRecordDtos.length) {
        return true
      }
      return false
    },
    showHandle() {
      if (this.record.handleStatus) {
        return true
      }
      return false
    }
  },
  // 组件
  components: {
    XTextarea,
    Group,
    UserList
  },
  created() {
  },
  methods: {
    expandOrg() {
      this.isExpandOrg = !this.isExpandOrg
      if (this.isExpandOrg) {
        this.orgClass = 'gs-minus-square-o'
      } else {
        this.orgClass = 'gs-plus-square-o'
      }
    }
  }
}
</script>
