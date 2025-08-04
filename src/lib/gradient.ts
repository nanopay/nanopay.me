import color from 'tinycolor2'

export function djb2(str: string) {
	let hash = 5381
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) + hash + str.charCodeAt(i)
	}
	return hash
}

export function generateGradient(str: string) {
	const c1 = color({ h: djb2(str) % 360, s: 0.95, l: 0.5 })
	const second = c1.triad()[1].toHexString()

	return {
		fromColor: c1.toHexString(),
		toColor: second,
	}
}

export function generateGradientSvgDataUrl (str: string, size: number) {
	const gradient = generateGradient(str)
		
	const svgString = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" version="1.1" xmlns="http://www.w3.org/2000/svg" class="shrink-0 rounded-full">
			<defs>
				<linearGradient id="gradient-${str}" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stop-color="${gradient.fromColor}" />
					<stop offset="100%" stop-color="${gradient.toColor}" />
				</linearGradient>
			</defs>
			<rect fill="url(#gradient-${str})" x="0" y="0" width="${size}" height="${size}" />
		</svg>`
		
	return 'data:image/svg+xml,' + encodeURIComponent(svgString)
}
