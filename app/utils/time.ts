/**
 * 时间/日期处理工具函数
 *
 * 提供时区转换、日期格式化、相对时间计算等功能
 */
import { differenceInMilliseconds } from 'date-fns'
import { toDate } from 'date-fns-tz'

/**
 * 将日期字符串转换为指定时区的 Date 对象
 *
 * 默认使用博客配置的时区（appConfig.timezone）
 * 可选择使用用户浏览器的本地时区
 *
 * @param date - 日期字符串或 Date 对象
 * @param useUserTimeZone - 是否使用用户本地时区，默认 false
 * @returns 时区调整后的 Date 对象
 *
 * @example
 * ```ts
 * // 使用博客配置的时区（如 Asia/Shanghai）
 * toZonedDate('2024-01-01T00:00:00')
 *
 * // 使用用户本地时区
 * toZonedDate('2024-01-01T00:00:00', true)
 * ```
 */
export function toZonedDate(date: string | Date, useUserTimeZone = false) {
	const timeZone = useUserTimeZone ? Intl.DateTimeFormat().resolvedOptions().timeZone : useAppConfig().timezone
	return toDate(date, { timeZone })
}

/**
 * 获取日期的本地化完整格式字符串
 *
 * 包含完整的日期、时间、星期和时区信息
 *
 * @param date - 日期字符串或 Date 对象
 * @returns 本地化的日期时间字符串
 *
 * @example
 * ```ts
 * getLocaleDatetime('2024-01-01T12:30:00')
 * // 返回类似: '2024年01月01日星期一 12:30:00 中国标准时间'
 * ```
 */
export function getLocaleDatetime(date: string | Date) {
	return toZonedDate(date)
		.toLocaleString(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			weekday: 'long',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'long',
		})
}

/**
 * 判断两个日期之间的差异是否显著
 *
 * 用于决定是否需要同时显示创建日期和更新日期
 * 如果两者相差不大，可能只显示一个
 *
 * @param date1 - 第一个日期（如创建日期）
 * @param date2 - 第二个日期（如更新日期）
 * @param threshold - 敏感度阈值（0~1），值越小越敏感，默认 0.6
 * @returns 两个日期差异是否显著
 *
 * @example
 * ```ts
 * // 创建日期和更新日期相差较大，返回 true
 * isTimeDiffSignificant('2023-01-01', '2024-01-01')  // true
 *
 * // 创建日期和更新日期很接近，返回 false
 * isTimeDiffSignificant('2024-01-01', '2024-01-02')  // false
 * ```
 */
export function isTimeDiffSignificant(
	date1?: string | Date,
	date2?: string | Date,
	threshold: number = 0.6,
) {
	if (!date1 || !date2)
		return false

	const now = Date.now()

	// 计算两个日期距今的时间差
	const diff1 = differenceInMilliseconds(now, date1)
	const diff2 = differenceInMilliseconds(now, date2)
	// 如果两者的比值小于阈值，说明差异显著
	return diff1 / diff2 < threshold || diff2 / diff1 < threshold
}

/**
 * 时间间隔配置
 * 从大到小排列，用于计算人类可读的时间差
 */
const timeIntervals = [
	{ label: '世纪', threshold: 1000 * 60 * 60 * 24 * 365.2422 * 100 },
	{ label: '年', threshold: 1000 * 60 * 60 * 24 * 365.2422 },
	{ label: '个月', threshold: 1000 * 60 * 60 * 24 * 30.44 },
	{ label: '天', threshold: 1000 * 60 * 60 * 24 },
	{ label: '小时', threshold: 1000 * 60 * 60 },
	{ label: '分', threshold: 1000 * 60 },
	{ label: '秒', threshold: 1000 },
]

/**
 * 计算从指定日期到现在经过的时间
 *
 * 返回人类可读的中文时间差，如"3天2小时"
 *
 * @param date - 起始日期
 * @param maxDepth - 最大显示的时间单位数量，默认 2
 * @returns 人类可读的时间差字符串
 *
 * @example
 * ```ts
 * // 假设距今 3 天 5 小时 30 分钟
 * timeElapse(someDate)      // '3天5小时'
 * timeElapse(someDate, 1)   // '3天'
 * timeElapse(someDate, 3)   // '3天5小时30分'
 *
 * // 刚刚发生
 * timeElapse(new Date())    // '刚刚'
 * ```
 */
export function timeElapse(date: Date | string, maxDepth = 2) {
	let timeString = ''
	let msecRemained = differenceInMilliseconds(Date.now(), date)

	for (const interval of timeIntervals) {
		const count = Math.floor(msecRemained / interval.threshold)
		if (count <= 0)
			continue
		timeString += `${count}${interval.label}`
		msecRemained -= count * interval.threshold
		if (--maxDepth <= 0)
			break
	}

	return timeString || '刚刚'
}
