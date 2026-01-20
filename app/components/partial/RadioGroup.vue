<script setup lang="ts" generic="T">
/**
 * 单选按钮组组件
 *
 * 从多个选项中选择一个，使用 v-model 双向绑定选中值
 * 支持泛型，可用于 string、number 等任意类型
 */

/**
 * 单选项接口
 */
interface RadioItem {
	/** 显示文本，为空则显示 value */
	label?: string
	/** 选项值 */
	value: T
}

defineProps<{
	/** 选项列表 */
	items: RadioItem[]
}>()

const modelValue = defineModel<T>()
</script>

<template>
<div class="z-radio-group">
	<button
		v-for="{ label, value }, i in items"
		:key="i"
		type="button"
		class="radio-item"
		:class="{ active: value === modelValue }"
		@click="modelValue = value"
	>
		{{ label || value }}
	</button>
</div>
</template>

<style lang="scss" scoped>
.z-radio-group {
	display: flex;
	margin: 1em 0;
}

.radio-item {
	flex-grow: 1;
	position: relative;
	padding: 0.2em;
	border: 1px solid transparent;
	background-color: var(--c-bg-2);
	transition: all 0.2s;

	&:first-child {
		border-start-start-radius: 0.5em;
		border-end-start-radius: 0.5em;
	}

	&:last-child {
		border-start-end-radius: 0.5em;
		border-end-end-radius: 0.5em;
	}

	&:hover {
		background-color: var(--c-bg-1);
		color: var(--c-primary);
	}

	&:focus {
		z-index: 1;
	}

	&.active {
		border-color: var(--c-primary);
		background-color: var(--ld-bg-card);
		color: var(--c-primary);
	}

	&:not(.active) + &:not(.active)::before {
		content: "";
		position: absolute;
		top: 25%;
		bottom: 25%;
		border-inline-start: 1px solid var(--c-bg-soft);
		inset-inline-start: -1px;
	}
}
</style>
