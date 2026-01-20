/**
 * 搜索功能状态管理 Store
 *
 * 管理站内搜索的状态：
 * - 搜索关键词
 * - 搜索弹窗的打开/关闭
 * - 与布局 Store 联动
 */
import { LazyPopoverSearch } from '#components'

/**
 * 搜索 Store
 *
 * 监听布局 Store 中搜索弹窗的开关状态
 * 自动控制搜索弹窗的显示和隐藏
 *
 * @example
 * ```ts
 * const searchStore = useSearchStore()
 *
 * // 设置搜索词
 * searchStore.word = 'Vue'
 *
 * // 获取防抖后的搜索词（用于触发搜索请求）
 * watch(searchStore.debouncedWord, (word) => {
 *   performSearch(word)
 * })
 * ```
 */
export const useSearchStore = defineStore('search', () => {
	const layoutStore = useLayoutStore()
	const popoverStore = usePopoverStore()

	/** 当前搜索关键词（实时更新） */
	const word = ref('')

	/** 防抖后的搜索关键词（用于触发实际搜索，减少请求频率） */
	const debouncedWord = refDebounced(word)

	// 创建搜索弹窗控制器
	const { open, close } = popoverStore.use(() => h(LazyPopoverSearch))

	// 监听布局 Store 中搜索开关的变化
	watch(() => layoutStore.open.search, (searchOpen) => {
		if (!searchOpen)
			return close()

		// 打开搜索时，如果用户选中了文本，自动填入搜索框
		word.value = window.getSelection()?.toString().trim() || word.value
		open()
	})

	return {
		word,
		debouncedWord,
	}
})
