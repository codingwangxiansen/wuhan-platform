<template>
  <div>
    <panel header="某某信息处理流程" :footer="footer" :list="list" :type="type" @on-img-error="onImgError"></panel>
  </div>
</template>

<i18n>
Switch the type:
  zh-CN: 切换样式
List of content with image:
  zh-CN: 图文组合列表
More:
  zh-CN: 查看更多
</i18n>

<script>
import { Panel, Group, Radio } from 'vux'

export default {
  components: {
    Panel,
    Group,
    Radio
  },
  methods: {
    onImgError(item, $event) {
      console.log(item, $event)
    }
  },
  data() {
    return {
      type: '4',
      list: [
        {
          src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '',
          desc: '某某拟办了信息：请立刻处理',
          url: {
            path: '/component/radio',
            replace: false
          },
          meta: {
            source: '',
            date: '2017-01-16',
            other: '王惠'
          }
        },
        {
          src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '',
          desc: '某某拟办了信息：请立刻处理',
          url: {
            path: '/component/radio',
            replace: false
          },
          meta: {
            source: '',
            date: '2017-01-16',
            other: '王惠'
          }
        },
        {
          src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '',
          desc: '某某拟办了信息：请立刻处理',
          url: {
            path: '/component/radio',
            replace: false
          },
          meta: {
            source: '',
            date: '2017-01-16',
            other: '王惠'
          }
        }],
      footer: {
        title: '',
        url: 'http://vux.li'
      }
    }
  }
}
</script>
