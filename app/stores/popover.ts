/**
 * 弹窗（Popover）状态管理 Store
 *
 * 提供统一的弹窗管理机制：
 * - 支持多个弹窗叠加（z-index 自动递增）
 * - 支持打开/关闭动画
 * - 支持唯一性模式（同一弹窗不重复打开）
 */
import type { Raw, VNode } from 'vue'
import { sleep } from 'radash'

/**
 * 单个弹窗的状态信息
 */
interface PopoverState {
	/** 弹窗的 VNode 渲染内容 */
	vnode: VNode
	/** 动画持续时间（毫秒） */
	duration: number
	/** 是否显示（用于控制入场/离场动画） */
	show: Ref<boolean>
	/** z-index 层级 */
	zIndex: number
}

/**
 * 弹窗配置选项
 */
export interface PopoverOptions {
	/** 动画持续时间（毫秒），默认 200 */
	duration?: number
	/**
	 * 是否启用唯一性模式
	 * 开启后，相同弹窗不会重复打开
	 */
	unique?: boolean
}

/**
 * 弹窗管理 Store
 *
 * 使用工厂模式，通过 `use()` 方法创建弹窗控制器
 * 每个控制器独立管理自己的弹窗实例
 *
 * @example
 * ```ts
 * const popoverStore = usePopoverStore()
 *
 * // 创建一个弹窗控制器
 * const { open, close } = popoverStore.use(
 *   () => h(MyPopoverComponent, { title: 'Hello' }),
 *   { duration: 300 }
 * )
 *
 * // 打开弹窗
 * open()
 *
 * // 关闭弹窗
 * close()
 * ```
 */
export const usePopoverStore = defineStore('popover', () => {
	/**
	 * 当前打开的所有弹窗状态列表
	 * 使用 Raw 类型避免 Vue 深度响应式（VNode 不需要响应式）
	 */
	const pops = ref<Raw<PopoverState>[]>([])

	/**
	 * 创建弹窗控制器
	 *
	 * @param render - 返回弹窗 VNode 的渲染函数
	 * @param options - 弹窗配置选项
	 * @returns 弹窗控制器 { open, close }
	 */
	function use(render: () => VNode, options?: PopoverOptions) {
		let state: PopoverState
		const show = ref(false)
		// z-index 基于当前弹窗数量递增，确保新弹窗在最上层
		const zIndex = pops.value.length + 100

		/**
		 * 打开弹窗
		 * 如果开启 unique 模式且弹窗已存在，则不重复打开
		 */
		async function open() {
			// unique 模式：检查弹窗是否已在队列中
			// 非 unique 模式：检查 show 状态
			if (options?.unique ? pops.value.includes(state) : show.value)
				return

			// 调用渲染函数获取 VNode
			const vnode = render()
			state = {
				vnode,
				show,
				duration: options?.duration ?? 200,
				zIndex,
			}

			// 添加到弹窗队列
			pops.value.push(state)

			// 注入动画延迟和关闭回调
			Object.assign(vnode.props ??= {}, {
				style: getFixedDelay(state.duration / 1000),
				onClose: vnode.props?.onClose ?? close,
				// 挂载完成后触发入场动画
				onVnodeMounted: () => (show.value = true),
			})
		}

		/**
		 * 关闭弹窗
		 * 先触发离场动画，等待动画完成后再移除
		 */
		async function close() {
			const index = pops.value.indexOf(state)
			if (index === -1)
				return

			// 触发离场动画
			show.value = false

			// 等待动画完成
			await sleep(state.duration)

			// 从队列中移除
			pops.value.splice(index, 1)
		}

		return { open, close }
	}

	return {
		/** 当前打开的弹窗列表（供 BlogPopover 组件渲染） */
		pops,
		/** 创建弹窗控制器 */
		use,
	}
})
