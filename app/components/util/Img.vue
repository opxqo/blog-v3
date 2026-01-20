<script setup lang="ts">
/**
 * 图片组件
 *
 * 智能图片加载组件，支持：
 * - 自动处理 base URL（Nuxt 部署在子目录时）
 * - 图片代理服务（绕过防盗链）
 * - CSS 滤镜效果
 * - 图片优化（使用 Nuxt Image）
 */
import ImageComponent from '#build/mdc-image-component.mjs'
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'

export interface UtilImgProps {
	/** 图片地址 */
	src: string
	/** 图片宽度 */
	width?: string | number
	/** 图片高度 */
	height?: string | number
	/** 图片描述 */
	alt?: string
	/** 图片代理服务 */
	mirror?: ImgService
	/** CSS 滤镜效果 */
	filter?: string
}

const props = withDefaults(defineProps<UtilImgProps>(), {
	alt: '',
})

/** 计算最终的图片地址（处理 base URL 和代理服务） */
const src = computed(() => {
	// 处理 base URL（Nuxt 部署在子目录时）
	if (props.src.startsWith('/') && !props.src.startsWith('//')) {
		const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
		if (_base !== '/' && !props.src.startsWith(_base))
			return joinURL(_base, props.src)
	}
	// 应用图片代理服务
	if (props.mirror)
		return getImgUrl(props.src, props.mirror)
	return props.src
})
</script>

<template>
<component
	:is="ImageComponent"
	:src :alt :width :height
	:style="{ filter }"
	:referrerpolicy="mirror ? 'no-referrer' : undefined"
/>
</template>
