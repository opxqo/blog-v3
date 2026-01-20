<script setup lang="ts">
/**
 * 智能链接组件
 *
 * 根据链接类型自动选择渲染方式：
 * - 以 # 开头：渲染为普通 a 标签（锚点链接）
 * - 未提供 to：渲染为 span（纯文本）
 * - 外部链接：渲染为 NuxtLink 并在新标签页打开
 * - 内部链接：渲染为 NuxtLink
 */
defineProps<{
	/** 链接地址 */
	to?: string
}>()
</script>

<template>
<a v-if="to?.startsWith('#')" :href="to"><slot /></a>
<span v-else-if="typeof to === 'undefined'"><slot /></span>
<NuxtLink v-else :to :target="isExtLink(to) ? '_blank' : undefined">
	<slot />
</NuxtLink>
</template>
