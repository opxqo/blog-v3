/**
 * 分页组合式函数
 *
 * 提供通用的分页逻辑，支持 URL 查询参数同步
 */

/**
 * 分页配置选项
 */
interface UsePaginationOptions {
	/** 初始页码，默认 1 */
	initialPage?: number
	/** 每页数量，默认取 appConfig.pagination.perPage */
	perPage?: number
	/** 绑定到 URL 查询参数的键名，如 'page' */
	bindQuery?: string
}

/**
 * 通用分页组合式函数
 *
 * 自动计算总页数、当前页数据，支持与 URL 查询参数双向绑定
 *
 * @param list - 完整数据列表（响应式）
 * @param options - 分页配置选项
 * @returns 分页相关的响应式状态
 *
 * @example
 * ```ts
 * const { page, totalPages, listPaged } = usePagination(articleList, {
 *   perPage: 10,
 *   bindQuery: 'page'
 * })
 *
 * // page.value = 2 会同步到 URL: ?page=2
 * // listPaged 自动返回第 2 页的 10 条数据
 * ```
 */
export default function usePagination<T>(list: MaybeRefOrGetter<T[]>, options?: UsePaginationOptions) {
	const appConfig = useAppConfig()
	const {
		initialPage = 1,
		perPage = appConfig.pagination.perPage || 10,
		bindQuery,
	} = options || {}

	/** 总页数，至少为 1 */
	const totalPages = computed(() => Math.ceil(toValue(list).length / perPage) || initialPage)

	/**
	 * 页码转换函数：将 URL 查询参数转为有效页码
	 * 确保页码在有效范围内（1 ~ totalPages）
	 */
	function transformPage(val: string) {
		const page = Number(val)
		return page >= 1 && page <= totalPages.value ? page : initialPage
	}

	/**
	 * 路由模式：首次从无参数到有参数时使用 push（保留历史），之后使用 replace（不产生历史）
	 * 这样用户首次翻页时可以通过返回键回到无分页状态
	 */
	const mode = computed({
		get: () => bindQuery && useRoute().query[bindQuery] ? 'replace' : 'push',
		set() { },
	})

	/** 当前页码 */
	const page = bindQuery
		? useRouteQuery(bindQuery, initialPage.toString(), { transform: transformPage, mode })
		: ref(initialPage)

	/** 当前页的数据切片 */
	const listPaged = computed(() => {
		const start = (page.value - 1) * perPage
		return toValue(list).slice(start, start + perPage)
	})

	// 注意：不应在此处 watch list 变化自动重置页码，这应由调用方控制

	return {
		totalPages,
		page,
		listPaged,
	}
}

/**
 * 生成分页器显示数组
 *
 * 根据当前页码和总页数，生成智能的分页器数组：
 * - 始终显示首页和末页
 * - 当前页周围显示 expand 个页码
 * - 中间省略的部分用特殊值表示
 *
 * @param current - 当前页码
 * @param total - 总页数
 * @param expand - 当前页码两侧扩展的页数，默认 1
 * @returns 分页器数组，其中：
 *   - `Number.NEGATIVE_INFINITY` 表示向前省略（...）
 *   - `Number.POSITIVE_INFINITY` 表示向后省略（...）
 *
 * @example
 * ```ts
 * // 总 10 页，当前第 5 页，扩展 1 页
 * genPageArr(5, 10, 1)
 * // 返回: [1, -Infinity, 4, 5, 6, Infinity, 10]
 * // 渲染为: 1 ... 4 5 6 ... 10
 *
 * // 总 5 页，当前第 1 页
 * genPageArr(1, 5, 1)
 * // 返回: [1, 2, 3, Infinity, 5]
 * // 渲染为: 1 2 3 ... 5
 * ```
 */
export function genPageArr(current: number, total: number, expand: number = 1) {
	// 计算中间页码的起止范围
	const start = Math.max(2, Math.min(current - expand, total - 2 * expand))
	const end = Math.min(total, start + 2 * expand)

	// 生成中间页码数组
	const pageArr = Array.from({ length: end - start + 1 }, (_, i) => start + i)

	// 处理开头：根据间隔决定是显示省略号还是具体页码
	start > 3 && pageArr.unshift(Number.NEGATIVE_INFINITY)  // 显示 ...
	start === 3 && pageArr.unshift(2)                        // 显示具体页码 2
	start > 1 && pageArr.unshift(1)                          // 始终显示首页

	// 处理结尾：同理
	end < total - 2 && pageArr.push(Number.POSITIVE_INFINITY) // 显示 ...
	end === total - 2 && pageArr.push(total - 1)              // 显示具体页码
	end < total && pageArr.push(total)                        // 始终显示末页

	return pageArr
}
