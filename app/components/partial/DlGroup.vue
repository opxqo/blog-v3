<script setup lang="ts">
/**
 * 定义列表分组组件
 *
 * 使用 HTML <dl><dt><dd> 结构展示键值对数据
 * 支持三种尺寸样式，用于文章元数据、统计信息等场景
 */
import type { VNodeChild } from 'vue'

/**
 * 定义列表项
 */
interface DlItem {
	/** 标签（键） */
	label: string
	/** 值，支持字符串、Ref、VNode 等 */
	value: MaybeRefOrGetter<VNodeChild>
	/** 提示文本，鼠标悬停时显示 */
	tip?: MaybeRefOrGetter<string>
}

withDefaults(defineProps<{
	/** 定义项列表 */
	items: DlItem[]
	/** 尺寸：small(居中) / medium(左右布局) / large(上下布局) */
	size?: 'small' | 'medium' | 'large'
}>(), {
	size: 'medium',
})
</script>

<template>
<dl class="dl-group" :class="size">
	<div v-for="{ label, value, tip } in items" :key="label">
		<dt>{{ label }}</dt>
		<dd :title="toValue(tip)">
			<!-- 支持 string, Ref<String>, VNode, () => VNode -->
			<component :is="() => toValue(value)" />
		</dd>
	</div>
</dl>
</template>

<style lang="scss" scoped>
.dl-group {
	> div {
		padding: 0.2em 0;

		> dt {
			font-size: 0.9em;
			color: var(--c-text-2);
		}
	}
}

.dl-group.small {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5em 1em;
	text-align: center;

	> div {
		flex: 1;
		white-space: nowrap;
	}
}

.dl-group.medium {
	display: grid;
	grid-template-columns: auto auto;
	gap: 0.4em 8%;
	padding: 0.2em 0;

	> div {
		display: contents;

		> dt {
			font-size: inherit;
			text-align: end;
		}
	}
}
</style>
