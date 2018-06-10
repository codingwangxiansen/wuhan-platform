<template>
	<div align="left" class="top-nave">
		<!--  home native -->
		<span @click="click_root" class="org-nave">组织机构</span>
		<!--  history native -->
		<span v-for="(one, index) in route.history" >
			<span @click="click_node(one)"  :class="one.name?'org-nave':''">{{one.name}}</span><span class="org-nave-space">></span>
		</span>

		<!-- current panel -->
		<span :class="route.current.name?'org-nave':''">{{route.current.name}}</span>
	</div>
</template>
<style>
	.top-nave{
		padding: 0.5rem 1em;
	}
	.org-nave-space{
		color: #909399;
	}
	.org-nave{
		display:inline-block;
		width:auto;
		color: #fff;
	    background-color: #409eff;
	    margin-top: 0.5rem;
	    padding: 0.2rem;
	    border-radius: 0.4rem;
	}
</style>
<script>

  export default {
    name: 'CheckNative',
    props: ['route'],
    data() {
      return {
      }
    },
    computed: {
    },
    components: {
    },
    mounted() {
    },
    methods: {
      // 根节点点击事件
      click_root() {
        this.$emit('on-root-click')
      },
      // 可导航节点点击时触发
      click_node(one) {
        this.$emit('on-node-click', one)
      }
    }
  }
</script>
