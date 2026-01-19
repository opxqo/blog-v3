// 友链检测 CLI 需要使用显式导入和相对路径
import type { FeedGroup } from '../app/types/feed'
import { myFeed } from '../blog.config'

export default [
	{
		name: '我的博客',
		desc: '欢迎访问我的博客。',
		entries: [
			myFeed,
		],
	},
	// TODO: 在这里添加你的友链
	// 示例:
	// {
	// 	name: '友链分组名称',
	// 	desc: '分组描述',
	// 	entries: [
	// 		{
	// 			author: '博主名称',
	// 			title: '博客标题',
	// 			desc: '博客描述',
	// 			link: 'https://example.com/',
	// 			feed: 'https://example.com/atom.xml',
	// 			icon: 'https://example.com/favicon.png',
	// 			avatar: 'https://example.com/avatar.png',
	// 			archs: ['Nuxt', 'Vercel'],
	// 			date: '2026-01-19',
	// 			comment: '备注',
	// 		},
	// 	],
	// },
] satisfies FeedGroup[]
