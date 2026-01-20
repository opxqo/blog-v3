/**
 * 字符串处理工具函数
 *
 * 提供数字格式化、HTML 处理、文本高亮等功能
 */
import { toArray } from '@vueuse/core'

/**
 * 命令行提示符前缀到语言的映射
 * 用于识别代码块中的命令行提示符类型
 * @keep-sorted 保持按字母排序
 */
const promptLanguageMap: Record<string, string> = {
	'#': 'sh',         // root shell
	'$': 'sh',         // user shell
	'CMD': 'bat',      // Windows CMD
	'PS': 'powershell', // PowerShell
}

/**
 * 格式化大数字为中文单位
 *
 * 将较大的数字转换为带中文单位的字符串（万、亿、万亿）
 *
 * @param num - 要格式化的数字
 * @returns 格式化后的字符串，非数字返回空字符串
 *
 * @example
 * ```ts
 * formatNumber(12345)       // '1.23万'
 * formatNumber(123456789)   // '1.23亿'
 * formatNumber(999)         // '999'
 * ```
 */
export function formatNumber(num?: number) {
	if (typeof num !== 'number')
		return ''
	const intervals = [
		{ label: '万亿', threshold: 1e12 },
		{ label: '亿', threshold: 1e8 },
		{ label: '万', threshold: 1e4 },
	]
	for (const interval of intervals) {
		if (num >= interval.threshold)
			return `${(num / interval.threshold).toFixed(2)}${interval.label}`
	}
	return num.toString()
}

/**
 * 字节格式化配置选项
 */
interface FormatBytesOptions {
	/** 小数位数，默认 2 */
	decimals?: number
	/** 是否使用二进制单位（1024 进制），默认 true */
	binary?: boolean
	/** 数值与单位之间的分隔符，默认空格 */
	unitSeparator?: string
}

/**
 * 格式化字节数为人类可读的字符串
 *
 * @param bytes - 字节数
 * @param options - 格式化选项
 * @returns 格式化后的字符串，如 '1.5 MiB' 或 '1.5 MB'
 *
 * @example
 * ```ts
 * formatBytes(1536)                          // '1.5 KiB'
 * formatBytes(1536, { binary: false })       // '1.54 KB'
 * formatBytes(1048576)                       // '1 MiB'
 * formatBytes(0)                             // '0 Bytes'
 * ```
 */
export function formatBytes(bytes: number, options: FormatBytesOptions = {}) {
	const {
		decimals = 2,
		binary = true,
		unitSeparator = ' ',
	} = options

	if (bytes === 0)
		return `0${unitSeparator}Bytes`

	const base = binary ? 1024 : 1000
	const units = binary
		? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
		: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(base))
	const value = Number.parseFloat((bytes / base ** i).toFixed(decimals))

	return `${value}${unitSeparator}${units[i]}`
}

/**
 * 根据命令行提示符获取对应的语言类型
 *
 * 用于代码块语法高亮，根据提示符判断是 shell、PowerShell 还是 CMD
 *
 * @param prompt - 提示符字符串，如 '$', '#', 'PS>'
 * @returns 语言标识符，如 'sh', 'powershell', 'bat'
 */
export function getPromptLanguage(prompt: string | boolean) {
	if (typeof prompt === 'boolean')
		return 'text'
	for (const promptPrefix in promptLanguageMap) {
		if (prompt.startsWith(promptPrefix))
			return promptLanguageMap[promptPrefix] ?? 'text'
	}
	return 'text'
}

/**
 * 使用分隔符连接非空字符串
 *
 * 自动过滤 undefined 和空字符串
 *
 * @param strings - 字符串数组（可能包含 undefined）
 * @param separator - 分隔符，默认换行符
 * @returns 连接后的字符串
 *
 * @example
 * ```ts
 * joinWith(['a', undefined, 'b', ''])  // 'a\nb'
 * joinWith(['a', 'b'], ', ')           // 'a, b'
 * ```
 */
export function joinWith(strings: (string | undefined)[], separator = '\n') {
	return strings.filter(Boolean).join(separator)
}

/**
 * 转义 HTML 特殊字符
 *
 * 防止 XSS 攻击，将 HTML 特殊字符转为实体编码
 *
 * @param text - 原始文本
 * @returns 转义后的安全文本
 */
export function escapeHtml(text: string) {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#039;',
	}
	return text.replace(/[&<>"']/g, match => map[match] || match)
}

/**
 * 高亮文本中的关键词
 *
 * 将匹配的关键词用 <mark> 标签包裹，同时保持 HTML 安全
 *
 * @param text - 原始文本
 * @param words - 要高亮的关键词（字符串或字符串数组）
 * @param className - 可选的 CSS 类名
 * @returns 包含 <mark> 标签的 HTML 字符串
 *
 * @example
 * ```ts
 * highlightHtml('Hello World', 'world')
 * // 返回: 'Hello <mark>World</mark>'
 *
 * highlightHtml('Hello World', ['hello', 'world'], 'highlight')
 * // 返回: '<mark class="highlight">Hello</mark> <mark class="highlight">World</mark>'
 * ```
 */
export function highlightHtml(text: string, words: string | string[] | undefined, className?: string) {
	if (!text)
		return ''
	const format = (str: string) => str.replace(/\n+/g, '<br>')

	// 过滤并去重有效的搜索词
	const validTerms = new Set(
		toArray(words)
			.filter((t): t is string => !!t && t.trim().length > 0)
			.map(t => t.toLowerCase()),
	)

	if (validTerms.size === 0)
		return format(escapeHtml(text))

	// 转义正则特殊字符
	const escapedTerms = Array.from(validTerms)
		.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

	const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi')

	// 分割文本，对匹配部分添加 mark 标签
	return text
		.split(regex)
		.map(part => part && validTerms.has(part.toLowerCase())
			? `<mark ${className ? `class="${className}"` : ''}>${escapeHtml(part)}</mark>`
			: escapeHtml(part))
		.join('')
		.replace(/\n+/g, '<br>')
}

/**
 * 移除字符串中的所有 HTML 标签
 *
 * 用于从 HTML 内容中提取纯文本
 *
 * @param str - 可能包含 HTML 标签的字符串
 * @returns 移除标签后的纯文本
 */
export function removeHtmlTags(str?: string) {
	if (typeof str !== 'string')
		return ''
	return str.replace(/<[^>]+(>|$)/g, '')
}
