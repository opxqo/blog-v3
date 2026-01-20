/**
 * Shiki 代码高亮 Store
 *
 * 管理 Shiki 代码高亮器的加载和配置：
 * - 按需加载 Shiki 核心和语言包
 * - 提供统一的高亮配置选项
 * - 支持多种 transformers（差异对比、高亮、缩进指引等）
 *
 * 注意：Shiki 语言包从 CDN 动态加载，以减小打包体积
 */
import type { BundledLanguage, CodeToHastOptions, HighlighterCore, RegexEngine } from 'shiki'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { transformerNotationDiff, transformerNotationErrorLevel, transformerNotationFocus, transformerNotationHighlight, transformerNotationWordHighlight, transformerRenderIndentGuides, transformerRenderWhitespace } from '@shikijs/transformers'

/** Shiki Promise 缓存，确保只加载一次 */
let promise: Promise<HighlighterCore>
/** Shiki 实例缓存 */
let shiki: HighlighterCore

/**
 * 自定义 Transformer 忽略选项
 * 可选择性禁用某些 transformer
 */
type CustomTransformerOptions = Array<
	| 'ignoreColorizedBrackets'  // 禁用彩色括号匹配
	| 'ignoreRenderWhitespace'   // 禁用空白字符渲染
	| 'ignoreRenderIndentGuides' // 禁用缩进指引线
>

/** Shiki 配置选项类型 */
type ShikiOptions = CodeToHastOptions<BundledLanguage, string>

/**
 * Shiki 代码高亮 Store
 *
 * 提供延迟加载的代码高亮功能，减少首屏加载时间
 *
 * @example
 * ```ts
 * const shikiStore = useShikiStore()
 *
 * // 加载 Shiki 核心
 * await shikiStore.load()
 *
 * // 加载特定语言
 * await shikiStore.loadLang('typescript', 'vue')
 *
 * // 获取高亮配置
 * const options = shikiStore.getOptions('typescript')
 * const html = shiki.codeToHtml(code, options)
 * ```
 */
export const useShikiStore = defineStore('shiki', () => {
	/**
	 * 获取代码高亮配置选项
	 *
	 * 包含以下 transformers：
	 * - 差异对比标记 (// [!code ++/-/])
	 * - 行高亮标记 (// [!code highlight])
	 * - 词高亮标记 (// [!code word:xxx])
	 * - 焦点标记 (// [!code focus])
	 * - 错误级别标记 (// [!code error/warning])
	 * - 缩进指引线（可选）
	 * - 空白字符渲染（可选）
	 * - 彩色括号匹配（可选）
	 *
	 * @param lang - 代码语言
	 * @param transformerOptions - 要禁用的 transformer 列表
	 * @param extraShikiOptions - 额外的 Shiki 配置
	 * @returns 完整的 Shiki 配置选项
	 */
	const getOptions = (
		lang: string,
		transformerOptions?: CustomTransformerOptions,
		extraShikiOptions?: Omit<ShikiOptions, 'lang'>,
	): ShikiOptions => ({
		lang,
		// 主题配置：浅色使用 Catppuccin Latte，深色使用 One Dark Pro
		themes: {
			light: 'catppuccin-latte',
			dark: 'one-dark-pro',
		},
		transformers: [
			// 差异对比：// [!code ++] 和 // [!code --]
			transformerNotationDiff(),
			// 行高亮：// [!code highlight]
			transformerNotationHighlight(),
			// 词高亮：// [!code word:xxx]
			transformerNotationWordHighlight(),
			// 聚焦：// [!code focus]
			transformerNotationFocus(),
			// 错误级别：// [!code error] 和 // [!code warning]
			transformerNotationErrorLevel(),
			// 缩进指引线（日志/纯文本类型禁用）
			transformerOptions?.includes('ignoreRenderIndentGuides') || ['ansi', 'log', 'text'].includes(lang)
				? {}
				: transformerRenderIndentGuides(),
			// 空白字符可视化（日志/纯文本类型禁用）
			transformerOptions?.includes('ignoreRenderWhitespace') || ['ansi', 'log', 'text'].includes(lang)
				? {}
				: transformerRenderWhitespace(),
			// 彩色括号匹配
			transformerOptions?.includes('ignoreColorizedBrackets')
				? {}
				: transformerColorizedBrackets(),
			// 自定义处理：提取代码内容、添加行号属性
			{
				// 移除外层 pre > code 包装，只保留代码行
				root: hast => ({
					type: 'root',
					children: (hast.children[0] as any).children[0].children,
				}),
				// 为每行添加 data-line 属性
				line(node, line) {
					node.properties['data-line'] = line
				},
			},
		],
		...extraShikiOptions,
	})

	/**
	 * 加载 Shiki 核心
	 * 使用单例模式，多次调用只加载一次
	 *
	 * @returns Shiki HighlighterCore 实例
	 */
	async function load() {
		promise ??= loadShiki()
		shiki ??= await promise
		return shiki
	}

	/**
	 * 实际加载 Shiki 的内部函数
	 * 动态导入核心模块和主题，减少首屏加载时间
	 */
	async function loadShiki() {
		const [
			{ createHighlighterCore },
			{ createJavaScriptRegexEngine },
			catppuccinLatte,
			oneDarkPro,
		] = await Promise.all([
			import('shiki/core'),
			import('shiki/engine-javascript.mjs'),
			import('shiki/themes/catppuccin-latte.mjs'),
			import('shiki/themes/one-dark-pro.mjs'),
		])

		// 测试浏览器是否支持正则表达式 Modifier 语法 (?ims-ims:...)
		// 不支持则回退到 Oniguruma 引擎（Safari 等旧浏览器）
		let engine: RegexEngine
		try {
			// eslint-disable-next-line prefer-regex-literals, regexp/strict
			void new RegExp('(?i: )')
			engine = createJavaScriptRegexEngine()
		}
		catch {
			// 降级到 Oniguruma WASM 引擎
			const { createOnigurumaEngine } = await import('shiki/engine-oniguruma.mjs')
			// @ts-expect-error CDN 动态引入的包无类型
			engine = await createOnigurumaEngine(import('https://esm.sh/shiki/wasm'))
		}

		return createHighlighterCore({ themes: [catppuccinLatte, oneDarkPro], engine })
	}

	/**
	 * 按需加载语言包
	 * 从 CDN 动态加载，避免打包所有语言
	 *
	 * @param langs - 要加载的语言列表
	 */
	async function loadLang(...langs: string[]) {
		// @ts-expect-error CDN 动态引入的包无类型
		const { bundledLanguages } = await import('https://esm.sh/shiki/langs') as typeof import('shiki/langs')
		const loadedLangs = shiki.getLoadedLanguages()

		// 过滤出未加载且支持的语言，然后并行加载
		await Promise.all(langs
			.filter(unjudged => !loadedLangs.includes(unjudged) && unjudged in bundledLanguages)
			.map(unloaded => bundledLanguages[unloaded as BundledLanguage])
			.map(dynamicLang => dynamicLang().then(grammar => shiki.loadLanguage(grammar))),
		)
	}

	return {
		getOptions,
		load,
		loadLang,
	}
})
