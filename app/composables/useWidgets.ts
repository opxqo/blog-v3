/**
 * 侧边栏小组件管理组合式函数
 *
 * 动态渲染侧边栏组件，支持预定义组件和文章元数据中自定义的组件
 */
import {
	ContentRenderer,
	LazyBlogWidget,
	LazyWidgetBlogLog,
	LazyWidgetBlogStats,
	LazyWidgetBlogTech,
	LazyWidgetCommGroup,
	LazyWidgetEmpty,
	LazyWidgetToc,
} from '#components'
import { pascal } from 'radash'

/**
 * 预定义的侧边栏组件映射
 * 使用 Lazy 前缀实现按需加载，优化首屏性能
 * @keep-sorted 保持按字母排序
 */
const rawWidgets = {
	LazyWidgetBlogLog,
	LazyWidgetBlogStats,
	LazyWidgetBlogTech,
	LazyWidgetCommGroup,
	LazyWidgetEmpty,
	LazyWidgetToc,
}

/** 原始组件名称类型 */
type RawWidgetName = keyof typeof rawWidgets

/**
 * 类型工具：将 PascalCase 转为 kebab-case
 * 例如：LazyWidgetBlogStats -> -lazy-widget-blog-stats
 */
type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
	? `${First extends Capitalize<First> ? '-' : ''}${Lowercase<First>}${KebabCase<Rest>}`
	: ''

/** 类型工具：移除字符串前缀 */
type RemovePrefix<S extends string, Prefix extends string> = S extends `${Prefix}${infer Rest}` ? Rest : S

/**
 * 公开的组件名称类型
 * - 预定义组件：'blog-log' | 'blog-stats' | 'blog-tech' | 'comm-group' | 'empty' | 'toc'
 * - 自定义组件：'meta-aside-xxx' (从文章 frontmatter 中定义)
 */
export type WidgetName = RemovePrefix<KebabCase<RawWidgetName>, '-lazy-widget-'> | `meta-aside-${string}`

/**
 * 侧边栏组件管理组合式函数
 *
 * 根据组件名称列表，动态返回对应的 Vue 组件
 * 支持两种类型的组件：
 * 1. 预定义组件：直接映射到 LazyWidgetXxx 组件
 * 2. 元数据组件：从文章 frontmatter 的 meta.slots 中读取内容并渲染
 *
 * @param widgetList - 组件名称列表（响应式）
 * @returns 包含组件名称和组件实例的数组
 *
 * @example
 * ```ts
 * // 在页面中配置侧边栏
 * layoutStore.setAside(['blog-stats', 'toc', 'meta-aside-custom'])
 *
 * // 在组件中使用
 * const { widgets } = useWidgets(() => layoutStore.asideWidgets)
 * // widgets.value = [
 * //   { name: 'blog-stats', comp: LazyWidgetBlogStats },
 * //   { name: 'toc', comp: LazyWidgetToc },
 * //   { name: 'meta-aside-custom', comp: VNode } // 从文章元数据渲染
 * // ]
 * ```
 */
export default function useWidgets(widgetList: MaybeRefOrGetter<WidgetName[]>) {
	const store = useContentStore()

	/**
	 * 渲染文章元数据中定义的自定义插槽
	 * 从 store.meta.slots[slotName] 读取内容树并用 ContentRenderer 渲染
	 */
	function renderMetaSlots(widgetName: WidgetName) {
		// 移除 'meta-' 前缀获取实际的插槽名称
		const slotsTree = store.meta.slots[widgetName.slice('meta-'.length)]
		return h(
			LazyBlogWidget,
			{ card: !slotsTree, ...slotsTree?.props },
			() => slotsTree
				? h(ContentRenderer, { value: slotsTree })
				: `${widgetName} 不存在`,
		)
	}

	/**
	 * 计算后的组件列表
	 * 将组件名称映射为 { name, comp } 对象数组
	 */
	const widgets = computed(() => toValue(widgetList).map(widgetName => ({
		name: widgetName,
		comp: widgetName.startsWith('meta-aside-')
			? renderMetaSlots(widgetName)
			: rawWidgets[`LazyWidget${pascal(widgetName)}` as RawWidgetName],
	})))

	return {
		widgets,
	}
}
