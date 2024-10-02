import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { ImageType, ResizeProps, getCroppedImg } from './ImageCropUtils'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/Button'
import { XIcon } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

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
	}, [croppedAreaPixels, onConfirm, resize, source, type])

	return (
		<Dialog open={true}>
			<DialogContent className="flex h-full w-full max-w-3xl flex-1 flex-col gap-0 overflow-hidden border-0 p-0 md:h-[70%]">
				<DialogHeader className="flex flex-row items-center justify-between gap-2 p-2">
					<div className="flex w-20 justify-start">
						<DialogClose onClick={onCancel}>
							<XIcon className="h-8 w-8 rounded-full bg-slate-200 p-1 text-slate-700" />
						</DialogClose>
					</div>

					<DialogTitle className="!m-0 text-base font-medium text-slate-700">
						Edit image
					</DialogTitle>

					<Button
						type="button"
						onClick={showCroppedImage}
						className="!m-0 w-20 font-medium text-white"
						size="sm"
					>
						Save
					</Button>
				</DialogHeader>
				<div
					className="relative flex w-full flex-1 flex-col rounded bg-white"
					aria-label="crop-container"
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
				<DialogFooter className="w-full bg-white/60">
					<div className="flex w-full flex-col items-end p-6">
						<Slider
							defaultValue={[zoom]}
							min={1}
							max={3}
							step={0.1}
							aria-labelledby="Zoom"
							onValueChange={([newZoom]) => setZoom(newZoom)}
							className="text-nano"
						/>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
