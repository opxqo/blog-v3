/**
 * 目录(Table of Contents)导航组合式函数
 *
 * 监听页面滚动，高亮当前可见的标题，并同步滚动目录组件
 */
import type { Toc, TocLink } from '@nuxt/content'

/**
 * 扁平化后的目录项，包含元素位置信息
 */
interface TocList {
	/** 标题的 HTML id 属性 */
	id: string
	/** 标题元素距离文档顶部的偏移量 */
	offsetTop: number
}

/**
 * 目录导航组合式函数
 *
 * 实现文章目录与页面滚动的联动：
 * 1. 监听页面滚动，计算当前可见的标题
 * 2. 高亮目录中对应的项
 * 3. 自动滚动目录容器，确保当前项可见
 *
 * @param toc - Nuxt Content 生成的目录树（响应式）
 * @returns 目录相关的响应式状态
 *
 * @example
 * ```ts
 * const { activeHeadingId } = useToc(() => article.toc)
 *
 * // activeHeadingId.value 会随滚动自动更新为当前可见标题的 id
 * // 可用于高亮目录项: :class="{ active: id === activeHeadingId }"
 * ```
 */
export function useToc(toc: MaybeRefOrGetter<Toc | undefined>) {
	// 监听文档高度变化，用于触发目录位置重新计算（如图片加载后）
	const { height: bodyHeight } = useElementSize(document?.body)

	/**
	 * 递归扁平化目录树
	 * 将嵌套的目录结构转为一维数组，并获取每个标题的 offsetTop
	 */
	function flattenToc(tocTree: TocLink[], tocList: TocList[] = []) {
		tocTree.forEach((item) => {
			const headingEl = document.getElementById(item.id)
			if (headingEl)
				tocList.push({ id: item.id, offsetTop: headingEl.offsetTop })
			if (item.children)
				flattenToc(item.children, tocList)
		})
		return tocList
	}

	/**
	 * 目录项位置缓存（倒序排列，便于从后向前查找）
	 * 使用 computedWithControl 手动控制更新时机，避免频繁重算
	 * 在文档高度变化时（防抖后）重新计算
	 */
	const tocOffsets = computedWithControl(
		refDebounced(bodyHeight),
		() => flattenToc(toValue(toc)?.links || []).reverse(),
	)

	// 获取窗口滚动位置
	const { y: windowScrollY } = useWindowScroll()

	/**
	 * 获取当前激活的标题 id
	 * 查找第一个 offsetTop 小于当前滚动位置的标题（考虑 scroll-margin-top）
	 */
	function getActiveHeading() {
		// 获取 CSS 中定义的 scroll-margin-top 值（用于 sticky header 的偏移）
		const scrollMargin = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('scroll-margin-top'))
		const scrollPosition = windowScrollY.value + (scrollMargin || 64)
		// 使用倒序数组 + find 代替 findLast，提高兼容性
		return tocOffsets.value.find(item => item.offsetTop <= scrollPosition)?.id
	}

	/**
	 * 当前激活的标题 id（节流更新，避免滚动时频繁触发）
	 */
	const activeHeadingId = computedWithControl(
		refThrottled(windowScrollY, undefined, true),
		() => document && getActiveHeading(),
	)

	/**
	 * 滚动目录容器，使当前激活的目录项可见
	 * 注意：不使用 scrollIntoView，因为它会导致文章内容异常滚动
	 */
	function scrollToActiveTocItem() {
		const tocContainerEl = document.querySelector('#blog-aside')
		const activeTocEl = document.querySelector(`#blog-aside a[href="#${activeHeadingId.value}"]`) as HTMLElement | null
		tocContainerEl?.scroll({ top: activeTocEl?.offsetTop || 0 })
	}

	// 当激活标题变化时，滚动目录到对应位置
	watch(activeHeadingId, scrollToActiveTocItem)

	return {
		/** 目录位置缓存，可用于手动触发刷新 */
		tocOffsets,
		/** 当前激活的标题 id */
		activeHeadingId,
	}
}
