<template>
  <div class="main">
   <!-- <div class="content">
      <div class="title">常用事件类型</div>
      <ul class="clear-float">
        <li  @click="chooseEventType(item)" v-for="(item,index) in commonList"><div>{{item.name}}</div></li>
      </ul>
    </div>-->
    <div class="content" >
      <div class="title">中心城区</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.key}" @click="chooseEventType(item)" v-for="item in districtCenter"><div>{{item.value}}</div></li>
      </ul>
    </div>
    <div class="content" >
      <div class="title">新城区</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.key}" @click="chooseEventType(item)" v-for="item in newCityDistrict"><div>{{item.value}}</div></li>
      </ul>
    </div>
    <div class="content" >
      <div class="title">功能区</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.key}" @click="chooseEventType(item)" v-for="item in functionDistrict"><div>{{item.value}}</div></li>
      </ul>
    </div>
   <!-- <div class="content">
      <div class="title">事故灾难</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.value}" @click="chooseEventType(item)" v-for="item in accidentDisaster"><div>{{item.name}}</div></li>
      </ul>
    </div>
    <div class="content">
      <div class="title">医疗卫生</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.value}" @click="chooseEventType(item)" v-for="item in healthSecurity"><div>{{item.name}}</div></li>
      </ul>
    </div>
    <div class="content">
      <div class="title">社会安全</div>
      <ul class="clear-float">
        <li :class="{'active': chooseCode === item.value}" @click="chooseEventType(item)" v-for="item in socialSecurity"><div>{{item.name}}</div></li>
      </ul>
    </div>-->

  </div>
</template>

<script>

  export default {
    name: 'district-selector',
    props: [],
    data() {
      // const natural = []
      // const accident = []
      // const health = []
      // const social = []
      // for (let i = 0; i < eventType.length; i += 1) {
      //   if (eventType[i].parent === '11000') {
      //     natural.push(eventType[i])
      //   }
      //   if (eventType[i].parent === '12000') {
      //     accident.push(eventType[i])
      //   }
      //   if (eventType[i].parent === '13000') {
      //     health.push(eventType[i])
      //   }
      //   if (eventType[i].parent === '14000') {
      //     social.push(eventType[i])
      //   }
      // }
      return {
        chooseCode: '',
        // commonList: [],
        // typeList: eventType,
        districtCenter: [
          {
            key: '420102',
            value: '江岸区'
          },
          {
            key: '420103',
            value: '江汉区'
          },
          {
            key: '420104',
            value: '硚口区'
          },
          {
            key: '420105',
            value: '汉阳区'
          },
          {
            key: '420106',
            value: '武昌区'
          },
          {
            key: '420107',
            value: '青山区'
          },
          {
            key: '420111',
            value: '洪山区'
          }
        ],
        newCityDistrict: [
          {
            key: '420114',
            value: '蔡甸区'
          },
          {
            key: '420115',
            value: '江夏区'
          },
          {
            key: '420112',
            value: '东西湖区'
          },
          {
            key: '420116',
            value: '黄陂区'
          },
          {
            key: '420117',
            value: '新洲区'
          }
        ],
        functionDistrict: [
          {
            key: '420118',
            value: '东湖新技术开发区'
          },
          {
            key: '420119',
            value: '武汉经济技术开发区'
          },
          {
            key: '420120',
            value: '东湖生态旅游风景区'
          },
          {
            key: '420121',
            value: '武汉新港'
          }
        ],
        // healthSecurity: health,
        // socialSecurity: social,
        common: ''
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.$store.commit('setHeaderTitle', '选择行政区域') // 设置头部文字
        vm.chooseCode = vm.$route.params.code
        //  循环遍历事件常用次数，排序
        // const commonListStr = localStorage.getItem('commonList')
        // if (commonListStr) {
        //   vm.commonList = JSON.parse(commonListStr)
        // }
        // vm.getEventData()
      })
    },
    created() {
    },
    methods: {
      //  从大到小排序
      compare(x, y) {
        const val1 = x.count
        const val2 = y.count
        if (val1 < val2) {
          return 1
        } else if (val1 > val2) {
          return -1
        }
        return 0
      },
      // getEventData() {
      //   const that = this
      //   const URL = `${siteUrl}/eventInfo/list/eventTypeList`
      //   this.$http.get(URL).then((response) => {
      //     // that.$store.dispatch('hidePageLoading')
      //     console.log(response)
      //     if (response.body.code === 200) {
      //       that.eventdata = response.body.response
      //     }
      //   })
      // },
      //  选择事件类型
      chooseEventType(item) {
        // let isIndex = false
        // this.commonList.forEach((common) => {
        //   if (item.value === common.type) {
        //     common.count += 1
        //     isIndex = true
        //   }
        // })
        // if (!isIndex) {
        //   if (this.commonList.length > 6) {
        //     this.commonList.shift()
        //   }
        //   this.commonList.push({
        //     type: item.value,
        //     name: item.name,
        //     count: 1
        //   })
        // }
        // localStorage.setItem('commonList', JSON.stringify(this.commonList))
        const district = {
          code: item.key,
          name: item.value
        }
        this.$store.commit('setChooseDistrict', district)
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
.main{
  background-color: #fff;
  .content{
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 1%;

    .title{
      margin: 2% 0 1% 3%;
      color: #c8c8cd;
    }

    ul{
      padding: 0 0 0 3%;

      li{
        float: left;
        height: 3em;
        line-height: 3em;
        width: 27%;
        margin: 0 2% 2% 0;
        padding: 0 2% 1% 2%;
        background-color: #dddddd;
        text-align: center;
        border-radius: 0.5em;
        font-size: 0.9em;

        > div {
          line-height: 1.5;
          display: inline-block;
          vertical-align: middle;
        }
      }

      li.active{
        background-color: #248bff;
        color: #FFFFFF;
      }
    }
  }
}
</style>
