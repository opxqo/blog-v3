<script setup lang="ts">
/**
 * 通用按钮组件
 *
 * 支持链接和按钮两种形式，可选图标、描述文字和主色调样式
 * 可作为普通按钮使用，也可作为链接按钮使用
 */
import { UtilLink } from '#components'

/**
 * 按钮组件属性
 */
export interface ButtonProps {
	/** 图标名称，使用 Iconify 格式 */
	icon?: string
	/** 按钮文字，与 slot 二选一 */
	text?: string
	/** 链接地址，提供此项则渲染为链接按钮 */
	to?: string
	/** 次要描述文字，显示在按钮下方 */
	desc?: string
	/** 是否使用主色调样式 */
	primary?: boolean
}

defineProps<ButtonProps>()
</script>

<template>
<component :is="to ? UtilLink : 'button'" :to class="button" :class="{ primary }">
	<div class="button-main">
		<Icon v-if="icon" :name="icon" />
		<slot>{{ text }}</slot>
	</div>
	<div v-if="desc" class="button-desc">
		{{ desc }}
	</div>
</component>
</template>

<style lang="scss" scoped>
.button {
	display: inline-block;
	padding: 0.4em 0.6em;
	border: 1px solid var(--c-bg-soft);
	border-radius: 0.5em;
	box-shadow: var(--box-shadow-1);
	background-color: var(--ld-bg-card);
	line-height: 1.2;
	vertical-align: middle;
	transition: color 0.1s, background-color 0.2s;
	cursor: pointer;

	&.primary {
		background-color: var(--c-primary);
		color: var(--c-bg);
	}

	&:hover {
		box-shadow: var(--box-shadow-2);
		background-color: var(--c-bg-2);
		color: var(--c-text);
	}

	&:active {
		background-color: var(--ld-shadow);
	}

	&:disabled {
		background-color: var(--c-bg-1);
		color: var(--c-text-3);
		cursor: not-allowed;
	}

	& + .button {
		margin-inline-start: 0.8em;
	}
}

.button-main {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.2em;
}

.button-desc {
	font-size: 0.75em;
	text-align: center;
	color: var(--c-text-2);
}
</style>
