<script setup lang="ts">
/**
 * 弹窗容器组件
 *
 * 管理全局弹窗的渲染（搜索、lightbox 等）
 */
const popoverStore = usePopoverStore()
const { pops } = storeToRefs(popoverStore)
</script>

<template>
<template v-for="{ vnode, zIndex, show, duration } in pops" :key="zIndex">
	<component :is="vnode" :show :duration :style="{ zIndex }" />
</template>
</template>
