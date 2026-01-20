/**
 * Tippy.js 插件
 *
 * 注册 Tooltip 组件和 v-tip 指令
 * 用于显示悬停提示
 */
import type { directive, Tippy } from 'vue-tippy'
import VueTippy, { roundArrow } from 'vue-tippy'
import 'tippy.js/dist/svg-arrow.css'

declare module 'vue' {
	interface GlobalComponents {
		Tooltip: typeof Tippy
	}
	interface GlobalDirectives {
		vTip: typeof directive
	}
}

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueTippy, {
		component: 'Tooltip',
		directive: 'tip',
		defaultProps: {
			arrow: roundArrow,
		},
	})
})
