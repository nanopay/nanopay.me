import { Slider } from '@mui/material'
import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'

interface ImageCropProps {
	source: string
	onConfirm?: (file: File) => void
	onCancel?: () => void
}

export const ImageCrop = ({ source, onConfirm, onCancel }: ImageCropProps) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1.5)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

	const rotation = 0

	const onCropComplete = useCallback(
		(croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels)
		},
		[],
	)

	const createImage = (url: string) =>
		new Promise((resolve, reject) => {
			const image = new Image()
			image.addEventListener('load', () => resolve(image))
			image.addEventListener('error', error => reject(error))
			image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
			image.src = url
		})

	function getRadianAngle(degreeValue: number) {
		return (degreeValue * Math.PI) / 180
	}

	/**
	 * Returns the new bounding area of a rotated rectangle.
	 */
	function rotateSize(width: number, height: number, rotation: number) {
		const rotRad = getRadianAngle(rotation)

		return {
			width:
				Math.abs(Math.cos(rotRad) * width) +
				Math.abs(Math.sin(rotRad) * height),
			height:
				Math.abs(Math.sin(rotRad) * width) +
				Math.abs(Math.cos(rotRad) * height),
		}
	}

	async function getCroppedImg(
		imageSrc: string,
		pixelCrop: Area,
		rotation = 0,
		flip = { horizontal: false, vertical: false },
	): Promise<File> {
		return new Promise(async (resolve, reject) => {
			const image: any = await createImage(imageSrc)
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				return reject('Canvas is not supported')
			}

			const rotRad = getRadianAngle(rotation)

			// calculate bounding box of the rotated image
			const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
				image.width,
				image.height,
				rotation,
			)

			// set canvas size to match the bounding box
			canvas.width = bBoxWidth
			canvas.height = bBoxHeight

			// translate canvas context to a central location to allow rotating and flipping around the center
			ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
			ctx.rotate(rotRad)
			ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
			ctx.translate(-image.width / 2, -image.height / 2)

			// draw rotated image
			ctx.drawImage(image, 0, 0)

			// croppedAreaPixels values are bounding box relative
			// extract the cropped image using these values
			const data = ctx.getImageData(
				pixelCrop.x,
				pixelCrop.y,
				pixelCrop.width,
				pixelCrop.height,
			)

			// set canvas width to final desired crop size - this will clear existing context
			canvas.width = pixelCrop.width
			canvas.height = pixelCrop.height

			// paste generated rotate image at the top left corner
			ctx.putImageData(data, 0, 0)

			// As Base64 string
			// return canvas.toDataURL('image/jpeg');

			// As a blob
			canvas.toBlob(file => {
				resolve(file as File)
			}, 'image/jpeg')
		})
	}

	const showCroppedImage = useCallback(async () => {
		try {
			const croppedImage = await getCroppedImg(
				source,
				croppedAreaPixels as Area,
				rotation,
			)
			onConfirm && onConfirm(croppedImage)
		} catch (e) {
			console.error(e)
		}
	}, [croppedAreaPixels, rotation])

	return (
		<div className="safe-h-screen fixed inset-0 z-40 flex w-full items-center justify-center bg-black/90">
			<div className="relative h-4/5 w-full rounded bg-white">
				<div
					className="crop-container"
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: '100px',
					}}
				>
					<Cropper
						image={source}
						crop={crop}
						zoom={zoom}
						aspect={1}
						onCropChange={setCrop}
						onCropComplete={onCropComplete}
						onZoomChange={setZoom}
						cropShape="round"
						showGrid={false}
					/>
				</div>
				<div
					style={{
						position: 'absolute',
						bottom: 0,
						left: '50%',
						width: '70%',
						transform: 'translateX(-50%)',
						height: '100px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Slider
						value={zoom}
						min={1}
						max={3}
						step={0.1}
						aria-labelledby="Zoom"
						onChange={(e, zoom) => setZoom(zoom as number)}
						style={{
							padding: '22px 0px',
						}}
					/>
					<div className="flex w-full justify-around">
						<button
							onClick={onCancel}
							className="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-800"
						>
							Cancelar
						</button>
						<button
							onClick={showCroppedImage}
							className="rounded border border-green-400 bg-green-200 px-4 py-2 text-green-800"
						>
							Confirmar
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
