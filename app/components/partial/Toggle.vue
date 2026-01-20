<script setup lang="ts">
/**
 * 切换开关组件
 *
 * 样式化的开关控件，支持键盘操作（空格/回车切换）
 * 使用 v-model 双向绑定开关状态
 */

defineProps<{
	/** 开关标签文本 */
	label?: string
}>()

const modelValue = defineModel<boolean>()

/** 切换开关状态 */
function toggle() {
	modelValue.value = !modelValue.value
}
</script>

<template>
<label
	class="z-toggle"
	tabindex="0"
	role="switch"
	:aria-checked="modelValue"
	@keypress.space.prevent="toggle"
	@keypress.enter="toggle"
>
	<input v-model="modelValue" name="toggle" type="checkbox" hidden>
	<span class="toggle-slider" />
	<slot><span>{{ label }}</span></slot>
</label>
</template>

<style lang="scss" scoped>
.z-toggle {
	user-select: none;
}

.toggle-slider {
	display: inline-block;
	position: relative;
	width: 2.1em;
	height: 1.2em;
	border: 0.2em solid transparent;
	border-radius: 1em;
	outline: 1px solid var(--c-text-1);
	outline-offset: -1px;
	vertical-align: text-bottom;
	transition: background-color 0.2s, outline-color 0.2s;

	&::after {
		content: "";
		position: absolute;
		height: 100%;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: var(--c-text-1);
		transition: transform 0.2s, background-color 0.2s;
	}

	&:not(:last-child) {
		margin-inline-end: 0.5em;
	}

	input:checked + & {
		outline-color: var(--c-primary);
		background-color: var(--c-primary);

		&::after {
			background-color: var(--c-bg-1);
			transform: var(--transform-end-far);
		}
	}
}
</style>
