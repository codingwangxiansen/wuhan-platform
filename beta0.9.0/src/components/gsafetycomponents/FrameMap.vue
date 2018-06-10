<!--
	地图iframe
-->
<template>
  <div class="map-content" :class="{'spread':colsapaned}">
    <iframe id="mapFrame" :src="mapUrl"></iframe>
  </div>
</template>
<style>
  .map-content {
    height: 15em;
    transition: .5s;
    width: 100%;
  }

  .map-content iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
<script>
import Vue from 'vue'
import { messageController } from '../../utils/common'

export default{
  name: 'FrameMap',
  props: {
    isSpread: {
      type: Boolean,
      default: false
    },
    hasSpread: { // 是否可以展开地图
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mapUrl: ''
    }
  },
  computed: {
    colsapaned() {
      return this.isSpread
    }
  },
  created() {
  },
  mounted() {
    // console.log('frame')
    Vue.prototype.msgObj = messageController('mapFrame')
    this.msgObj.receiveMessage('noSelected', this.spreadFrame)
    this.mapUrl = `${location.origin}/geminigis/map.html`
  },
  methods: {
    spreadFrame() {
      if (this.hasSpread) {
          //  this.isSpread=true
        this.$emit('on-click')
      }
    }
  }
}
</script>
