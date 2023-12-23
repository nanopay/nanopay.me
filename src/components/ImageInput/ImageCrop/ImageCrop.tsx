import { Slider } from '@mui/material'
import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { ImageType, ResizeProps, getCroppedImg } from './ImageCropUtils'

export interface ImageCropProps {
	source: string
	type: ImageType
	resize?: ResizeProps
	onConfirm?: (file: File) => void
	onCancel?: () => void
}

export default function ImageCrop({
	source,
	type,
	resize,
	onConfirm,
	onCancel,
}: ImageCropProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1.5)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

	const onCropComplete = useCallback(
		(croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels)
		},
		[],
	)

	const showCroppedImage = useCallback(async () => {
		try {
			const croppedImage = await getCroppedImg({
				imageSrc: source,
				pixelCrop: croppedAreaPixels as Area,
				type,
				resize,
			})
			onConfirm && onConfirm(croppedImage)
		} catch (e) {
			console.error(e)
		}
	}, [croppedAreaPixels])

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
							type="button"
							onClick={onCancel}
							className="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-800"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={showCroppedImage}
							className="rounded border border-green-400 bg-green-200 px-4 py-2 text-green-800"
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
