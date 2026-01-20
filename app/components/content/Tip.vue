<script setup lang="ts">
/**
 * 提示文本组件（MDC 组件）
 *
 * 带有提示 Tooltip 的文本，支持复制功能
 */
import type { TippyOptions } from 'vue-tippy'

const props = withDefaults(defineProps<{
	/** 提示文本内容 */
	text?: string
	/** Tooltip 内容 */
	tip?: string
	/** 是否显示图标，或自定义图标 */
	icon?: string | boolean
	/** 是否可复制 */
	copy?: boolean
	/** Tippy 配置选项 */
	tipOptions?: TippyOptions
}>(), {
	icon: undefined,
})

const tip = computed(() => ({
	content: props.tip || (props.copy ? '点击复制' : ''),
	inlinePositioning: true,
	...props.tipOptions,
}))
const tipSource = useTemplateRef('tip-text')

const { copy, copied } = useCopy(tipSource)
const icon = computed(() => props.icon ?? (copied.value ? 'ph:check-bold' : props.copy && 'ph:copy-bold'))
</script>

<template>
<span
	ref="tip-text"
	v-tip="tip"
	class="tip"
	tabindex="0"
	@keypress.enter="props.copy && copy()"
	@click="props.copy && copy()"
>
	<slot>{{ text }}</slot>
	<Icon v-if="typeof icon === 'string'" :name="icon" class="tip-icon" />
</span>
</template>

<style lang="scss" scoped>
.tip {
	position: relative;
	text-decoration: underline dashed var(--c-text-3);
	cursor: pointer;
	text-underline-offset: 4px;
}

.tip-icon {
	display: inline-block;
	font-size: 1em;
	vertical-align: top;
}
</style>
