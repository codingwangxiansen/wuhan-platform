<template>
    <div class="feedback-content" v-show="MaskShow">
      <div class="listMask" @click.prevent="hideMask">

      </div>
      <div class="popConfirm" v-show="MaskShow">
        <h4>{{title}}</h4>
        <x-textarea :placeholder="placeholder" v-model="backContent"></x-textarea>
        <x-button class="enter pull-left" @click.native="confirm">提&nbsp;&nbsp;交</x-button>
        <x-button class="cancel pull-left" @click.native="hideMask">取&nbsp;&nbsp;消</x-button>
      </div>
    </div>
</template>
<script>
  import { XButton, XTextarea } from 'vux'
  import { siteUrl } from './../../../utils/common'

  export default {
    props: ['options'],
    data() {
      return {
        a: '',
        MaskShow: false,
        backContent: '',
        check: {}
      }
    },
    components: {
      XButton,
      XTextarea
    },
    computed: {
      title() {
        if (this.options) {
          return this.options.title
        }
        return '回     复'
      },
      placeholder() {
        if (this.options) {
          return this.options.placeholder
        }
        return '请输入回复内容'
      }
    },
    methods: {
      //      回复的遮罩层显示
      showMask(obj) {
        this.check = {}
        this.MaskShow = true
        this.check = obj
      },
      hideMask() {
        this.MaskShow = false
      },
      clear() {
        this.backContent = ''
      },
//      提交审核意见
      confirm() {
        const url = `${siteUrl}/eventdispose/check/reply`
        const vm = this
        if (vm.check.selfFlag) {
          vm.$emit('on-save', vm.backContent)
          return
        }
        this.check.disposeDescription = this.backContent
        vm.MaskShow = false
        vm.$vux.confirm.show({
          title: '确认回复？',
          content: '',
          onConfirm() {
            vm.$http.post(url, vm.check).then((res) => {
              if (res.body.code === 200) {
                vm.$emit('on-save', vm.backContent)
                vm.backContent = ''
                vm.$vux.toast.text('回复成功', 'middle')
              } else {
                vm.$vux.toast.text(res, 'middle')
              }
            })
          },
          onCancel() {
            if (vm.check.selfFlag) {
              vm.$emit('on-fail')
            }
            vm.MaskShow = true
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .feedback-content{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
  }

  .listMask {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
  }
  .popConfirm {
    border-radius: 10px;
    width: 80%;
    background: #fff;
    z-index: 10001;
    position: fixed;
    left: 50%;
    margin-left: -40%;
    top: 50%;
    margin-top: -40%;
    transition: all 1s ;
  h4 {
    line-height: 40px;
    text-align: center;
    background: #248bff;
    color: #fffcfc;
    font-size: 20px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .cancel {
    margin: 0 4% 4% 4%;
    width: 42%;
  }
  .enter {
    width: 42%;
    margin: 0 4% 4% 4%;
  }
  }
</style>
