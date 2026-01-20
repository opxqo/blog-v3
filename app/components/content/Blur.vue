<script setup lang="ts">
/**
 * 模糊文字组件（MDC 组件）
 *
 * 默认模糊显示，鼠标悬停时显示完整内容
 * 用于隐藏剧透、敏感信息等场景
 */
defineProps<{
	/** 要模糊的文字 */
	text?: string
}>()
</script>

<template>
<span class="blur">
	<slot>{{ text }}</slot>
</span>
</template>

<style lang="scss" scoped>
.blur {
	transition: filter 0.2s;
	filter: blur(4px);

	&:hover {
		filter: blur(0);
	}
}
</style>
