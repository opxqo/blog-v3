/**
 * 剪贴板复制组合式函数
 *
 * 基于 VueUse 的 useClipboard，提供更灵活的复制目标支持
 */

/**
 * 点击触发元素时，将文本复制到剪贴板，并在触发元素上显示提示信息
 *
 * 支持多种复制来源：
 * - 直接传入字符串
 * - 传入 input 元素（复制其 value）
 * - 传入其他 HTML 元素（复制其 textContent）
 * - 传入 Vue 组件实例（复制其 $el 的文本内容）
 *
 * @param target - 复制来源，可以是字符串、DOM 元素、Vue 组件实例或它们的响应式引用
 * @returns VueUse useClipboard 返回值，包含 copy、copied、isSupported 等
 *
 * @example
 * ```ts
 * // 复制固定文本
 * const { copy, copied } = useCopy('Hello World')
 *
 * // 复制输入框内容
 * const inputRef = ref<HTMLInputElement>()
 * const { copy } = useCopy(inputRef)
 *
 * // 复制组件内的文本
 * const codeBlockRef = ref<InstanceType<typeof CodeBlock>>()
 * const { copy } = useCopy(codeBlockRef)
 * ```
 */
export default function useCopy(
	target: MaybeRefOrGetter<{ $el: Element } | HTMLInputElement | Element | null> | string,
) {
	/**
	 * 获取实际的 DOM 元素
	 * 如果是 Vue 组件实例则返回其 $el，否则直接返回元素本身
	 */
	const getEl = (element: any) => element?.$el ?? element

	/**
	 * 获取要复制的文本内容
	 * 根据 target 类型智能获取：字符串直接返回，input 取 value，其他取 textContent
	 */
	const getText = () => {
		const el = getEl(toValue(target))

		if (typeof target === 'string')
			return target
		if (el instanceof HTMLInputElement)
			return el.value
		return el?.textContent as string || ''
	}

	// legacy: true 启用降级兼容模式，在不支持 Clipboard API 的环境下使用 execCommand
	return useClipboard({ source: getText, legacy: true })
}
