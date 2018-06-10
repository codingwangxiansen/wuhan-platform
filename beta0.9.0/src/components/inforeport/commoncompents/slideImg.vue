<template>
  <div class="swiperContainer">
    <div @click="expandBig" class="attach-img"  v-for="(attach,index) in imgs" :key="index">
      <img-popup :src="getAttachPath(attach.attachPath)"></img-popup>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "../../../styles/common.less";
</style>
<script>
  import { fileserver } from '../../../utils/common'
  import ImgPopup from '../../mycomponents/ImgPopup'

  export default {
    props: ['imgs'],
    name: 'carrousel',
    components: {
      ImgPopup
    },
    data() {
      return {
        fileserver
      }
    },

    computed: {
    },
    methods: {
      expandBig() {
        this.$emit('showFullScreen', this.imgs)
      },
      onSetTranslate() {
      },
      getAttachPath(item) {
        return fileserver + item
      }
    }

  }

</script>
