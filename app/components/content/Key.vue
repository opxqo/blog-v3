<script setup lang="ts">
/**
 * 键盘按键组件（MDC 组件）
 *
 * 显示键盘按键，支持：
 * - 自动识别 macOS/Windows 平台
 * - 图标/文字模式切换
 * - 快捷键组合显示（Ctrl+C 等）
 * - 按键事件监听
 */
import { useEventListener } from '@vueuse/core'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
	/** 自定义显示文本 */
	text?: string
	/** 按键代码，见 KeyboardEvent.key */
	code?: string
	/** 是否使用图标样式（macOS 默认） */
	icon?: boolean
	/** 是否需要 Ctrl 键 */
	ctrl?: boolean
	/** 是否需要 Shift 键 */
	shift?: boolean
	/** 是否需要 Alt 键 */
	alt?: boolean
	/** 是否需要 Meta 键 */
	meta?: boolean
	/** 是否需要 Win 键 */
	win?: boolean
	/** 智能适配：Windows 用 Ctrl，macOS 用 Cmd */
	cmd?: boolean
	/** 是否阻止默认行为 */
	prevent?: boolean
}>(), {
	icon: undefined,
})

const emit = defineEmits<{
	press: []
}>()

const isMac = computed(() => /mac ?os/i.test(navigator?.userAgent))
const useSymbol = computed(() => isMac.value ? props.icon !== false : props.icon)
const keyJoiner = computed(() => useSymbol.value ? '' : '+')

/** 普通显示文本映射（Windows 风格） */
const displayMap = {
	' ': 'Space',
	'ArrowDown': '↓',
	'ArrowLeft': '←',
	'ArrowRight': '→',
	'ArrowUp': '↑',
	'Control': 'Ctrl',
	'Delete': 'Del',
	'Escape': 'Esc',
	'Meta': isMac.value ? 'Cmd' : 'Win',
}

/** 符号显示映射（macOS 风格） */
const symbolMap = {
	' ': '␣',
	'Alt': '⌥',
	'Backspace': '⌫',
	'Control': '⌃',
	'Delete': '⌦',
	'Enter': '↵',
	'Escape': '⎋',
	'Meta': isMac.value ? '⌘' : '田',
	'Shift': '⇧',
	'Tab': '⇥',
	'Win': '田',
}

/** 根据平台和配置规范化按键显示文本 */
function normalizeCodeDisplay(code?: string) {
	if (!code)
		return ''
	if (useSymbol.value && code in symbolMap)
		return symbolMap[code as keyof typeof symbolMap]
	if (code in displayMap)
		return displayMap[code as keyof typeof displayMap]
	return code
}

/** 计算按键组合的显示文本 */
const codeDisplay = computed(() => {
	if (props.text)
		return props.text

	const keyConfigs = [
		{ condition: props.cmd, code: isMac.value ? 'Meta' : 'Control' },
		{ condition: props.ctrl && !props.cmd, code: 'Control' },
		{ condition: props.shift, code: 'Shift' },
		{ condition: props.alt, code: 'Alt' },
		{ condition: props.meta && !props.cmd, code: 'Meta' },
		{ condition: props.win && !props.meta, code: 'Win' },
		{ condition: props.code, code: props.code },
	]

	return keyConfigs
		.filter(config => config.condition)
		.map(config => normalizeCodeDisplay(config.code))
		.join(keyJoiner.value)
})

const active = ref(false)

/** 当前全局修饰键状态 */
const modifierState = ref({
	ctrl: false,
	shift: false,
	alt: false,
	meta: false,
})

/** 更新修饰键状态 */
function updateModifierState(e: KeyboardEvent, isDown: boolean) {
	if (e.key === 'Control')
		modifierState.value.ctrl = isDown
	if (e.key === 'Shift')
		modifierState.value.shift = isDown
	if (e.key === 'Alt')
		modifierState.value.alt = isDown
	if (e.key === 'Meta')
		modifierState.value.meta = isDown
}

/** 检查当前修饰键状态是否匹配 props */
function modifiersMatch() {
	const cmdMatch = props.cmd
		? (isMac.value ? modifierState.value.meta : modifierState.value.ctrl)
		: true

	return cmdMatch
		&& (!props.ctrl || (!props.cmd && modifierState.value.ctrl))
		&& (!props.shift || modifierState.value.shift)
		&& (!props.alt || modifierState.value.alt)
		&& (!props.meta || (!props.cmd && modifierState.value.meta))
}

/** 检查按键事件是否匹配配置 */
function matchKeyEvent(e: KeyboardEvent, expectedCode?: string) {
	if (expectedCode && e.key?.toLowerCase() !== expectedCode.toLowerCase())
		return false
	return modifiersMatch()
}

useEventListener('keydown', (e) => {
	updateModifierState(e, true)
	if (matchKeyEvent(e, props.code)) {
		emit('press')
		active.value = true
		props.prevent && e.preventDefault()
	}
})

useEventListener('keyup', (e) => {
	updateModifierState(e, false)
	if (matchKeyEvent(e, props.code) || !modifiersMatch())
		active.value = false
})

useEventListener('blur', () => {
	modifierState.value = { ctrl: false, shift: false, alt: false, meta: false }
	active.value = false
})
</script>

<template>
<UtilHydrateSafe>
	<kbd :class="{ active }" @click.stop="emit('press')">
		<slot>{{ codeDisplay }}</slot>
	</kbd>
</UtilHydrateSafe>
</template>

<style lang="scss" scoped>
kbd {
	display: inline-block;
	margin: 0.1em;
	padding: 0 0.2em 0.1em;
	border-radius: 0.2em;
	box-shadow: inset 0 -0.15em 0 var(--c-bg-soft);
	background-color: var(--c-bg-soft);
	font-family: var(--font-monospace);
	font-size: 0.9em;
	letter-spacing: -0.05em;
	line-height: 1.4;
	color: var(--c-text-2);
	transition: all 0.1s;
	user-select: none;

	&:active, &.active {
		box-shadow: inset 0 -0.1em 0 var(--c-primary);
		background-color: var(--c-primary-soft);
		color: var(--c-primary);
		transform: translateY(0.05em);
	}
}
</style>
