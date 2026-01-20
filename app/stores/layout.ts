/**
 * 布局状态管理 Store
 *
 * 管理博客整体布局状态：
 * - 侧边栏（sidebar）开关
 * - 右侧栏（aside）开关
 * - 搜索弹窗开关
 * - 页面位移效果
 * - 右侧栏组件配置
 */

import type { WidgetName } from '~/composables/useWidgets'

/**
 * 布局区域的默认开关状态
 * 所有区域默认关闭
 */
const defaultState = {
	/** 左侧导航栏（移动端） */
	sidebar: false,
	/** 右侧边栏（桌面端显示 widgets） */
	aside: false,
	/** 搜索弹窗 */
	search: false,
}

/** 布局区域名称类型 */
type LayoutSection = keyof typeof defaultState

/**
 * 布局状态管理 Store
 *
 * 核心功能：
 * 1. 管理多个布局区域的开关状态（互斥：同时只能打开一个）
 * 2. 管理右侧栏显示哪些 widget 组件
 * 3. 管理页面整体位移效果（用于固定元素偏移）
 * 4. 路由切换时自动关闭所有打开的区域
 *
 * @example
 * ```ts
 * const layoutStore = useLayoutStore()
 *
 * // 切换侧边栏
 * layoutStore.toggle('sidebar')
 *
 * // 设置右侧栏组件
 * layoutStore.setAside(['toc', 'blog-stats'])
 *
 * // 检查是否有任何区域打开
 * if (layoutStore.isAnyOpen) {
 *   layoutStore.closeAll()
 * }
 * ```
 */
export const useLayoutStore = defineStore('layout', () => {
	const router = useRouter()

	/**
	 * 各布局区域的开关状态
	 * 采用互斥模式：打开一个会关闭其他
	 */
	const open = ref({ ...defaultState })

	/** 是否有任何区域处于打开状态 */
	const isAnyOpen = computed(() => Object.values(open.value).some(Boolean))

	/**
	 * 页面位移量配置
	 * 用于处理固定定位元素（如 lightbox）时的页面偏移
	 * key 为位移原因标识，value 为 CSS transform 值
	 */
	const translate = ref<Record<string, string>>({})

	/** 右侧栏要显示的 widget 组件列表 */
	const asideWidgets = ref<WidgetName[]>([])

	/**
	 * 关闭所有布局区域
	 */
	const closeAll = () => {
		Object.keys(open.value).forEach((key) => {
			open.value[key as LayoutSection] = false
		})
	}

	/**
	 * 切换指定区域的开关状态
	 * 如果目标区域已打开则关闭，否则关闭所有并打开目标区域（互斥）
	 *
	 * @param key - 要切换的区域名称
	 */
	const toggle = (key: LayoutSection) => {
		const isActive = open.value[key]
		closeAll()
		open.value[key] = !isActive
	}

	/**
	 * 设置右侧栏要显示的 widget 组件
	 * 通常在页面组件的 setup 中调用，为不同页面配置不同的 widgets
	 *
	 * @param widgets - widget 名称数组
	 */
	const setAside = (widgets?: WidgetName[]) => {
		if (widgets)
			asideWidgets.value = widgets
	}

	/**
	 * 设置页面位移效果
	 * 用于特殊场景（如 lightbox 全屏时）需要偏移页面内容
	 *
	 * @param reason - 位移原因标识
	 * @param value - CSS transform 值
	 */
	const setTranslate = (reason: string, value: string) => {
		translate.value[reason] = value
	}

	// 路由切换时自动关闭所有打开的区域
	router.beforeEach(() => {
		closeAll()
	})

	return {
		open,
		isAnyOpen,
		asideWidgets,
		translate,
		closeAll,
		toggle,
		setAside,
		setTranslate,
	}
})
