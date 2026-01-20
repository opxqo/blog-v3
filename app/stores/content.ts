/**
 * 文章内容状态管理 Store
 *
 * 管理当前浏览文章的元数据：
 * - 目录（Table of Contents）
 * - 文章元信息（frontmatter 中的 meta 字段）
 *
 * 这些数据在文章页面加载时设置，离开时清除
 */
import type { Toc } from '@nuxt/content'

/**
 * 文章内容 Store
 *
 * 用于在文章页面和其他组件之间共享文章数据
 * 如：目录组件需要读取当前文章的 toc
 *
 * @example
 * ```ts
 * // 在文章页面设置数据
 * const store = useContentStore()
 * store.toc = article.toc
 * store.meta = article.meta
 *
 * // 在目录组件中读取
 * const store = useContentStore()
 * const { activeHeadingId } = useToc(() => store.toc)
 * ```
 */
export const useContentStore = defineStore('content', () => {
	const router = useRouter()

	/** 当前文章的目录结构 */
	const toc = ref<Toc>()

	/**
	 * 当前文章的元信息
	 * 包含 frontmatter 中定义的 meta 字段，如自定义样式、插槽内容等
	 */
	const meta = ref()

	// 离开文章页面 ([...slug].vue) 时清除数据
	// 通过检测路由名称变化来判断是否离开文章页
	router.beforeEach((to, from) => {
		if (to.name !== from.name) {
			toc.value = undefined
			meta.value = undefined
		}
	})

	return {
		toc,
		meta,
	}
})
