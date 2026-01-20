/**
 * 图片处理工具函数
 *
 * 提供各种图片服务的 URL 生成函数：
 * - GitHub 头像
 * - QQ 头像
 * - 网站 Favicon
 * - 图片代理服务
 */

/**
 * 图片代理服务配置
 * @keep-sorted 保持按字母排序
 */
const services = {
	/** 百度图片代理，用于绕过防盗链 */
	baidu: 'https://image.baidu.com/search/down?url=',
	/** wsrv.nl 图片处理服务，支持裁剪、缩放等 */
	weserv: 'https://wsrv.nl/?url=',
}

/** 图片代理服务类型 */
export type ImgService = keyof typeof services | boolean

/**
 * 通过 wsrv.nl 获取 GitHub 用户头像
 *
 * wsrv.nl 提供图片处理功能，可以调整尺寸、裁剪等
 *
 * @param name - GitHub 用户名
 * @param options - wsrv.nl 参数，支持 size 和其他任意参数
 * @returns 处理后的头像 URL
 *
 * @see https://wsrv.nl/docs/quick-reference.html
 *
 * @example
 * ```ts
 * getWsrvGhAvatar('octocat', { size: 120 })
 * getWsrvGhAvatar('octocat', { size: 64, mask: 'circle' })
 * ```
 */
export function getWsrvGhAvatar(name = '', options: Record<string, any> = { size: 92 }) {
	const srcUrl = `github.com/${name}.png?size=${options.size}`
	delete options.size

	const params = new URLSearchParams(srcUrl)
	Object.entries(options).forEach(([key, value]) => params.set(key, value))
	return services.weserv + params.toString()
}

/**
 * 通过 webp.se 服务获取 GitHub 用户头像（WebP 格式）
 *
 * 使用第三方 CDN 加速并自动转换为 WebP 格式
 *
 * @param name - GitHub 用户名
 * @param options - 配置选项，支持 size
 * @returns WebP 格式的头像 URL
 *
 * @see https://docs.webp.se/public-services/github-avatar/
 */
export function getGhAvatar(name = '', options = { size: 120 }) {
	return `https://avatars-githubusercontent-webp.webp.se/${name}?s=${options.size}`
}

/**
 * 获取 GitHub 用户的圆形小图标
 * 适用于评论、提交记录等小尺寸展示场景
 */
export const getGhIcon = (name = '') => getWsrvGhAvatar(name, { size: 32, mask: 'circle' })

/**
 * QQ 头像尺寸枚举
 * QQ 头像服务支持的预设尺寸
 */
export enum QqAvatarSize {
	Size1080,       // 0: 1080px（原图）
	Size40,         // 1: 40px
	Size40a,        // 2: 40px（备用）
	Size100,        // 3: 100px
	Size140,        // 4: 140px
	Size640,        // 5: 640px
	Size40b = 40,   // 40: 40px
	Size100a = 100, // 100: 100px
	Size640a = 640, // 640: 640px
}

/**
 * 获取 QQ 用户头像 URL
 *
 * @param qq - QQ 号码
 * @param size - 头像尺寸，使用 QqAvatarSize 枚举
 * @returns QQ 头像 URL
 *
 * @see https://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=
 */
export function getQqAvatar(qq = '', size = QqAvatarSize.Size140) {
	return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`
}

/**
 * 获取网站 Favicon 图标
 *
 * 使用 unavatar + webp.se 服务获取任意网站的图标
 *
 * @param domain - 网站域名
 * @param options - 配置选项
 * @param options.provider - 图标提供商，默认 'google'
 * @param options.size - 图标尺寸，默认 32
 * @returns Favicon URL
 *
 * @see https://github.com/microlinkhq/unavatar
 * @see https://docs.webp.se/public-services/unavatar/
 */
export function getFavicon(domain: string, options: Record<string, any> = {
	provider: 'google',
	size: 32,
}) {
	return `https://unavatar.webp.se/${options.provider}/${domain}?w=${options.size}`
}

/**
 * 获取经过代理处理的图片 URL
 *
 * 用于解决防盗链、加速访问等问题
 *
 * @param src - 原始图片 URL
 * @param service - 代理服务类型：
 *   - false/undefined: 不代理，返回原始 URL
 *   - true: 自动选择（GitHub 用 weserv，其他用百度）
 *   - 'baidu'/'weserv': 指定代理服务
 * @returns 处理后的图片 URL
 */
export function getImgUrl(src: string, service?: ImgService) {
	if (!service)
		return src
	if (service === true) {
		// 自动选择代理服务：GitHub 图片用 weserv（支持更多处理），其他用百度（绕过防盗链）
		const autoService = getMainDomain(src) === 'github.com' ? 'weserv' : 'baidu'
		return services[autoService] + src
	}
	if (service in services)
		return services[service] + src
	return src
}
