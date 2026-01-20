<script setup lang="ts">
/**
 * 文章详情页（动态路由）
 *
 * 根据 slug 动态加载文章内容
 * 包含文章正文、评论、目录等
 */
const route = useRoute()

const layoutStore = useLayoutStore()
layoutStore.setAside(['toc'])

const { data: post } = await useAsyncData(
	route.path,
	() => queryCollection('content').path(route.path).first(),
)

const contentStore = useContentStore()
const { toc, meta } = storeToRefs(contentStore)

const excerpt = computed(() => post.value?.description || '')

/** 设置目录和元信息到 content store */
function setTocAndMeta() {
	toc.value = post.value?.body.toc
	meta.value = post.value?.meta
}

setTocAndMeta()

if (post.value) {
	useSeoMeta({
		title: post.value.title,
		ogType: 'article',
		ogImage: post.value.image,
		description: post.value.description,
	})
	layoutStore.setAside(post.value.meta?.aside as WidgetName[] | undefined)
}
else {
	const event = useRequestEvent()
	event && setResponseStatus(event, 404)
	route.meta.title = '404'
	layoutStore.setAside(['blog-log'])
}

if (import.meta.dev) {
	watchEffect(() => {
		setTocAndMeta()
		layoutStore.setAside(post.value?.meta?.aside as WidgetName[] | undefined)
	})
}
</script>

<template>
<template v-if="post">
	<PostHeader v-bind="post" />
	<PostExcerpt v-if="excerpt" :excerpt />
	<!-- 使用 float-in 动画会导致搜索跳转不准确 -->
	<ContentRenderer
		class="article"
		:class="getPostTypeClassName(post?.type, { prefix: 'md' })"
		:value="post"
		tag="article"
	/>

	<PostFooter v-bind="post" />
	<PostSurround />
	<PostComment />
</template>

<ZError
	v-else
	icon="solar:confounded-square-bold-duotone"
	title="内容为空或页面不存在"
/>
</template>
