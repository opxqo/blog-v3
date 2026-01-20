/**
 * 文章相关类型定义
 *
 * 定义文章的数据结构和排序方式
 */
import type { AppConfig } from 'nuxt/schema'
import type { MetaSlotsTree } from 'rehype-meta-slots'
import type { ArticleSchema } from '~~/content.config'

/**
 * 文章排序字段类型
 *
 * 从 AppConfig 中的 article.order 配置自动推导
 * 通常包含 'date'（创建日期）和 'updated'（更新日期）
 */
export type ArticleOrderType = keyof AppConfig['article']['order']

/**
 * 文章属性接口
 *
 * 继承自 content.config.ts 中定义的 ArticleSchema
 * 包含文章的所有元数据和内容信息
 */
export interface ArticleProps extends ArticleSchema {
	/** 文章访问路径（不含域名，如 '/posts/hello-world'） */
	path: string

	/**
	 * 文章元信息
	 * 来自 frontmatter 中的 meta 字段，用于控制文章展示效果
	 */
	meta?: {
		/** 是否对封面图添加暗角效果 */
		coverDim?: boolean
		/** 封面图 CSS filter 效果 */
		coverFilter?: string
		/** 是否隐藏文章信息栏（日期、阅读时间等） */
		hideInfo?: boolean
		/**
		 * 自定义插槽内容
		 * 在 markdown 中通过 MDC 语法定义的自定义组件区域
		 */
		slots?: Record<string, MetaSlotsTree>
	}
}
