/**
 * 图标映射工具函数
 *
 * 为各种场景提供图标名称映射：
 * - 友链技术架构图标
 * - 构建平台图标
 * - 域名/网站图标
 * - 文件类型图标
 * - 代码语言图标
 */

/**
 * 友链架构/框架图标映射
 * 用于友链页面显示博客使用的技术栈图标
 * @keep-sorted 保持按字母排序
 */
const archIcons = {
	'Astro': 'simple-icons:astro',
	'Cloudflare': 'simple-icons:cloudflare',
	'Deno Deploy': 'simple-icons:deno',
	'EdgeOne': 'simple-icons:cloudnativebuild', // 不准确
	'Express': 'simple-icons:express',
	'GitHub Pages': 'simple-icons:github',
	'Golang': 'simple-icons:go',
	'Gridea': 'tabler:square-rounded-letter-g-filled', // 不准确
	'Halo': 'material-symbols:h-mobiledata-badge', // 不准确
	'Hexo': 'simple-icons:hexo',
	'HTML': 'simple-icons:html5',
	'Hugo': 'simple-icons:hugo',
	'Jekyll': 'simple-icons:jekyll',
	'Netlify': 'simple-icons:netlify',
	'Next.js': 'simple-icons:nextdotjs',
	'NotionNext': 'simple-icons:notion',
	'Nuxt': 'simple-icons:nuxt',
	'PHP': 'simple-icons:php',
	'Python': 'simple-icons:python',
	'React': 'simple-icons:react',
	'Typecho': 'icon-park-solid:align-text-left-one', // 不准确
	'Valaxy': 'tabler:letter-v', // 不准确
	'Vercel': 'simple-icons:vercel',
	'VitePress': 'simple-icons:vitepress',
	'Vue': 'uim:vuejs',
	'VuePress': 'uim:vuejs',
	'WordPress': 'simple-icons:wordpress',
	'Zeabur': 'tabler:square-letter-z-filled', // 不准确
	'国内 CDN': 'ph:cloud-check-fill',
	'服务器': 'ph:hard-drives-fill',
	'虚拟主机': 'ph:file-cloud-bold',
}

/** 技术架构名称类型 */
export type Arch = keyof typeof archIcons

/**
 * 获取技术架构对应的图标名称
 * @param arch - 架构名称
 * @returns Iconify 图标名称，未找到返回空字符串
 */
export function getArchIcon(arch: Arch) {
	return archIcons[arch] ?? ''
}

/**
 * BlogTech Widget 构建平台图标映射
 * 用于显示博客构建/部署平台的图标
 * @keep-sorted 保持按字母排序
 */
export const ciIcons: Record<string, string> = {
	'Cloudflare Pages': 'devicon:cloudflare',
	'Cloudflare Workers': 'devicon:cloudflareworkers',
	'EdgeOne': 'https://edgeone.ai/favicon.ico',
	'GitHub Actions': 'ri:github-fill',
	'Netlify CI': 'catppuccin:netlify',
	'Vercel': 'ri:vercel-fill',
}

/**
 * 主域名图标映射
 * 根据网站主域名显示对应平台图标
 * @keep-sorted 保持按字母排序
 */
const mainDomainIcons: Record<string, string> = {
	'bilibili.com': 'ri:bilibili-fill',
	'creativecommons.org': 'ri:creative-commons-line',
	'github.com': 'ri:github-fill',
	'github.io': 'ri:github-fill',
	'google.cn': 'ri:google-fill',
	'google.com': 'ri:google-fill',
	'microsoft.com': 'ri:microsoft-fill',
	'netlify.app': 'simple-icons:netlify',
	'pages.dev': 'simple-icons:cloudflare',
	'qq.com': 'ri:qq-fill',
	'thisis.host': 'ph:star-four-fill',
	'v2ex.com': 'simple-icons:v2ex',
	'vercel.app': 'simple-icons:vercel',
	'zabaur.app': 'tabler:square-letter-z-filled',
	'zhihu.com': 'ri:zhihu-line',
}

/**
 * 专门域名图标映射
 * 优先级高于主域名图标，用于特定子域名
 * @keep-sorted 保持按字母排序
 */
export const domainIcons: Record<string, string> = {
	'developer.mozilla.org': 'simple-icons:mdnwebdocs',
	'mp.weixin.qq.com': 'ri:wechat-fill',
}

/**
 * 根据 URL 获取对应的域名图标
 * 优先匹配专门域名，其次匹配主域名
 *
 * @param url - 完整 URL
 * @returns Iconify 图标名称，未找到返回 undefined
 */
export function getDomainIcon(url: string) {
	const domain = getDomain(url)
	const mainDomain = getMainDomain(url, true)
	if (domain in domainIcons)
		return domainIcons[domain]
	return mainDomainIcons[mainDomain]
}

/**
 * 文件名后缀图标映射
 * 根据特定文件名或后缀显示对应图标
 * 优先级高于代码块语言图标
 * @keep-sorted 保持按字母排序
 */
const file2icon: Record<string, string> = {
	'.babelrc.js': 'catppuccin:babel',
	'.babelrc': 'catppuccin:babel',
	'.crt': 'catppuccin:certificate',
	'.editorconfig': 'catppuccin:editorconfig',
	'.env': 'catppuccin:env',
	'.gitattributes': 'catppuccin:git',
	'.gitconfig': 'catppuccin:git',
	'.gitignore': 'catppuccin:git',
	'.gitkeep': 'catppuccin:git',
	'.gitlab-ci.yml': 'catppuccin:gitlab',
	'.gitmodules': 'catppuccin:git',
	'.key': 'catppuccin:key',
	'.npmrc': 'catppuccin:npm',
	'.patch': 'catppuccin:git',
	'.prettierrc': 'catppuccin:prettier',
	'astro.config.mjs': 'catppuccin:astro-config',
	'CHANGELOG.md': 'catppuccin:changelog',
	'CODE_OF_CONDUCT.md': 'catppuccin:code-of-conduct',
	'CODEOWNERS': 'catppuccin:codeowners',
	'CONTRIBUTING.md': 'catppuccin:contributing',
	'docker-compose.yml': 'catppuccin:docker-compose',
	'eslint.config.js': 'catppuccin:eslint',
	'eslint.config.mjs': 'catppuccin:eslint',
	'LICENSE': 'catppuccin:license',
	'netlify.toml': 'catppuccin:netlify',
	'next.config.ts': 'catppuccin:next',
	'nuxt.config.ts': 'catppuccin:nuxt',
	'package.json': 'catppuccin:package-json',
	'pnpm-workspace.yaml': 'catppuccin:pnpm',
	'postcss.config.js': 'catppuccin:postcss',
	'prettier.config.js': 'catppuccin:prettier',
	'pyproject.toml': 'catppuccin:python-config',
	'README.md': 'catppuccin:readme',
	'renovate.json': 'catppuccin:renovate',
	'requirements.txt': 'catppuccin:python-config',
	'robots.txt': 'catppuccin:robots',
	'rollup.config.js': 'catppuccin:rollup',
	'SECURITY.md': 'catppuccin:security',
	'stylelint.config.js': 'catppuccin:stylelint',
	'stylelint.config.mjs': 'catppuccin:stylelint',
	'tailwind.config.js': 'catppuccin:tailwind',
	'tsconfig.json': 'catppuccin:typescript-config',
	'verccel.json': 'catppuccin:vercel',
	'vite.config.js': 'catppuccin:vite',
	'vite.config.ts': 'catppuccin:vite',
	'webpack.config.js': 'catppuccin:webpack',
	'yarn.lock': 'catppuccin:yarn',
}

/**
 * 根据文件名获取对应的文件图标
 *
 * @param filename - 文件名
 * @returns Iconify 图标名称，未匹配返回 undefined
 */
export function getFileIcon(filename?: string) {
	if (!filename)
		return undefined
	const extension = Object.keys(file2icon).find(ext => filename.endsWith(ext))
	return extension ? file2icon[extension] : undefined
}

/**
 * 代码块语言/扩展名到 Catppuccin 图标的映射
 *
 * 将代码语言简写或别名转换为 Iconify Catppuccin 图标库的图标名
 * @keep-sorted 保持按字母排序
 */
const ext2lang: Record<string, string> = {
	'bat': 'catppuccin:batch',
	'c': 'catppuccin:c',
	'c++': 'catppuccin:cpp',
	'cpp': 'catppuccin:cpp',
	'css': 'catppuccin:css',
	'diff': 'catppuccin:diff',
	'dockerfile': 'catppuccin:docker',
	'gql': 'catppuccin:graphql',
	'hs': 'catppuccin:haskell',
	'html': 'catppuccin:html',
	'ini': 'catppuccin:properties',
	'java': 'catppuccin:java',
	'js': 'catppuccin:javascript',
	'json': 'catppuccin:json',
	'jsonc': 'catppuccin:json',
	'jsx': 'catppuccin:javascript-react',
	'log': 'catppuccin:log',
	'make': 'catppuccin:makefile',
	'makefile': 'catppuccin:makefile',
	'matlab': 'catppuccin:matlab',
	'md': 'catppuccin:markdown',
	'mdc': 'catppuccin:markdown',
	'mdx': 'catppuccin:markdown',
	'mmd': 'catppuccin:mermaid',
	'powershell': 'catppuccin:powershell',
	'ps': 'catppuccin:powershell',
	'ps1': 'catppuccin:powershell',
	'py': 'catppuccin:python',
	'python': 'catppuccin:python',
	'rs': 'catppuccin:rust',
	'scss': 'catppuccin:sass',
	'sh': 'catppuccin:bash',
	'shell': 'catppuccin:bash',
	'shellscript': 'catppuccin:bash',
	'sql': 'catppuccin:database',
	'ssh-config': 'catppuccin:properties',
	'ssh': 'catppuccin:properties',
	'toml': 'catppuccin:toml',
	'ts': 'catppuccin:typescript',
	'tsx': 'catppuccin:typescript-react',
	'vb': 'catppuccin:visual-studio',
	'vue': 'catppuccin:vue',
	'xml': 'catppuccin:xml',
	'yaml': 'catppuccin:yaml',
	'yml': 'catppuccin:yaml',
	'zsh': 'catppuccin:bash',
}

/**
 * 根据代码语言/扩展名获取对应的图标
 *
 * @param extension - 语言名称或文件扩展名，默认 'file'
 * @returns Catppuccin 图标名称，未匹配返回通用文件图标
 */
export function getLangIcon(extension = 'file') {
	return ext2lang[extension] ?? 'catppuccin:file'
}
