/**
 * 彩蛋插件
 *
 * Konami Code：上上下下左右左右BA
 * 触发后切换文本方向（ltr/rtl）
 */
export default defineNuxtPlugin(() => {
	const dir = useTextDirection()
	const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
	let currentStep = 0

	function step(step: boolean, resetForward: boolean) {
		if (step === false) {
			currentStep = resetForward ? 1 : 0
			return
		}

		currentStep++

		if (currentStep === konamiCode.length) {
			dir.value = dir.value === 'ltr' ? 'rtl' : 'ltr'
			currentStep = 0
		}
	}

	useEventListener('keydown', ({ code }) => {
		step(code === konamiCode[currentStep], code === konamiCode[0])
	})
})
