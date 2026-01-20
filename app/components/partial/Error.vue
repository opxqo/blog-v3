<script setup lang="ts">
/**
 * 错误展示组件
 *
 * 用于展示错误信息，支持图标、标题、代码块等多种形式
 * 适用于 404 页面、错误提示等场景
 */
import type { BundledLanguage } from 'shiki'

withDefaults(defineProps<{
	/** 错误图标 */
	icon?: string
	/** 错误标题，支持 HTML */
	title?: string
	/** 错误消息，显示在代码块上方 */
	message?: string
	/** 错误代码，会使用 Shiki 高亮显示 */
	code?: string
	/** 代码块语言 */
	language?: BundledLanguage
}>(), {
	icon: 'solar:siren-rounded-bold-duotone',
	language: 'log',
})
</script>

<template>
<div class="error proper-height">
	<div />
	<Icon class="error-icon" :name="icon" />
	<div class="error-title" v-html="title" />

	<ProsePre
		v-if="code"
		:filename="message"
		:language
		:code
		meta="wrap"
	/>

	<slot />
</div>
</template>

<style lang="scss" scoped>
.error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;

	> .error-icon {
		font-size: 5rem;
		color: var(--c-text-3);
	}

	> .error-title {
		font-size: 1.5rem;
		word-break: break-all;
		color: var(--c-text-3);

		> :deep(pre) {
			font-size: 1rem;
			white-space: pre-wrap;
		}
	}

	> .z-codeblock {
		max-width: 100%;

		:deep(.shiki) {
			background-color: transparent !important; /* stylelint-disable-line declaration-no-important */
		}
	}
}
</style>
