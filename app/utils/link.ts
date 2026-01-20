/**
 * 链接/URL 处理工具函数
 *
 * 提供域名解析、URL 分析等功能
 */
import { fromUrl, parseDomain, ParseResultType } from 'parse-domain'
import { isPathFile } from 'site-config-stack/urls'

/**
 * 常见托管服务域名的中文说明
 * 用于在友链等场景显示友好的域名类型提示
 */
const domainTip: Record<string, string> = {
	'github.io': 'GitHub Pages 域名',
	'netlify.app': 'Netlify 域名',
	'pages.dev': 'Cloudflare 域名',
	'thisis.host': '纸鹿提供的域名',
	'vercel.app': 'Vercel 域名',
	'zeabur.app': 'Zeabur 域名',
}

/**
 * 从 URL 中提取域名部分
 *
 * @param url - 完整 URL 或域名
 * @returns 域名字符串，解析失败则返回原始输入
 *
 * @example
 * ```ts
 * getDomain('https://blog.example.com/path')  // 'blog.example.com'
 * getDomain('example.com')                     // 'example.com'
 * ```
 */
export function getDomain(url: string) {
	const domain = fromUrl(url)
	return typeof domain === 'symbol' ? url : domain
}

/**
 * 获取 URL 的主域名（根域名）
 *
 * 移除子域名部分，只保留主域名和顶级域名
 *
 * @param url - 完整 URL 或域名
 * @param useIcann - 是否使用 ICANN 规则解析（忽略私有后缀如 github.io）
 * @returns 主域名，如 'example.com'
 *
 * @example
 * ```ts
 * getMainDomain('https://blog.example.com')           // 'example.com'
 * getMainDomain('https://user.github.io', false)      // 'user.github.io'（私有后缀）
 * getMainDomain('https://user.github.io', true)       // 'github.io'（ICANN 规则）
 * ```
 */
export function getMainDomain(url: string, useIcann?: boolean) {
	const hostname = getDomain(url)
	const parseResult = parseDomain(hostname)
	if (parseResult.type !== ParseResultType.Listed)
		return hostname
	const { domain, topLevelDomains } = useIcann ? parseResult.icann : parseResult
	return `${domain}.${topLevelDomains.join('.')}`
}

/**
 * 获取主域名对应的托管服务说明
 *
 * @param mainDomain - 主域名
 * @returns 中文说明，如 'GitHub Pages 域名'
 */
export function getDomainType(mainDomain: string) {
	return domainTip[mainDomain]
}

/**
 * 从 GitHub URL 中提取用户名
 *
 * 支持 github.com/username 或 github.com/username/repo 格式
 *
 * @param url - GitHub URL
 * @returns 用户名，无法提取则返回空字符串
 *
 * @example
 * ```ts
 * getGhUsername('https://github.com/octocat')        // 'octocat'
 * getGhUsername('https://github.com/octocat/repo')   // 'octocat'
 * getGhUsername('https://example.com')               // ''
 * ```
 */
export function getGhUsername(url?: string) {
	if (!url)
		return ''
	const usernameRegex = /github\.com\/([a-zA-Z0-9-]+)(?:\/[^/]+)?(\/?)?$/
	return url.match(usernameRegex)?.[1] ?? ''
}

/**
 * 判断 URL 是否为外部链接
 *
 * 外部链接的判断标准：
 * - 包含协议头（如 http:、mailto:）
 * - 指向文件（通过扩展名判断）
 *
 * @param url - 要检查的 URL
 * @returns 是否为外部链接
 *
 * @example
 * ```ts
 * isExtLink('https://example.com')   // true（有协议）
 * isExtLink('/about')                // false（站内路径）
 * isExtLink('/file.pdf')             // true（指向文件）
 * isExtLink('mailto:hi@example.com') // true（有协议）
 * ```
 */
export function isExtLink(url?: string) {
	return url
		? url.includes(':') || !!isPathFile(url)
		: false
}

/**
 * 安全地解码 URI 组件
 *
 * 对于无效的 URI 编码，返回原始字符串而不是抛出异常
 *
 * @param str - 要解码的字符串
 * @returns 解码后的字符串，解码失败则返回原始字符串
 */
export function safelyDecodeUriComponent(str: string) {
	try {
		return decodeURIComponent(str)
	}
	catch {
		return str
	}
}
