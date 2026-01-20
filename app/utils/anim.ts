/**
 * 动画相关工具函数
 *
 * 提供 CSS 动画和 Web Animations API 辅助函数
 */
import { toArray } from '@vueuse/core'

/**
 * 矩形位置和尺寸信息
 */
interface Rect {
	left: number | string
	top: number | string
	width: number | string
	height: number | string
}

/** 可能是数组或单个值的类型 */
type MaybeArray<T> = T | T[]

/**
 * 将 DOM 元素或 Rect 对象转换为 Rect 对象
 * 如果是 DOM 元素，使用 getBoundingClientRect 获取其位置信息
 */
function toRect(rect: Element | Rect): Rect {
	return rect instanceof Element ? rect.getBoundingClientRect() : rect
}

/**
 * 确保值带有 px 单位
 * 数字会转为像素字符串，字符串直接返回
 */
const ensurePx = (val: number | string) => typeof val === 'number' ? `${val}px` : val

/**
 * 在多个矩形位置之间创建 Web Animation
 *
 * 用于实现元素从一个位置/尺寸过渡到另一个位置/尺寸的动画效果
 * 常用于 lightbox 图片放大、元素位置切换等场景
 *
 * @param el - 要执行动画的目标元素（响应式）
 * @param rect - 单个或多个矩形位置（可以是 DOM 元素或 Rect 对象）
 * @param options - Web Animation 配置选项
 * @returns Animation 对象，可用于控制动画（pause、cancel 等）
 *
 * @example
 * ```ts
 * // 从缩略图位置动画到全屏
 * const thumbRect = thumbnailEl.getBoundingClientRect()
 * animateBetweenRects(lightboxEl, [thumbRect, { left: 0, top: 0, width: '100vw', height: '100vh' }], {
 *   duration: 300,
 *   easing: 'ease-out'
 * })
 * ```
 */
export function animateBetweenRects(
	el: MaybeRefOrGetter<Element>,
	rect: MaybeArray<MaybeRefOrGetter<Element> | Rect>,
	options?: KeyframeAnimationOptions,
) {
	// 将所有输入转换为 Rect 数组
	const rects = toArray(rect).map(r => toRect(toValue(r)))

	// 构建关键帧并执行动画
	return toValue(el).animate(rects.map(r => ({
		left: ensurePx(r.left),
		top: ensurePx(r.top),
		width: ensurePx(r.width),
		height: ensurePx(r.height),
	})), {
		duration: 100,
		fill: 'forwards', // 动画结束后保持最终状态
		...options,
	})
}

/**
 * 生成 CSS --delay 变量样式对象
 *
 * 用于为列表项设置递增的动画延迟，实现错落入场效果
 *
 * @param s - 延迟时间（秒）
 * @param fixed - 小数位数，默认 2
 * @returns 包含 --delay CSS 变量的样式对象
 *
 * @example
 * ```vue
 * <div v-for="(item, i) in list" :style="getFixedDelay(i * 0.05)">
 *   <!-- CSS 中使用: animation-delay: var(--delay) -->
 * </div>
 * ```
 */
export const getFixedDelay = (s: number, fixed = 2) => ({ '--delay': `${s.toFixed(fixed)}s` })
