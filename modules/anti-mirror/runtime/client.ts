/**
 * 反镜像客户端运行时
 *
 * 检测当前域名是否在黑名单中，如果是则重定向到原站点
 */
export default (sourcesEncoded: string[], targetEncoded: string) => {
	const sources = sourcesEncoded.map(atob)
	const target = atob(targetEncoded)
	const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
	const isBadMirror = sources.some(domain => location.hostname.endsWith(domain))
	if (isBadMirror) {
		if (canonical)
			canonical.href = canonical.href.replace(location.host, target)
		location.host = target
	}
}
