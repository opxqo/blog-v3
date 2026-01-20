# AGENTS.md

Guidelines for AI agents working in this codebase.

## Project Overview

- **Framework**: Nuxt 4 (Vue 3)
- **Theme Name**: Clarity - A personal blog theme
- **Package Manager**: pnpm 10.27.0+
- **Node.js**: >=22.15 <25 (LTS recommended)
- **Language**: TypeScript (strict mode via Nuxt)

## Build/Lint/Test Commands

```bash
# Install dependencies (required first)
pnpm i

# Development
pnpm dev              # Start dev server with hot reload (opens browser)
pnpm dev:host         # Dev server accessible on network

# Production
pnpm build            # Build for production (SSR)
pnpm generate         # Generate static site (SSG) - recommended for deployment
pnpm preview          # Preview production build locally

# Linting
pnpm lint             # Run Stylelint on .vue and .scss files
pnpm lint:fix         # Run ESLint + Stylelint with auto-fix

# Utilities
pnpm new              # Create new blog post
pnpm clean            # Clear build cache
pnpm prepare          # Clean + build monorepo packages
```

### No Test Suite

This project does not have a test suite. Verify changes by:
1. Running `pnpm dev` and checking the browser
2. Running `pnpm lint:fix` before committing
3. Running `pnpm generate` to ensure static generation succeeds

## Code Style Guidelines

### Indentation & Formatting

- **Use TABS for indentation** (not spaces) - enforced by ESLint
- JSON files: 2-space indent (exception)
- YAML files: 2-space indent (exception)
- No trailing newline in JSON files (except in `content/` directory)

### ESLint Configuration

Uses `@antfu/eslint-config` with these customizations:
- Tab indentation everywhere
- Vue HTML indent: tabs with baseIndent 0
- The `content/` directory has relaxed rules for markdown frontmatter

### Stylelint Configuration

Uses `@zinkawaii/stylelint-config` with:
- Tab indentation
- Prefix notation for media feature ranges

## Vue Component Structure

Components MUST follow this order:

```vue
<script setup lang="ts">
// 1. Imports
// 2. Props/Emits definitions
// 3. Composables (useXxx)
// 4. Reactive state (ref, computed)
// 5. Functions
// 6. Lifecycle hooks
</script>

<template>
<!-- Template content -->
</template>

<style lang="scss" scoped>
/* Styles - MUST use lang="scss" and scoped */
</style>
```

### Vue Block Requirements

- `<script>`: MUST use `lang="ts"` or `lang="tsx"`
- `<style>`: MUST use `lang="scss"` and `scoped` attribute
- Enforced by ESLint `vue/block-lang` and `vue/enforce-style-attribute` rules

### Props Definition Pattern

```typescript
const props = withDefaults(defineProps<{
  title: string
  count?: number
  type?: 'primary' | 'secondary'
}>(), {
  count: 0,
  type: 'primary',
})
```

## Naming Conventions

### Files & Directories

- **Components**: PascalCase (`PostArticle.vue`, `BlogHeader.vue`)
- **Composables**: camelCase with `use` prefix (`useArticle.ts`, `usePagination.ts`)
- **Stores**: camelCase with `use` prefix (`layout.ts` exports `useLayoutStore`)
- **Utils**: camelCase (`time.ts`, `str.ts`)
- **Types**: camelCase (`article.ts`, `nav.ts`)

### Code

- **Variables/Functions**: camelCase (`listSorted`, `getCategoryIcon`)
- **Types/Interfaces**: PascalCase (`ArticleProps`, `NavItem`)
- **Interface suffixes**: Use `Props` for component props, `Options` for function options
- **Constants**: camelCase (no SCREAMING_CASE in this codebase)

### Component Prefixes

- `~/components/partial/*` components get `Z` prefix (e.g., `ZPagination`, `ZButton`)
- Other components use their directory as namespace (e.g., `PostArticle`, `BlogHeader`)

## Import Conventions

```typescript
// 1. External type imports
import type { SomeType } from 'external-package'

// 2. Internal type imports
import type { ArticleProps } from '~/types/article'

// 3. External packages
import { someFunction } from 'external-package'

// 4. Internal imports - use Nuxt aliases
import { myUtil } from '~/utils/myUtil'
import blogConfig from '~~/blog.config'
```

### Path Aliases

- `~` or `@` = `app/` directory (Nuxt convention)
- `~~` or `@@` = project root
- `#imports` = auto-imported Nuxt/Vue utilities

## Type Safety

- **NO** `as any` type assertions
- **NO** `@ts-ignore` or `@ts-expect-error` comments
- Use proper type narrowing instead of type assertions
- Define interfaces for complex objects in `app/types/`

## Configuration Files

- `blog.config.ts` - Static blog settings (title, author, SEO)
- `app/app.config.ts` - Runtime UI configuration (navigation, footer, themes)
- `nuxt.config.ts` - Nuxt framework configuration (DO NOT modify unless necessary)
- `content.config.ts` - Nuxt Content schema definitions

## Content (Markdown) Files

- Located in `content/posts/` (published) or `content/previews/` (drafts)
- Use MDC syntax for Vue components in markdown
- Frontmatter uses relaxed ESLint rules (quotes, semicolons allowed)

## Common Gotchas

1. **URL trailing slashes**: Article URLs should NOT end with `/`
2. **SSR hydration**: Use `<UtilHydrateSafe>` wrapper for client-only reactive content
3. **Date handling**: Use `toZonedDate()` from `~/utils/time` for timezone-aware dates
4. **Icon usage**: Use `<Icon name="collection:icon-name" />` (e.g., `ph:house-bold`)
