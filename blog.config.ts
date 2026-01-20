/**
 * 博客静态配置
 *
 * 定义博客的静态配置项，这些配置在构建时使用
 * 需要个性化配置这些文件
 */
import type { FeedEntry } from './app/types/feed'

const basicConfig = {
	title: '欧普小Q',
	subtitle: '分享技术与生活', // TODO: 替换为你的博客副标题
	// 长 description 利好于 SEO
	description: '这是我的个人博客，分享技术与生活。', // TODO: 替换为你的博客描述
	author: {
		name: '欧普小Q',
		avatar: 'https://img.opxqo.com/i/7cca3649-1f2b-4d98-9d23-fb54c2e0da5a.png',
		email: 'hi@opxqo.com', // TODO: 替换为你的邮箱
		homepage: 'https://example.com/', // TODO: 替换为你的主页
	},
	copyright: {
		abbr: 'CC BY-NC-SA 4.0',
		name: '署名-非商业性使用-相同方式共享 4.0 国际',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
	},
	favicon: 'https://img.opxqo.com/i/ad001f4e-c6c0-498b-bcd1-0eb9245e2eea.ico',
	language: 'zh-CN',
	timeEstablished: '2026-01-19', // TODO: 替换为你的博客创建日期
	timezone: 'Asia/Shanghai',
	url: 'https://opxqo.com/', // TODO: 替换为你的博客URL
	defaultCategory: '未分类',
}

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
// @keep-sorted
const blogConfig = {
	...basicConfig,

	article: {
		categories: {
			[basicConfig.defaultCategory]: { icon: 'ph:folder-dotted-bold' },
			经验分享: { icon: 'ph:mouse-bold', color: '#3af' },
			杂谈: { icon: 'ph:chat-bold', color: '#3ba' },
			生活: { icon: 'ph:shooting-star-bold', color: '#f77' },
			代码: { icon: 'ph:code-bold', color: '#77f' },
		},
		defaultCategoryIcon: 'ph:folder-bold',
		/** 文章版式，首个为默认版式 */
		types: {
			tech: {},
			story: {},
		},
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			// title: '标题',
		},
		/** 使用 pnpm new 新建文章时自动生成自定义链接（permalink/abbrlink） */
		useRandomPremalink: false,
		/** 隐藏基于文件路由（不是自定义链接）的 URL /post 路径前缀 */
		hidePostPrefix: true,
		/** 禁止搜索引擎收录的路径 */
		robotsNotIndex: ['/preview', '/previews/*'],
	},

	/** 博客 Atom 订阅源 */
	feed: {
		/** 订阅源最大文章数量 */
		limit: 50,
		/** 订阅源是否启用XSLT样式 */
		enableStyle: true,
	},

	/** 向 <head> 中添加脚本 */
	scripts: [
		// TODO: 添加你自己的统计服务
		// 示例: { 'src': 'https://your-analytics.com/script.js', 'defer': true },
		// Twikoo 评论系统
		{ src: 'https://lib.baomitu.com/twikoo/1.6.44/twikoo.min.js', defer: true },
	],

	/** 自己部署的 Twikoo 服务 */
	twikoo: {
		envId: '', // TODO: 替换为你的 Twikoo 服务地址
		preload: '', // TODO: 替换为你的 Twikoo 服务地址
	},
}

/** 用于生成 OPML 和友链页面配置 */
export const myFeed: FeedEntry = {
	author: blogConfig.author.name,
	sitenick: 'Blog', // TODO: 替换为你的博客昵称
	title: blogConfig.title,
	desc: blogConfig.subtitle || blogConfig.description,
	link: blogConfig.url,
	feed: new URL('/atom.xml', blogConfig.url).toString(),
	icon: blogConfig.favicon,
	avatar: blogConfig.author.avatar,
	archs: ['Nuxt', 'Vercel'],
	date: blogConfig.timeEstablished,
	comment: '', // TODO: 添加你的备注
}

export default blogConfig
