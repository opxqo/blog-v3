/**
 * 友链/订阅源相关类型定义
 *
 * 用于友链页面和 OPML 订阅源生成
 */
import type { Arch } from '~/utils/icon'

/**
 * 友链/订阅源条目
 *
 * 描述单个友链博客的完整信息
 */
export interface FeedEntry {
	/** 博客作者/博主名称 */
	author: string

	/**
	 * 网站趣称/昵称
	 * 用于简短展示，如 "纸鹿" 对应 "纸鹿摸鱼处"
	 */
	sitenick?: string

	/**
	 * 博客网站完整标题
	 * 用于订阅源等需要完整名称的场景
	 * 为空则使用网站趣称或作者名
	 */
	title?: string

	/** 个人简介或博客描述 */
	desc?: string

	/** 博客首页地址 */
	link: string

	/**
	 * 订阅源 URL
	 * 通常是 RSS/Atom feed 地址
	 */
	feed?: string

	/**
	 * 站点小图标 URL
	 * 通常是 favicon，用于列表展示
	 */
	icon: string

	/**
	 * 博主个人头像 URL
	 * 用于详情展示
	 */
	avatar: string

	/**
	 * 博客技术架构
	 * 如 ['Nuxt', 'Vercel']，用于展示技术栈图标
	 */
	archs?: Arch[]

	/**
	 * 添加/订阅日期
	 * ISO 8601 格式，如 '2024-01-01'
	 */
	date: string

	/**
	 * 博主备注
	 * 对该友链的说明或评价
	 */
	comment?: string

	/**
	 * 错误信息
	 * 访问检测时记录的错误，用于友链状态监控
	 */
	error?: string
}

/**
 * 友链分组
 *
 * 将友链按类别分组展示
 */
export interface FeedGroup {
	/** 分组名称，如 '互关好友'、'优秀博客' */
	name: string

	/** 分组描述/说明 */
	desc?: string

	/** 该分组下的友链列表 */
	entries: FeedEntry[]
}
