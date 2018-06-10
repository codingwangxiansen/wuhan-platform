<template>
  <div>
    <div v-show="section === sectionEvent">
      <div class="list" v-show="items.length > 0">
        <div v-for="(item, index) in items" :key="index" @click="onEventSelected(item.title, item.id, item.reportOrgName, item.orgCode)">
          <h4>{{item.title}}</h4>
          <div class="under">
            <span>{{item.source}}</span>
            <span class="pull-right">{{item.time}}</span>
          </div>
        </div>
      </div>
      <div class="list" v-show="items.length == 0">
        没有找到数据
      </div>
      <group class="backBtn">
        <x-button type="theme" @click.native="backOn">返回</x-button>
      </group>
    </div>
    <div v-show="section === sectionDispose">
      <div class="under">
        <span>{{$store.state.formSupervise.eventInfoTitle}}</span>
      </div>
      <div class="list" v-show="disposes.length > 0">
        <div v-for="(item, index) in disposes" :key="index" @click="onDisposeSelected(item)">
          <h4>{{item.disposeDescription}}</h4>
          <div class="under">
            <span>{{item.indirectPerson}}</span>
            <!--<span class="pull-right">{{item.time}}</span>-->
          </div>
        </div>
      </div>
      <group class="backBtn">
        <x-button type="theme" @click.native="backOn">返回</x-button>
      </group>
    </div>
  </div>
</template>
<script>
  import { Group, XButton } from 'vux'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import { siteUrl } from '../../../../../utils/common'

  Vue.use(VueResource)

  export default {
    props: {},
    components: {
      Group,
      XButton
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.typeId = vm.$router.history.current.params.typeId
        vm.process.push(vm.sectionEvent)
        vm.loadEventInfoList()
      })
    },
    beforeRouteLeave(to, from, next) {
      this.process.pop()
      if (this.process.length === 0) {
        next()
      } else {
        next(false)
      }
    },
    data() {
      return {
        // 判断是选择事件，还是领导批示
        typeId: '',
        list: [],
        // 领导批示记录
        disposes: [],
        // 场景队列栈，当点击后退时会优先判定栈中元素是否存在，如果存在，则禁用后退
        process: [],
        // 转办事项场景
        sectionEvent: { title: '选择转办事项' },
        // 领导批示场景
        sectionDispose: { title: '选择批示指示' }
      }
    },
    watch: {
      // 监听当前场景值，发生变化时，可以改变页面标题
      section: 'onSectionChange'
    },
    computed: {
      section() {
        const len = this.process.length
        if (this.process.length > 0) {
          console.log(this.process[len - 1])
          return this.process[len - 1]
        }
        return { title: '' }
      },
      // 信息列表
      items() {
        const result = []
        this.list.forEach((item) => {
          result.push(
            {
              // eventInfoId, infoTitle, reportOrgName, updateTime
              id: item.eventInfoId,
              title: item.infoTitle,
              source: item.reportOrgName,
              time: item.updateTime,
              orgCode: item.orgCode,
              reportOrgName: item.reportOrgName
            }
          )
        })
        return result
      }
    },
    methods: {
      // 返回
      backOn() {
        this.$router.go(-1)
      },
      // 选择的时候把选择的title和id传过去
      onEventSelected(title, id, orgName, orgCode) {
        this.$store.commit('setSupervisePerson', { orgName, orgCode })
        if (this.typeId === '1') {
          const data = { data: [{ key: 'eventInfoId', value: id }, { key: 'eventInfoTitle', value: title }] }
          this.$store.commit('setFormSupervise', data)
        } else {
          const data = { data: [{ key: 'disposeId', value: id }, { key: 'disposeTitle', value: title }] }
          this.$store.commit('setFormSupervise', data)
        }
        // 选完信息后，继续选择相关领导批示
        this.loadDisposeList()
        // this.$router.go(-1)
      },
      // 选中批示
      onDisposeSelected(item) {
        const data = { data: [{ key: 'disposeId', value: item.eventDisposeId },
            { key: 'disposeTitle', value: item.disposeDescription }] }
        this.$store.commit('setFormSupervise', data)
        this.process.pop()
        this.$router.go(-1)
      },
      // 加载可以选择的信息列表
      loadEventInfoList() {
        const that = this
        const url = `${siteUrl}/eventInfo/listeventinfo`
        that.list = []
        that.axios.get(url)
          .then((response) => {
            this.list = response.data.response
          })
          .catch((e) => {
            console.error(e)
          })
      },
      // 根据信息id加载可以转办的领导批示信息
      loadDisposeList() {
        // https://whyj.gsafetyweixinsupport.cn/geminirest/api/m/eventdispose/instruct/list/1525419422132696
        const that = this
        const url = `${siteUrl}/eventdispose/instruct/list/${that.$store.state.formSupervise.eventInfoId}`
        that.disposes = []
        that.axios.get(url)
          .then((response) => {
            console.debug(response)
            that.disposes = response.data.response
            if (that.disposes.length === 0) {
              // 如果领导批示记录等于0，则直接返回，并赋值领导批示为空值
              const data = { data: [{ key: 'disposeId', value: '' }, { key: 'disposeTitle', value: '' }] }
              that.$store.commit('setFormSupervise', data)
              that.$router.go(-1)
            } else {
              // 如果存在领导批示，则给出供用户选择
              that.$vux.confirm.show({
                title: '附加该事件的领导批示？',
                content: '',
                onConfirm() {
                  that.process.push(that.sectionDispose)
                },
                onCancel() {
                  const data = { data: [{ key: 'disposeId', value: '' }, { key: 'disposeTitle', value: '' }] }
                  that.$store.commit('setFormSupervise', data)
                  that.$router.go(-1)
                }
              })
            }
          })
          .catch((e) => {
            console.error(e)
          })
      },
      // 页面场景发生变化时调用
      onSectionChange() {
        this.$store.commit('setHeaderTitle', this.section.title)
      }
    }
  }
</script>
<style lang="less" scoped>
  .backBtn {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .list {
    margin-bottom: 50px;
    > div {
      background: #fff;
      padding: 5px 10px;
      border-bottom: 1px solid #ddd;
    }
    .under {
      > span:nth-child(2) {
        font-size: 12px;
        color: #999;
      }
    }
  }
</style>
