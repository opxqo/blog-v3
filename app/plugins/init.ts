/**
 * 初始化插件
 *
 * 执行一些全局初始化操作
 */
export default defineNuxtPlugin(() => {
	// 开发环境禁用 Umami 统计
	if (import.meta.client && import.meta.dev) {
		localStorage.setItem('umami.disabled', 'true')
	}
})
