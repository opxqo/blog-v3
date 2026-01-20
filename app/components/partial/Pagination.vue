<script setup lang="ts">
/**
 * 分页器组件
 *
 * 智能分页导航，支持粘性定位、展开/收起效果
 * 自动处理页码显示逻辑，首页末页始终可见，中间页码可展开
 */

const props = defineProps<{
	/** 总页数 */
	totalPages: number
	/** 当前页码两侧展开的页数，默认 2 */
	expandPages?: number
	/** 是否开启粘性定位，默认 false */
	sticky?: boolean
}>()

const page = defineModel<number>({ required: true })

/** 生成分页器显示数组，包含页码和省略号标记 */
const pageArr = computed(() => genPageArr(page.value, props.totalPages, props.expandPages ?? 2))

const layoutStore = useLayoutStore()
const anchorEl = useTemplateRef('pagination-anchor')
const expand = useElementVisibility(anchorEl)

/** 挂载时设置页面位移（避免被 sticky 分页器遮挡） */
onMounted(() => {
	layoutStore.setTranslate('pagination', '0, -2em')
})

/** 卸载时清除页面位移 */
onUnmounted(() => {
	layoutStore.setTranslate('pagination', '')
})
</script>

<template>
<nav
	class="pagination"
	:class="{ sticky, expand }"
	:aria-label="`第${page}页，共${totalPages}页`"
	:style="{ '--collapsed-width': `${pageArr.length * 2 + 6}em` }"
>
	<ZButton
		:disabled="page <= 1"
		class="pagination-button rtl-flip"
		icon="ph:arrow-fat-left-duotone"
		aria-label="上一页"
		@click="page--"
	/>
	<template v-for="i in pageArr" :key="i">
		<button
			v-if="Number.isFinite(i)"
			class="pagination-num"
			:class="{ active: i === page }"
			:aria-label="`第${i}页`"
			@click="page = i"
			v-text="i"
		/>
		<!-- TODO: 点击后自主选择目标页面 -->
		<button v-else disabled class="pagination-num">
			…
		</button>
	</template>
	<ZButton
		:disabled="page >= totalPages"
		class="pagination-button rtl-flip"
		icon="ph:arrow-fat-right-duotone"
		aria-label="下一页"
		@click="page++"
	/>
</nav>
<div ref="pagination-anchor" />
</template>

<style lang="scss" scoped>
.pagination {
	display: flex;
	max-width: calc(100vw);
	margin: 1rem auto;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	box-shadow: var(--box-shadow-1);
	background-color: var(--ld-bg-card);
	transition: max-width 0.2s var(--max-bezier-to-full);
	font-variant-numeric: tabular-nums;

	&.sticky {
		position: sticky;
		bottom: min(2em, 5%);

		&:not(.expand) {
			max-width: var(--collapsed-width);
			transition-timing-function: var(--max-bezier-to-collapse);
		}
	}

	> .pagination-button {
		border: none;
		border-radius: 0;
		box-shadow: none;

		&:first-child {
			margin-inline-end: auto;
			border-radius: 0.5rem 0 0 0.5rem;
		}

		&:last-child {
			margin-inline-start: auto;
			border-radius: 0 0.5rem 0.5rem 0;
		}
	}

	> .pagination-num {
		width: 3em;
		transition: background-color 0.2s;

		&:hover { background-color: var(--c-border); }

		&:disabled { pointer-events: none; }

		&.active {
			background-color: var(--c-primary-soft);
			color: var(--c-primary);
		}
	}
}
</style>
