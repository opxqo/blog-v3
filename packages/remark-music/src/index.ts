/**
 * Remark 插件：音乐乐谱解析
 *
 * 解析 music-abc 代码块，转换为乐谱组件
 */
import type { Parent, Root } from 'mdast'
import { visit } from 'unist-util-visit'

interface MusicScoreCodeBlock extends Parent {
	type: 'musicScoreCodeBlock'
}

declare module 'mdast' {
	interface RootContentMap {
		musicScoreCodeBlock: MusicScoreCodeBlock
	}
}

export default function remarkMusic() {
	return (tree: Root) => {
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang === 'music-abc') {
				if (!parent || index === undefined)
					return

				parent.children?.splice(index, 1, {
					type: 'musicScoreCodeBlock',
					children: [],
					data: {
						hName: 'music-score',
						hProperties: {
							abc: node.value,
						},
					},
				})
			}
		})
	}
}
