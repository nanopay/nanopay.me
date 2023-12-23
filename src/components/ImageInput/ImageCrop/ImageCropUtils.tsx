import { Area } from 'react-easy-crop'

export interface ResizeProps {
	width: number
	height: number
}

export type ImageType = 'png' | 'jpg' | 'jpeg'

export function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.addEventListener('load', () => resolve(image))
		image.addEventListener('error', error => reject(error))
		image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
		image.src = url
	})
}

export async function createCroppedCanvas(
	image: HTMLImageElement,
	pixelCrop: Area,
): Promise<HTMLCanvasElement> {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	if (!ctx) {
		throw new Error('Canvas is not supported')
	}

	canvas.width = image.width
	canvas.height = image.height

	ctx.drawImage(image, 0, 0)

	const croppedCanvas = document.createElement('canvas')
	const croppedCtx = croppedCanvas.getContext('2d')

	if (!croppedCtx) {
		throw new Error('Failed getting context 2d')
	}

	croppedCanvas.width = pixelCrop.width
	croppedCanvas.height = pixelCrop.height

	croppedCtx.drawImage(
		canvas,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	)

	return croppedCanvas
}

export function resizeImage(
	croppedCanvas: HTMLCanvasElement,
	resize: ResizeProps,
): HTMLCanvasElement {
	const oc = document.createElement('canvas')
	const octx = oc.getContext('2d')

	if (!octx) {
		throw new Error('Failed getting context 2d')
	}

	oc.width = resize.width
	oc.height = resize.height

	octx.drawImage(
		croppedCanvas,
		0,
		0,
		croppedCanvas.width,
		croppedCanvas.height,
		0,
		0,
		resize.width,
		resize.height,
	)

	return oc
}

export async function getCroppedImg({
	imageSrc,
	pixelCrop,
	type,
	resize,
}: {
	imageSrc: string
	pixelCrop: Area
	type: ImageType
	resize?: ResizeProps
}): Promise<File> {
	const image = await createImage(imageSrc)
	const croppedCanvas = await createCroppedCanvas(image, pixelCrop)

	const final = resize ? resizeImage(croppedCanvas, resize) : croppedCanvas

	return new Promise(resolve => {
		final.toBlob(file => {
			resolve(file as File)
		}, `image/${type}`)
	})
}
