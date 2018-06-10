
<template>
  <div>
    <div v-show="expandFlag" @click="imgBack" class="img-expand">
      <div class="fade-back">
      </div>
      <div ref="bigImgContent" class="img-content" :class="{'over-height':isOverHeight}"><img :src="src"></div>
    </div>
    <div class="detail-img" v-show="src" @click="imgExpand">
      <img :src="src">
    </div>
  </div>
</template>
<style scoped>
  .img-content{
    position: absolute;
    z-index: 1000;
    width: 90%;
    /*top: 50%;*/
    left: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
  }

  .img-content.over-height{
    /*top: 0;*/
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  .img-content img{
    width: 100%;
  }

  .fade-back{
    position: fixed;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #222222;
    opacity: 0.9;
  }

  .detail-img {
    width: 125px;
    height: 125px;

  }

</style>
<script>
  import Vue from 'vue'
  import VueResource from 'vue-resource'

  Vue.use(VueResource)

  export default{
    props: {
      src: {
        type: String,
        default() {
          return ''
        }
      }
    },
    data() {
      return {
        expandFlag: false,
        isOverHeight: true
      }
    },
    components: {
    },
    created() {
    },
    mounted() {
//      if(this.$refs.bigImgContent.clientHeight>document.body.clientHeight){
//          this.isOverHeight = true;
//      }
    },
    methods: {
      imgExpand() {
//        this.expandFlag = true;
//        console.log(this.$refs.bigImgContent.baseURI);
//        if(this.$refs.bigImgContent.clientHeight>document.body.clientHeight){
//          this.isOverHeight = true;
//        }
      },
      imgBack() {
        this.expandFlag = false
      }
    }

  }
</script>
