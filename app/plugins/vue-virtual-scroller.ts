/**
 * Vue Virtual Scroller 插件
 *
 * 注册虚拟滚动组件，用于长列表优化
 */
// @ts-expect-error TS7016
// https://github.com/Akryum/vue-virtual-scroller/issues/486
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueVirtualScroller)
})
