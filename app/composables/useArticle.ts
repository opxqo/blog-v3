/**
 * 文章相关的组合式函数
 *
 * 提供文章列表查询、分类筛选、排序等功能
 */
import type { ArticleOrderType, ArticleProps } from '~/types/article'
import { alphabetical } from 'radash'

/**
 * 生成文章查询参数，完全包装 useAsyncData 会使 SSR 行为异常，缓存 key 需要暴露
 *
 * 用于获取文章索引列表，包含标题、日期、描述等基本信息（不含正文内容）
 *
 * @param path - 文章路径匹配模式，默认为 'posts/%' 匹配所有已发布文章
 * @returns Nuxt Content 查询 Promise，返回文章基本信息数组
 *
 * @example
 * ```ts
 * // 获取所有已发布文章
 * const { data } = await useAsyncData('posts', () => useArticleIndexOptions())
 *
 * // 获取预览文章
 * const { data } = await useAsyncData('previews', () => useArticleIndexOptions('previews/%'))
 * ```
 *
 * @see https://nuxt.com/docs/4.x/api/composables/use-async-data#usage
 * @see https://github.com/nuxt/nuxt/issues/14736
 * @todo 支持分页/分类筛选
 */
export function useArticleIndexOptions(path = 'posts/%') {
	return queryCollection('content')
		.where('stem', 'LIKE', path)
		.select('categories', 'date', 'description', 'image', 'path', 'readingTime', 'recommend', 'title', 'type', 'updated')
		.all()
}

/**
 * 分类筛选配置选项
 */
interface UseCategoryOptions {
	/** 绑定到 URL 查询参数的键名，如 'category'，为空则不与 URL 同步 */
	bindQuery?: string
}

/**
 * 文章分类筛选组合式函数
 *
 * 根据文章的第一个分类进行筛选，支持与 URL 查询参数双向绑定
 *
 * @param list - 文章列表（响应式）
 * @param options - 配置选项
 * @returns 分类相关的响应式状态
 *
 * @example
 * ```ts
 * const { category, categories, listCategorized } = useCategory(articleList, { bindQuery: 'category' })
 *
 * // category.value = '技术' 会同步到 URL: ?category=技术
 * // 同时 listCategorized 会自动过滤出该分类的文章
 * ```
 */
export function useCategory(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseCategoryOptions) {
	const { bindQuery } = options || {}

	/** 当前选中的分类，undefined 表示显示全部 */
	const category = bindQuery
		? useRouteQuery(bindQuery, undefined)
		: ref<string | undefined>()

	/** 所有不重复的分类列表（取每篇文章的第一个分类） */
	const categories = computed(() => [...new Set(toValue(list).map(item => item.categories?.[0]))])

	/** 按当前分类筛选后的文章列表 */
	const listCategorized = computed(
		() => toValue(list).filter(
			item => !category.value || item.categories?.[0] === category.value,
		),
	)

	return {
		category,
		categories,
		listCategorized,
	}
}

/**
 * 文章排序配置选项
 */
interface UseArticleSortOptions {
	/** 排序方向绑定的 URL 查询参数键名 */
	bindDirectionQuery?: string
	/** 排序字段绑定的 URL 查询参数键名 */
	bindOrderQuery?: string
	/** 初始是否升序，默认 false（降序，最新在前） */
	initialAscend?: boolean
	/** 初始排序字段，默认取 appConfig.pagination.sortOrder */
	initialOrder?: ArticleOrderType
}

/**
 * 文章排序组合式函数
 *
 * 支持按日期、更新时间等字段排序，可与 URL 查询参数双向绑定
 *
 * @param list - 文章列表（响应式）
 * @param options - 配置选项
 * @returns 排序相关的响应式状态
 *
 * @example
 * ```ts
 * const { sortOrder, isAscending, listSorted } = useArticleSort(articleList, {
 *   bindOrderQuery: 'sort',
 *   bindDirectionQuery: 'asc'
 * })
 *
 * // 切换排序方式
 * sortOrder.value = 'updated'  // URL 变为 ?sort=updated
 * isAscending.value = true     // URL 变为 ?sort=updated&asc=true
 * ```
 */
export function useArticleSort(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseArticleSortOptions) {
	const appConfig = useAppConfig()
	const {
		bindDirectionQuery,
		bindOrderQuery,
		initialAscend = false,
		initialOrder = appConfig.pagination.sortOrder || 'date',
	} = options || {}

	/** 当前排序字段 */
	const sortOrder = bindOrderQuery
		? useRouteQuery(bindOrderQuery, initialOrder)
		: ref<ArticleOrderType>(initialOrder)

	/** URL 查询参数布尔值转换器 */
	const booleanQueryTransformer = {
		get: (val: string) => val === 'true',
		set: (val: boolean) => val.toString(),
	}

	/** 是否升序排列 */
	const isAscending = bindDirectionQuery
		? useRouteQuery(bindDirectionQuery, initialAscend.toString(), { transform: booleanQueryTransformer })
		: ref<boolean>(initialAscend)

	/** 排序后的文章列表 */
	const listSorted = computed(() => alphabetical(
		toValue(list),
		item => item[sortOrder.value] || '',
		isAscending.value ? 'asc' : 'desc',
	))

	return {
		sortOrder,
		isAscending,
		listSorted,
	}
}

/**
 * 获取分类对应的图标名称
 *
 * @param category - 分类名称
 * @returns 图标名称，未配置则返回默认文件夹图标
 *
 * @example
 * ```ts
 * getCategoryIcon('技术')  // 返回 'ph:code-bold' 或配置的图标
 * getCategoryIcon('未知')  // 返回 'ph:folder-bold'
 * ```
 */
export function getCategoryIcon(category?: string) {
	const appConfig = useAppConfig()
	return appConfig.article.categories[category!]?.icon ?? 'ph:folder-bold'
}

/**
 * 文章类型样式类名配置
 */
interface GetPostTypeClassNameOptions {
	/** CSS 类名前缀，默认 'text' */
	prefix?: string
}

/**
 * 根据文章类型生成 CSS 类名
 *
 * 用于为不同类型的文章（如技术文、故事文）应用不同的排版样式
 *
 * @param type - 文章类型，默认 'tech'
 * @param options - 配置选项
 * @returns CSS 类名，如 'text-tech', 'text-story'
 *
 * @example
 * ```ts
 * getPostTypeClassName('story')           // 'text-story'
 * getPostTypeClassName('tech', { prefix: 'article' })  // 'article-tech'
 * ```
 */
export function getPostTypeClassName(type = 'tech', options?: GetPostTypeClassNameOptions) {
	const { prefix = 'text' } = options || {}
	return `${prefix}-${type}`
}
