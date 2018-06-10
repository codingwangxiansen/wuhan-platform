<template >
    <div class="weui_cells vux-no-group-title" style="margin-top: 5px;">
      <div class="weui_cell">
        <div class="weui_cell_hd">
          <div class="cellTopPart">{{logo}}</div>
        </div>
        <div class="weui_cell_bd weui_cell_primary titleCell">
          {{title}}
        </div>
      </div>
    </div>
</template>
<style>
  .titleCell{
    white-space: nowrap;
    overflow: hidden;
    line-height: 37px;
    text-overflow: ellipsis;
    font-weight: bold;
  }
</style>
<script>
  export default{
    name: 'TitleCell',
    props: ['title'],
    data() {
      return {
        logo: '置顶'
      }
    },
    created() {
    },
    methods: {
      changeLogo() {
        this.logo = '哈哈'
      }

    },
    filters: {

    }
  }

</script>
