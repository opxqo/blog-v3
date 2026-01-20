<script setup lang="ts">
/**
 * 提示框组件（MDC 组件）
 *
 * 用于显示提示、警告、错误等信息
 * 支持多种预设类型和自定义样式
 */

const props = withDefaults(defineProps<{
	/** 提示框类型：tip / info / question / warning / error */
	type?: keyof typeof typeMap
	/** 是否使用卡片样式 */
	card?: boolean
	/** 是否使用扁平样式 */
	flat?: boolean
	/** 自定义图标 */
	icon?: string
	/** 自定义颜色 */
	color?: string
	/** 自定义标题 */
	title?: string
	/** 提示内容，与 slot 二选一 */
	text?: string
}>(), {
	type: 'tip',
})

const appConfig = useAppConfig()
/** 是否使用卡片样式（根据配置和 props 计算） */
const card = computed(() => appConfig.component.alert.defaultStyle === 'flat' ? props.card : !props.flat)

/** 各类型预设的图标、颜色、标题配置 */
const typeMap = {
	tip: {
		icon: 'ph:notepad-bold',
		color: '#3A7',
		title: '提醒',
	},
	info: {
		icon: 'ph:info-bold',
		// 使用 currentColor 会导致 --c-primary-soft 颜色混合错误
		color: 'var(--c-text-1)',
		title: '信息',
	},
	question: {
		icon: 'ph:question-bold',
		color: '#3AF',
		title: '问题',
	},
	warning: {
		icon: 'ph:warning-bold',
		color: '#F80',
		title: '警告',
	},
	error: {
		icon: 'ph:x-circle-bold',
		color: '#F33',
		title: '错误',
	},
}

const icon = computed(() => props.icon || typeMap[props.type].icon)
const color = computed(() => props.color || typeMap[props.type].color)
const title = computed(() => props.title || typeMap[props.type].title)
</script>

<template>
<div class="alert" :class="{ card }" :style="{ '--c-primary': color }">
	<div class="alert-title">
		<Icon :name="icon" />
		<slot name="title">
			{{ title }}
		</slot>
	</div>
	<slot><p>{{ text }}</p></slot>
</div>
</template>

<style lang="scss" scoped>
.alert {
	margin: 1em 0;
	padding: 0.2em 0.8em;
	border-radius: 0.5em;
	background-color: var(--c-bg-2);
	font-size: 0.9em;

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		--c-primary-soft: color-mix(in srgb, var(--c-primary) 15%, transparent);
		--c-bg-2: color-mix(in srgb, var(--c-primary) 8%, var(--ld-bg-card));
	}

	&.card {
		background-color: var(--ld-bg-card);
		background-image:
			radial-gradient(circle at 4em -25em, var(--c-primary), transparent 30em),
			linear-gradient(var(--c-primary) -2000%, transparent);
	}

	.alert-title {
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin: 0.5em 0;
		font-weight: bold;
		color: var(--c-primary);

		:deep(p) {
			margin: 0;
		}
	}
}
</style>
