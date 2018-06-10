<!-- 信息审核组件	 -->
<template>
	<popup v-model="show" class="popContainer">
    	<div class="head">
        <span class="headBtnL" @click="cancel">取消</span>
        <div class="headTitle">信息审核</div>
        <span class="headBtnR"  @click="$emit('on-confirm', comment, targets)">✔ 审核</span>
      </div>
      	<box gap="0 15px 25px 15px">
        	<div class="popup0">
          		<group>
                <cell title="发送给" :value="userNames" @click.native="chooseUser" is-link></cell>
              </group>
              <group>
            		<x-textarea v-model="comment" placeholder="输入审核意见"></x-textarea>
          		</group>
              <group>
                <div class="headBtnL normalW">
                  <p>常用：</p>
                  <div class="opinion"
                       v-for="textTmpl in textTmpls"
                       @click ="chooseOpinion">
                    {{textTmpl}}
                  </div>
                </div>
              </group>
        	</div>
      	</box>
    </popup>
</template>
<style lang="less" scoped>
  .popContainer {
    height: 36%;
  }
 .head {
   color: #444;
   background-color: #f2f2f2;
   text-align: center;
   font-weight: 500;
   line-height: 45px;
   font-size: 16px;
   span {
     font-size:14px;
   }
  }
 .headTitle {
   display: inline-block;
 }
  .headBtnL {
    float: left;
    color: #a5a4a4;
    font-weight: normal;
    padding: 0 1em;
  }

  .headBtnR{
    float: right;
    color: #0faaff;
    font-weight: normal;
    padding: 0 1em;
  }
  .opinion{
    text-align: left;
    color: #a5a4a4;
    padding: 0 1em;
    font-family: -apple-system;
  }
  .normalW {
    background: #fff;
    margin-top: -20px;
    padding-bottom: 20px;
    width: 100%;
    box-sizing: border-box;
  }
</style>
<script>
import { Box, Popup, Group, Cell, XButton, XTextarea } from 'vux'

export default {
  name: 'EventApply',
  props: ['value'],
  data() {
    return {
      comment: '',
      defaultSelect: [],
      leaderType: '1'
    }
  },
  computed: {
    targets: { // 领导ID数组
      get() {
        return this.$store.state.leaderList
      },
      set() {
      }
    },
    userNames() {
      let leaderList
      if (this.leaderType === '1') {
        leaderList = this.$store.state.groupLeader
      } else if (this.leaderType === '2') {
        leaderList = this.$store.state.cityLeader
      } else {
        leaderList = this.$store.state.allUser
      }
      let text = ''
      const o = this.targets[0]
      leaderList.forEach(({ key, value }) => {
        if (key === o) {
          text = value
          if (this.targets.length > 1) {
            text = `${text}等${this.targets.length}人`
          }
        }
      })
      return text
    },
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    textTmpls() { // 文字模板
      const textTmpls = this.$store.state.textTemplate
      const tmpl = textTmpls.filter(textTmpl => textTmpl.key === 'INFOCKECK')
      if (tmpl.length) {
        return tmpl[0].templates
      }
      return []
    }
  },
  components: {
    Box,
    Popup,
    Group,
    Cell,
    XButton,
    XTextarea
  },
  methods: {
    cancel() {
      this.show = false
      this.$store.commit('resetLeaderList')
      this.$store.commit('setDealWindow', '')
    },
    clear() {
      this.comment = ''
    },
    chooseUser() {
      this.$store.commit('setDealWindow', 'check')
      this.$router.push({
        name: 'LeaderSelect',
        params: {
          leaderType: this.leaderType,
          maxLength: 10
        }
      })
    },
    chooseOpinion(e) {
      this.comment = e.target.innerText
    }
  }
}
</script>
