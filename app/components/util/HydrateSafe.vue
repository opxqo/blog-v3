<!--
	水合安全组件

	用于包裹客户端独有的响应式内容，避免 SSG/SSR 水合不匹配错误
	在 SSG 模式下，客户端会抛弃预渲染结果重新进行 CSR 渲染

	适用场景：
	- 随机内容
	- 依赖客户端 API 的内容
	- 容易导致水合不匹配的动态内容
-->
<template>
<ClientOnly>
	<slot />

	<template #fallback>
		<slot />
	</template>
</ClientOnly>
</template>
