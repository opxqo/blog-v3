<script setup lang="ts">
/**
 * 日期显示组件
 *
 * 智能日期展示，支持相对时间和绝对时间切换
 * 自动根据时间差选择最佳展示方式（1周内显示相对时间）
 * 鼠标悬停显示完整的本地化日期时间
 */
import { differenceInWeeks, isSameYear } from 'date-fns'

const props = withDefaults(defineProps<{
	/** 日期图标 */
	icon?: string
	/** ISO 8601 格式的日期字符串 */
	date: string
	/** 强制使用绝对时间格式 */
	absolute?: boolean
	/** 强制使用相对时间格式 */
	relative?: boolean
	/** 图标和文本之间是否有空格 */
	nospace?: boolean
	/** Tooltip 前缀文本 */
	tipPrefix?: string
}>(), {
	tipPrefix: '',
})

const datetime = computed(() => toZonedDate(props.date))

/** 是否使用相对时间（未设置 absolute 且时间差小于1周或设置了 relative） */
const relative = computed(() => props.absolute
	? false
	: props.relative || Math.abs(differenceInWeeks(Date.now(), datetime.value)) < 1,
)

const mounted = ref(false)
/** 挂载后才显示 tooltip（避免 SSR/SSG 水合问题） */
const tooltip = computed(() => mounted.value ? `${props.tipPrefix}${getLocaleDatetime(datetime.value)}` : undefined)

onMounted(() => mounted.value = true)
</script>

<template>
<span :title="tooltip">
	<Icon v-if="icon" :name="icon" />
	<template v-if="icon && !nospace">&nbsp;</template>

	<span v-if="Number.isNaN(datetime.getTime())" v-text="datetime" />
	<!-- Invalid Date 传入 NuxtTime 组件或 .toISOString() 会报错 -->
	<NuxtTime
		v-else
		:datetime
		:relative
		:year="isSameYear(Date.now(), datetime) ? undefined : '2-digit'"
		month="long"
		day="numeric"
		numeric="auto"
	/>
</span>
</template>
