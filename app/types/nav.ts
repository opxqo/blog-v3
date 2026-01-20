/**
 * 导航相关类型定义
 *
 * 用于侧边栏导航、页脚导航等场景
 */

/**
 * 导航项
 *
 * 单个导航链接的数据结构
 */
export interface NavItem {
	/**
	 * 图标名称
	 * 使用 Iconify 格式，如 'ph:house-bold'
	 */
	icon: string

	/** 显示文本 */
	text: string

	/**
	 * 链接地址
	 * 站内路径（如 '/about'）或完整 URL
	 */
	url: string

	/**
	 * 是否为外部链接
	 * 设为 true 会在新标签页打开
	 */
	external?: boolean
}

/**
 * 导航组数组
 *
 * 导航通常按组划分，每组有标题和多个导航项
 *
 * @example
 * ```ts
 * const nav: Nav = [
 *   {
 *     title: '探索',
 *     items: [
 *       { icon: 'ph:house-bold', text: '首页', url: '/' },
 *       { icon: 'ph:archive-bold', text: '归档', url: '/archive' },
 *     ]
 *   },
 *   {
 *     title: '社交',
 *     items: [
 *       { icon: 'ph:github-logo-bold', text: 'GitHub', url: 'https://github.com/xxx', external: true },
 *     ]
 *   }
 * ]
 * ```
 */
export type Nav = {
	/** 分组标题，为空字符串则不显示标题 */
	title: string
	/** 该分组下的导航项列表 */
	items: NavItem[]
}[]
