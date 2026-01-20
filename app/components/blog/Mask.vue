<script setup lang="ts">
/**
 * 背景遮罩组件
 *
 * 点击遮罩可关闭弹出的侧边栏/弹窗
 * 支持模糊效果
 */
import type { CSSProperties } from 'vue'

const props = defineProps<{
	/** 是否模糊及模糊度 */
	blur?: boolean | string
	/** z-index 层级 */
	zIndex?: number
}>()

const show = defineModel<boolean>('show')
const style = computed<CSSProperties>(() => ({
	'--z-index-popover': props.zIndex,
	'--bdfilter': props.blur ? `blur(${props.blur === true ? '4px' : props.blur})` : 'none',
}))
</script>

<template>
<Transition>
	<div
		v-if="show"
		class="bg-mask"
		:style
		@click="show = false"
	/>
</Transition>
</template>

<style lang="scss" scoped>
.bg-mask {
	position: fixed;
	inset: 0;
	background-color: #0003;
	backdrop-filter: var(--bdfilter);
	z-index: var(--z-index-popover);
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.v-enter-active,
.v-leave-active {
	transition: all var(--delay);
}
</style>
