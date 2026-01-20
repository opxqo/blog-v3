<script setup lang="ts">
/**
 * 可编辑代码块组件（MDC 组件）
 *
 * 支持代码高亮、复制、撤销编辑等功能
 * 使用 contenteditable 让用户可以编辑代码
 */
import { createPlainShiki } from 'plain-shiki'

const props = withDefaults(defineProps<{
	/** 命令行提示符，如 '$'、'#'、'PS' */
	prompt?: string | boolean
	/** 代码内容 */
	code?: string
	/** 代码语言 */
	lang?: string
}>(), {
	prompt: '$',
})

/** 是否显示提示符（prompt 传入空字符串会变成 true） */
const showPrompt = computed(() => props.prompt !== true)
/** 根据提示符自动识别语言 */
const language = computed(() => props.lang ?? getPromptLanguage(props.prompt))

const showUndo = ref(false)
const codeInput = useTemplateRef('code-input')
const shikiStore = useShikiStore()

const { copy, copied } = useCopy(codeInput)

/** 撤销编辑，恢复到原始代码 */
function undo() {
	if (!codeInput.value)
		return
	codeInput.value.textContent = props.code ?? ''
	// 触发 shiki 高亮
	codeInput.value.dispatchEvent(new Event('input'))
	showUndo.value = false
}

/** 阻止换行，保持单行代码 */
function prevenLineBreak(event: InputEvent) {
	const { data, inputType } = event
	if (data?.includes('\n') || inputType === 'insertLineBreak') {
		event.preventDefault()
	}
}

/** 检查内容是否被修改，显示撤销按钮 */
function checkUndoable(event: InputEvent) {
	showUndo.value = props.code !== (event.target as Element).textContent
}

onMounted(async () => {
	const shiki = await shikiStore.load()
	await shikiStore.loadLang(language.value)

	createPlainShiki(shiki).mount(
		codeInput.value!,
		shikiStore.getOptions(language.value),
	)
})
</script>

<template>
<code class="copy">
	<span v-if="showPrompt" class="prompt">{{ prompt }}</span>

	<div
		ref="code-input"
		contenteditable="plaintext-only"
		class="code scrollcheck-x"
		spellcheck="false"
		@beforeinput="prevenLineBreak"
		@input="checkUndoable"
		v-text="code"
	/>

	<button v-if="showUndo" class="operation" aria-label="恢复原始内容" @click="undo">
		<Icon name="ph:arrow-u-up-left-bold" />
	</button>

	<button class="operation" aria-label="复制" @click="copy()">
		<Icon :name="copied ? 'ph:check-bold' : 'ph:copy-bold'" />
	</button>
</code>
</template>

<style lang="scss" scoped>
.copy {
	contain: paint;
	display: flex;
	margin: 0.5rem 0;
	border: 1px solid var(--c-border);
	border-radius: 4px;
	background-color: var(--ld-bg-card);
	font-size: 0.8rem;
	line-height: 2.5;
	transition: border-color 0.2s;

	&:focus-within {
		border-color: var(--c-primary);
		outline: 0.2em solid var(--c-primary-soft);

		.prompt {
			border-inline-end-color: var(--c-primary);
			background-color: var(--c-primary-soft);
			color: var(--c-primary);
		}
	}

	.prompt {
		flex-shrink: 0;
		padding: 0 1em;
		border-inline-end: 1px solid var(--c-border);
		background-color: var(--c-bg-2);
		color: var(--c-text-2);
		transition: all 0.2s;
	}

	.code {
		--fadeout-width: 3ch;
		--scrollbar-height: 4px;

		flex-grow: 1;
		overflow: auto;
		padding: 0 1em;
		outline: none;
		white-space: nowrap;
		scrollbar-color: auto;
		scrollbar-width: auto;

		&::-webkit-scrollbar {
			height: 4px;
			background-color: transparent;
		}
	}

	.operation {
		flex-shrink: 0;
		height: 2.5em;
		margin-inline-start: -0.5em;
		padding: 0.5em;
		color: var(--c-text-2);
		transition: color, 0.2s;

		&:hover {
			color: var(--c-primary);
		}
	}
}
</style>
