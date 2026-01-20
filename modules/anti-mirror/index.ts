/**
 * 反镜像模块
 *
 * 检测恶意镜像站点，自动重定向到原站点
 */
import { defineNuxtModule } from 'nuxt/kit'
import { minify } from 'oxc-minify'
import blogConfig from '../../blog.config'
import handleMirror from './runtime/client'

/** 恶意镜像站点黑名单 */
const blacklist = [
	'dgjlx.com', // blog.revincx.icu
	'gvhqt.com', // blog.zhilu.cyou
	'cmsla.com', // thyuu.com
	'wmlop.com', // xaoxuu.com
	'yswjxs.com', // blog.zhilu.cyou
]

export default defineNuxtModule({
	meta: {
		name: 'anti-mirror',
	},
	setup(options, nuxt) {
		(nuxt.options.app.head.script ??= []).push({
			innerHTML: toIifeString(handleMirror, blacklist.map(btoa), btoa(blogConfig.url)),
		})
	},
})

/** 将函数和参数转换为 IIFE 字符串 */
function toIifeString<T extends unknown[]>(fn: (...args: T) => void, ...args: T) {
	const fnString = fn.toString()
	const argsString = JSON.stringify(args).slice(1, -1)
	const minified = minify('', `(${fnString})(${argsString})`)
	return minified.code
}

