<!--
	跳转到主要内容链接组件（无障碍访问）
	
	屏幕阅读器友好，Tab 键聚焦后按 Enter 可直接跳转到主要内容
-->
<template>
<!-- 若使用 NuxtLink 则键盘焦点不会切换 -->
<a href="#main-content" class="skip-link gradient-card active">
	跳转到主要内容 / Skip to content
</a>
</template>

<style lang="scss" scoped>
.skip-link {
	position: fixed;
	top: -100%;
	width: 80%;
	margin: 1rem;
	padding: 0.5rem;
	text-align: center;
	z-index: calc(infinity);
}

.skip-link:focus {
	top: auto;
}
</style>
