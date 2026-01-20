<script lang="tsx" setup>
/**
 * 聊天对话组件（MDC 组件）
 *
 * 用于展示聊天记录，支持不同角色的对话样式
 * 语法：{角色名} 对话内容，支持 {我} 和 {:系统} 特殊标记
 */

const slots = defineSlots<{
	default: () => VNode[]
}>()

/** 渲染聊天内容，解析角色标识 */
function render() {
	const slotContent = slots.default()
	if (!slotContent)
		return <span>无会话内容</span>

	return slotContent.map((node: VNode) => {
		// WARN: 此处使用了非标准的 v-slot:default
		const textContent = (node.children as any)?.default?.()[0].children
		const body = <dd class="chat-body">{node}</dd>
		if (typeof textContent !== 'string')
			return body

		// 解析角色标记：{我}、{:系统}、{角色名}
		const match = textContent.match(/^\{(?<control>\.|:)?(?<caption>.*)\}$/)
		if (!match)
			return body

		const { caption, control } = match?.groups || {}
		const controlClass = control === '.' ? 'chat-myself' : control === ':' ? 'chat-system' : ''
		return <dt class={`chat-caption ${controlClass}`}>{caption}</dt>
	})
}
</script>

<template>
<dl class="chat">
	<render />
</dl>
</template>

<style lang="scss" scoped>
.chat {
	margin-inline: 2vw;
	font-size: 0.9em;
}

:deep() {
	.chat-caption {
		opacity: 0.8;
		font-size: 0.9em;
	}

	.chat-body {
		// BFC
		overflow: hidden;
		width: fit-content;
		max-width: 90%;
		margin-bottom: 1em;
		padding: 0 1em;
		border-radius: 1em;
		border-start-start-radius: 0.2em;
		background-color: var(--c-bg-2);
	}

	.chat-system {
		margin-bottom: 1em;
		text-align: center;
	}

	.chat-myself {
		text-align: end;

		& + .chat-body {
			margin-inline-start: auto;
			border-radius: 1em;
			border-start-end-radius: 0.2em;
			background-color: var(--c-primary-soft);
		}
	}
}
</style>
