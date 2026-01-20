# 项目架构文档

> **纸鹿摸鱼处 (Clarity Theme)**
> 基于 Nuxt 4 + Vue 3 + TypeScript 构建的个人博客主题

---

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [核心架构](#核心架构)
- [数据流](#数据流)
- [关键配置](#关键配置)
- [开发指南](#开发指南)
- [部署指南](#部署指南)

---

## 技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Nuxt** | 4.x | Vue 全栈框架 |
| **Vue** | 3.x | 前端框架 |
| **TypeScript** | Strict | 类型安全 |
| **Nuxt Content** | 2.x | 内容管理系统（CMS） |
| **Pinia** | Latest | 状态管理 |

### UI & 样式

| 技术 | 用途 |
|------|------|
| **SCSS** | 样式预处理 |
| **Tailwind CSS** | 原子化 CSS（部分使用） |
| **Iconify** | 图标库 |
| **KaTeX** | 数学公式渲染 |
| **Shiki** | 代码高亮 |

### 功能库

| 技术 | 用途 |
|------|------|
| **MiniSearch** | 站内搜索 |
| **Twikoo** | 评论系统 |
| **Tippy.js** | 提示框 |
| **Embla Carousel** | 轮播组件 |
| **date-fns** | 日期处理 |
| **VueUse** | 组合式工具函数 |

---

## 项目结构

```
blog-vue/
├── app/                    # 前端应用目录
│   ├── assets/             # 静态资源（字体、CSS）
│   ├── components/          # Vue 组件
│   │   ├── blog/           # 博客布局组件
│   │   ├── content/        # MDC 内容组件
│   │   ├── partial/        # 通用微型组件
│   │   ├── popover/        # 弹窗组件
│   │   ├── post/           # 文章组件
│   │   ├── util/           # 工具组件
│   │   └── widget/         # 侧栏小组件
│   ├── composables/        # Vue 组合式函数
│   ├── pages/              # 页面文件
│   ├── plugins/            # Nuxt 插件
│   ├── stores/             # Pinia 状态管理
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── app.config.ts        # 运行时配置
│   ├── app.vue              # 根组件
│   └── error.vue           # 错误页面
│
├── content/                # 文章内容（Markdown）
│   ├── posts/              # 已发布文章
│   ├── previews/            # 草稿文章
│   ├── link.md             # 友链页
│   └── theme.md            # 主题说明
│
├── server/                 # 服务端代码
│   ├── api/                # API 路由
│   └── routes/             # 根路由（XML/OPML）
│
├── modules/                # Nuxt 模块
│   └── anti-mirror/        # 反镜像模块
│
├── packages/               # Monorepo 包
│   ├── remark-music/        # 乐谱解析插件
│   └── rehype-meta-slots/  # 自定义插槽插件
│
├── scripts/                # 构建脚本
│   └── framework/          # 框架相关脚本
│
├── public/                 # 静态资源（图片、字体）
│
├── blog.config.ts          # 博客静态配置
├── content.config.ts        # Content 配置
├── nuxt.config.ts          # Nuxt 框架配置
└── package.json            # 项目依赖
```

---

## 核心架构

### 1. 组件架构

```
App.vue (根组件)
├── BlogSidebar (左侧边栏)
│   ├── BlogHeader
│   └── 导航链接
│
├── #content (内容区)
│   └── NuxtPage (当前页面)
│       ├── 首页 (index.vue)
│       ├── 文章页 ([...slug].vue)
│       ├── 归档页 (archive.vue)
│       └── 友链页 (link.vue)
│
├── BlogAside (右侧边栏)
│   └── 动态小组件
│       ├── Toc (目录)
│       ├── BlogStats (统计)
│       ├── BlogTech (技术栈)
│       └── BlogLog (更新日志)
│
└── BlogFooter (页脚)
```

### 2. 组件分层

| 层级 | 目录 | 说明 | 示例 |
|------|------|------|------|
| **布局层** | `components/blog/` | 整体布局，不包含业务逻辑 | BlogHeader, BlogSidebar, BlogFooter |
| **页面层** | `pages/` | 路由页面，组合组件 | index.vue, [...slug].vue |
| **业务层** | `components/post/` | 文章相关业务逻辑 | Article, PostHeader, Comment |
| **内容层** | `components/content/` | Markdown 渲染组件 | CardList, Alert, Badge |
| **通用层** | `components/partial/` | 可复用的微型组件 | Button, Toggle, Pagination |
| **工具层** | `components/util/` | 工具性组件 | Date, Link, Img, HydrateSafe |

### 3. 状态管理架构

```
Pinia Store
├── layoutStore      # 布局状态（侧边栏、弹窗等）
├── searchStore      # 搜索状态
├── popoverStore    # 弹窗管理
├── contentStore    # 文章元数据（toc, meta）
└── shikiStore      # 代码高亮缓存
```

**LayoutStore 核心功能**：
- 侧边栏开关（sidebar）
- 右侧栏开关（aside）
- 搜索弹窗（search）
- 右侧栏组件列表（asideWidgets）
- 页面位移（translate）

### 4. Composables 架构

| Composable | 功能 | 输出 |
|------------|------|------|
| `useArticle` | 文章列表查询 | `useArticleIndexOptions`, `useCategory`, `useArticleSort`, `getCategoryIcon` |
| `usePagination` | 分页逻辑 | `page`, `totalPages`, `listPaged`, `genPageArr` |
| `useToc` | 目录导航 | `activeHeadingId`, `tocOffsets` |
| `useCopy` | 剪贴板复制 | `copy`, `copied` |
| `useWidgets` | 侧栏组件管理 | `widgets` |

---

## 数据流

### 1. 文章数据流

```
Markdown 文件 (content/posts/*.md)
    ↓
Nuxt Content (解析 frontmatter)
    ↓
ArticleSchema (类型验证)
    ↓
文章列表/详情数据
    ↓
组件渲染
```

### 2. 搜索数据流

```
用户输入关键词
    ↓
debouncedWord (防抖 300ms)
    ↓
MiniSearch.search()
    ↓
搜索结果列表
    ↓
SearchItem 组件渲染
```

### 3. 目录联动流

```
用户滚动页面
    ↓
windowScrollY (节流)
    ↓
getActiveHeading() (比对 offsetTop)
    ↓
activeHeadingId 更新
    ↓
目录高亮 + 自动滚动
```

### 4. 主题切换流

```
用户点击主题按钮
    ↓
colorMode.preference 更新
    ↓
Nuxt colorMode 中间件
    ↓
CSS 变量更新
    ↓
全局样式切换
```

---

## 关键配置

### 1. 配置文件对比

| 配置文件 | 位置 | 更新方式 | 用途 |
|---------|------|----------|------|
| `blog.config.ts` | 项目根 | 构建时 | 静态配置（标题、作者、时区等） |
| `app.config.ts` | `app/` | 运行时 | 动态配置（导航、侧栏组件等） |
| `nuxt.config.ts` | 项目根 | 不修改 | Nuxt 框架配置 |
| `content.config.ts` | 项目根 | 不修改 | Content Schema 定义 |

### 2. 组件配置优先级

```typescript
// 优先级：props > frontmatter > app.config > blog.config
```

示例：代码块行数配置
```vue
<!-- 组件内部 props 最高 -->
<ProsePre :trigger-rows="50" />

<!-- frontmatter 中次之 -->
---
codeblock:
  triggerRows: 40
---

<!-- app.config.ts 再次之 -->
app.config.component.codeblock.triggerRows = 32

<!-- blog.config.ts 最低 -->
blog.config.article.codeblock.triggerRows = 24
```

### 3. 侧栏组件配置

在页面中配置侧栏组件：

```typescript
// 在页面的 setup 中
const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'toc', 'meta-aside-custom'])

// 第一种：预定义组件
'blog-stats' → 渲染 BlogStats 组件

// 第二种：文章元数据组件
'meta-aside-custom' → 从 frontmatter.meta.slots['aside-custom'] 渲染内容
```

在文章 frontmatter 中定义自定义插槽：

```markdown
---
title: 示例文章
---
<!-- 自定义侧栏组件内容 -->
<aside-custom>
  **自定义内容**
</aside-custom>

文章正文...
```

---

## 开发指南

### 1. 环境准备

#### 安装依赖

```bash
pnpm install
```

#### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:3000`

### 2. 新建文章

#### 使用脚本（推荐）

```bash
pnpm new
```

#### 手动创建

1. 在 `content/posts/` 下创建 `.md` 文件
2. 文件名格式：`YYYY-MM-DD-slug.md`
3. 添加 frontmatter：

```yaml
---
title: 文章标题
date: 2024-01-01
categories: [分类]
tags: [标签1, 标签2]
description: 文章摘要
image: /images/cover.jpg
type: tech
---
```

### 3. 组件开发规范

#### 文件命名

- **组件文件**：PascalCase（如 `Article.vue`）
- **Composables**：camelCase + `use` 前缀（如 `useArticle.ts`）
- **Store**：camelCase + `use` 前缀（如 `layout.ts` 导出 `useLayoutStore`）
- **Utils**：camelCase（如 `time.ts`, `str.ts`）
- **Types**：camelCase（如 `article.ts`）

#### 组件结构

```vue
<script setup lang="ts">
/**
 * 组件描述
 *
 * 详细说明组件的用途和功能
 */
// 1. Imports
import type { SomeType } from '~/types/some'
import { someFunction } from '~/utils/some'

// 2. Props/Emits 定义
const props = withDefaults(defineProps<{
  /** 属性说明 */
  title: string
  /** 可选属性说明 */
  count?: number
}>(), {
  count: 0,
})

const emit = defineEmits<{
  /** 事件说明 */
  update: [value: string]
}>()

// 3. Composables (useXxx)
const { data } = useSomeComposable()

// 4. Reactive state (ref, computed)
const isVisible = ref(false)
const computedValue = computed(() => props.count * 2)

// 5. Functions
function handleClick() {
  emit('update', computedValue.value)
}

// 6. Lifecycle hooks
onMounted(() => {
  console.log('mounted')
})
</script>

<template>
  <!-- Template content -->
</template>

<style lang="scss" scoped>
/* Styles - MUST use lang="scss" and scoped */
</style>
```

#### Vue Block 要求

- `<script>`: MUST 使用 `lang="ts"` 或 `lang="tsx"`
- `<style>`: MUST 使用 `lang="scss"` 和 `scoped` 属性

### 4. 样式开发规范

#### CSS 变量命名

```scss
// 颜色变量
--c-text: 文本颜色
--c-text-1: 主要文本
--c-text-2: 次要文本
--c-text-3: 弱化文本
--c-bg: 背景色
--c-bg-1: 背景一级
--c-bg-2: 背景二级
--c-primary: 主题色
--c-primary-soft: 主题色浅色
--c-accent: 强调色
--c-border: 边框色

// 阴影和模糊
--box-shadow-1: 小阴影
--box-shadow-2: 中阴影
--box-shadow-3: 大阴影
--backdrop-filter: 背景模糊

// 布局
--z-index-popover: 弹窗层级
--z-index-sticky: 吸顶层级
--z-index-modal: 模态框层级
```

#### 断点变量

```scss
$breakpoint-widescreen: 1408px; // 宽屏
$breakpoint-desktop: 1024px;   // 桌面
$breakpoint-tablet: 768px;   // 平板
$breakpoint-mobile: 480px;    // 手机
```

#### 响应式编写

```scss
.component {
  // 默认样式（移动端）
  padding: 1rem;

  @media (min-width: $breakpoint-tablet) {
    // 平板及以上
    padding: 1.5rem;
  }

  @media (min-width: $breakpoint-widescreen) {
    // 宽屏
    padding: 2rem;
  }
}
```

### 5. 类型开发规范

#### 接口定义

```typescript
/**
 * 文章属性接口
 */
export interface ArticleProps {
  /** 文章标题 */
  title: string
  /** 创建日期（ISO 8601） */
  date: string
  /** 更新日期（ISO 8601） */
  updated?: string
  /** 分类列表 */
  categories?: string[]
  /** 标签列表 */
  tags?: string[]
  /** 文章类型 */
  type?: ArticleType
  /** 封面图 */
  image?: string
  /** 摘要 */
  description?: string
  /** 推荐度 */
  recommend?: number
  /** 参考资料 */
  references?: ReferenceItem[]
}
```

### 6. 调试技巧

#### 查看当前路由

```typescript
const route = useRoute()
console.log('当前路由:', route.path)
console.log('路由参数:', route.params)
```

#### 查看 Store 状态

```typescript
const layoutStore = useLayoutStore()
console.log('侧边栏状态:', layoutStore.open)
```

#### 开发环境禁用统计

```typescript
// 已在 plugins/init.ts 中自动处理
// 开发环境会自动禁用 Umami 统计
```

---

## 部署指南

### 1. 构建生产版本

#### 静态生成（SSG）

```bash
pnpm generate
```

生成产物在 `dist/` 目录

#### 服务端渲染（SSR）

```bash
pnpm build
```

### 2. 部署平台

#### Vercel

**构建命令**: `pnpm generate`
**输出目录**: `dist`
**安装命令**: `pnpm i`

#### Netlify

**构建命令**: `pnpm generate`
**发布目录**: `dist`
**安装命令**: `pnpm i`

#### Cloudflare Pages

**构建命令**: `pnpm generate`
**输出目录**: `dist`
**安装命令**: `pnpm i`

### 3. 常见问题

#### 文章 URL 404 问题

确保文章 URL 不以 `/` 结尾：

```yaml
---
# ✅ 正确
permalink: /article-slug

# ❌ 错误
permalink: /article-slug/
---
```

#### 图片 404 问题

确保图片路径正确：
- 项目内图片：使用绝对路径 `/images/filename.jpg`
- 外部图片：使用完整 URL

#### 搜索不工作

检查 `content.config.ts` 中的 `ignoredTags` 配置，确保代码块不会被忽略。

---

## 扩展开发

### 1. 新增侧栏小组件

#### 步骤 1：创建组件

```vue
<!-- app/components/widget/MyWidget.vue -->
<script setup lang="ts">
/**
 * 自定义小组件
 */
const props = defineProps<{
  title?: string
}>()
</script>

<template>
<BlogWidget :title="title || '我的小组件'">
  <p>组件内容</p>
</BlogWidget>
</template>
```

#### 步骤 2：注册组件

```typescript
// app/composables/useWidgets.ts
import { LazyWidgetMyWidget } from '#components'

const rawWidgets = {
  LazyWidgetMyWidget,  // 添加到预定义组件列表
  // ... 其他组件
}
```

#### 步骤 3：在页面中使用

```typescript
// app/pages/index.vue
layoutStore.setAside(['my-widget', 'blog-stats'])
```

### 2. 新增 MDC 组件

#### 步骤 1：创建组件

```vue
<!-- app/components/content/MyComponent.vue -->
<script setup lang="ts">
/**
 * 自定义 MDC 组件
 */
const props = defineProps<{
  content?: string
}>()
</script>

<template>
<div class="my-component">
  {{ content || '默认内容' }}
</div>
</template>

<style lang="scss" scoped>
.my-component {
  padding: 1rem;
  border: 1px solid var(--c-border);
}
</style>
```

#### 步骤 2：在 Markdown 中使用

```markdown
---
title: 示例文章
---

## 正文

<MyComponent content="自定义内容" />
```

### 3. 新增自定义插槽

#### 在文章 frontmatter 中定义

```markdown
---
title: 示例文章
meta:
  slots:
    aside-custom: |
      <Badge>自定义内容</Badge>
    copyright: |
      本文章采用 CC BY-NC-SA 4.0 许可
---

## 正文
```

#### 在页面中使用

```typescript
// app/pages/[...slug].vue
layoutStore.setAside(['meta-aside-custom'])
```

---

## 性能优化

### 1. 组件懒加载

侧栏小组件使用 `Lazy` 前缀实现懒加载：

```typescript
const rawWidgets = {
  LazyWidgetBlogLog,      // 按需加载
  LazyWidgetBlogStats,    // 按需加载
  // ...
}
```

### 2. 数据预取

使用 `useAsyncData` 的 `prefetch` 选项：

```typescript
const { data } = await useAsyncData('posts', () => 
  useArticleIndexOptions(),
  {
    default: () => [], // 服务端渲染时提供默认值
    // 客户端自动预取下一页数据
  }
)
```

### 3. 搜索防抖

搜索关键词使用 `refDebounced` 实现防抖：

```typescript
const word = ref('')
const debouncedWord = refDebounced(word, 300)
```

### 4. 图片优化

使用 `NuxtImg` 组件自动优化图片：

```vue
<NuxtImg 
  src="/images/avatar.jpg" 
  width="120" 
  height="120" 
  :modifiers="{ resize: { fit: 'cover' } }"
  loading="lazy"
/>
```

---

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建静态站点
pnpm generate

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 代码修复
pnpm lint:fix

# 新建文章
pnpm new

# 清除缓存
pnpm clean

# 初始化项目
pnpm init-project

# 检查单个友链
pnpm check:feed https://example.com

# 检查所有友链
pnpm check:feed/all
```

---

## 主题定制

### 1. 修改主题色

修改 `assets/css/color.scss`：

```scss
:root {
  --c-primary: #3a7;        // 主题色
  --c-primary-soft: #e6f7e6; // 主题色浅色
  --c-accent: #3af;         // 强调色
}
```

### 2. 修改字体

修改 `assets/css/font.scss` 或 `nuxt.config.ts` 中的字体配置。

### 3. 修改布局

修改 `app/app.vue` 的布局结构。

### 4. 修改组件样式

在组件的 `<style>` 块中覆盖样式。

---

## 常见问题 FAQ

### Q: 如何修改首页显示的文章数量？

A: 修改 `app/app.config.ts` 中的 `pagination.perPage` 配置。

### Q: 如何添加新的分类图标？

A: 在 `blog.config.ts` 的 `article.categories` 中添加配置：

```typescript
categories: {
  '新分类': { icon: 'ph:icon-name-bold', color: '#颜色' },
}
```

### Q: 如何自定义代码高亮主题？

A: 在 `app/stores/shiki.ts` 的 `getOptions` 函数中修改 `themes` 配置。

### Q: 如何禁用某些功能？

A: 在 `app/app.config.ts` 中修改对应功能的配置，如 `component.codeblock.enableIndentGuide: false`。

### Q: 如何添加第三方统计？

A: 在 `nuxt.config.ts` 的 `app.head.script` 中添加统计脚本。

---

## 参考资源

- [Nuxt.js 文档](https://nuxt.com/docs)
- [Vue.js 文档](https://vuejs.org/)
- [Nuxt Content 文档](https://content.nuxt.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

### 代码规范

- 遵循 ESLint 和 Stylelint 规则
- 添加必要的注释
- 确保类型安全
- 测试功能正常

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

文章内容采用 CC BY-NC-SA 4.0 许可协议
