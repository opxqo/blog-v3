<script setup lang="ts">
/**
 * 更新日志小组件
 *
 * 展示博客的重要更新记录
 */
const { timeEstablished } = useAppConfig()

const blogLog = [
	{ label: timeEstablished, value: '博客创建' },
]
</script>

<template>
<BlogWidget card title="更新日志">
	<ZDlGroup size="large" :items="blogLog" />
</BlogWidget>
</template>
