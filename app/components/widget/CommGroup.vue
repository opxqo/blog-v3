<template>
<!-- TODO: 配置你自己的社群信息，或删除此组件 -->
<!--
<BlogWidget
	card
	dim
	title="交流社区"
	bg-img="/community-bg.png"
	bg-right
>
	<div class="title text-creative">
		社区名称
	</div>

	<Tip copy icon :tip-options="{ placement: 'left' }">
		<Icon name="ri:qq-fill" />你的QQ群号
	</Tip>
</BlogWidget>
-->
</template>

<style lang="scss" scoped>
.title {
	background-clip: text;
	background-image: linear-gradient(60deg, var(--c-accent) -30%, var(--c-primary), var(--c-text-1));
	background-position: 100% 0;
	background-size: 200%;
	font-size: 1.8em;
	font-weight: 800;
	letter-spacing: 0.05em;
	color: transparent;
	transition: background-position 0.2s;

	.blog-widget:hover & {
		background-position: 0 0;
	}
}

.tip {
	font-size: 0.9em;
	line-height: 2;
}

:deep(.bg-img).bg-img.bg-img {
	opacity: 0.5;
}
</style>
