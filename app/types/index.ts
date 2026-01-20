/**
 * 全局类型扩展
 *
 * 扩展浏览器 Window 接口，添加第三方库的类型声明
 */

declare global {
	interface Window {
		/**
		 * Twikoo 评论系统全局对象
		 *
		 * Twikoo 通过 CDN script 标签加载，挂载在 window 上
		 * @see https://twikoo.js.org/
		 */
		twikoo?: {
			/**
			 * 初始化 Twikoo 评论组件
			 *
			 * @param options - 初始化配置
			 * @param options.envId - 云函数/Vercel 部署地址
			 * @param options.el - 挂载的 DOM 选择器
			 * @param options.region - 腾讯云地域（仅腾讯云需要）
			 * @param options.path - 评论路径，默认为当前页面 pathname
			 * @param options.lang - 语言，默认 'zh-CN'
			 */
			init: (options: {
				envId: string
				el: string
				region?: string
				path?: string
				lang?: string
			}) => void

			/** Twikoo 版本号 */
			version: string
		}
	}
}

// 确保此文件被视为模块
export {}
