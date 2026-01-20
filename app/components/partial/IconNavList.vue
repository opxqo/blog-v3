<script setup lang="ts">
/**
 * 图标导航列表组件
 *
 * 展示一组图标链接，横向排列
 * 常用于页脚导航、社交链接等场景
 */
import type { NavItem } from '~/types/nav'

defineProps<{
	/** 导航项列表 */
	list: NavItem[]
}>()
</script>

<template>
<menu>
	<UtilLink
		v-for="{ text, icon, url } in list"
		:key="text"
		v-tip="text"
		:to="url"
		:aria-label="text"
	>
		<Icon :name="icon" />
	</UtilLink>
</menu>
</template>

<style lang="scss" scoped>
menu {
	display: flex;
	justify-content: center;

	a {
		padding: 0.5em;
		border-radius: 2em;
		transition: background-color 0.2s;

		&:hover {
			background-color: var(--c-bg-soft);
		}

		.iconify {
			display: block;
		}
	}
}
</style>
