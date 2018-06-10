<template>
  <div class="commonTemplate">
    <group>
      <div class="headBtnL normalW">
        <p>常用：</p>
        <div class="opinion" v-for="(item, index) in lists" @click ="chooseOpinion(item)">
          {{item}}
        </div>
      </div>
    </group>
  </div>
</template>
<script>
  import { Group } from 'vux'

  export default {
    props: {
      templateType: {
        type: String,
        default: ''
      }
    },
    components: {
      Group
    },
    data() {
      return {
      }
    },
    computed: {
      lists: {
        get() {
          const allTem = this.$store.state.allTemplate
          allTem.forEach((val) => {
            if (this.templateType === val.tid) {
              return val.templates
            }
            return []
          })
        },
        set() {
        }
      }
    },
    methods: {
      chooseOpinion(item) {
        this.$emit('on-choose', item)
      }
    }
  }
</script>
<style lang="less" scoped>
.commonTemplate {
  .headBtnL {
    float: left;
    color: #a5a4a4;
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
}
</style>
