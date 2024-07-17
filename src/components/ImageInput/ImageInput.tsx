import { useEffect, useRef, useState } from 'react'
import ImageCrop from './ImageCrop'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { AlertTriangleIcon, CameraIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/cn'

const ALLOWED_IMAGE_TYPES = [
	'image/png',
	'image/jpeg',
	'image/jpg',
	'image/webp',
]

interface ImageInputProps {
	src?: string | null
	onChange?: (file: File) => void
	isLoading?: boolean
	isError?: boolean
	className?: string
	icon?: React.ReactNode
	crop?: boolean
	progress?: number
	alt?: string
	width?: number
	height?: number
}

export function ImageInput({
	src,
	onChange,
	className,
	isLoading,
	isError,
	icon,
	crop = false,
	progress = 0,
	width = 128,
	height = 128,
	alt = 'Input Image',
}: ImageInputProps) {
	const [imageSource, setImageSource] = useState<string | null>(src || null)
	const [imageToCrop, setImageToCrop] = useState<string | null>(null)
	const [resetProgress, setResetProgress] = useState(0)
	const [localProgress, setLocalProgress] = useState(0)

	const hiddenFileInput = useRef<HTMLInputElement | null>(null)

	const onSelectedImage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0]
		if (selectedFile) {
			if (crop) {
				setImageToCrop(URL.createObjectURL(selectedFile))
			} else {
				setImageSource(URL.createObjectURL(selectedFile))
				onChange && onChange(selectedFile)
			}
		}
		if (hiddenFileInput.current) {
			hiddenFileInput.current.value = ''
		}
	}
	const handleInputClick = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) => {
		if (!hiddenFileInput.current) return
		hiddenFileInput.current.click()
		event.stopPropagation()
	}

	useEffect(() => {
		if (progress > 0) {
			setLocalProgress(progress)
		}
	}, [progress])

	useEffect(() => {
		if (progress === 100) {
			setTimeout(() => {
				const interval = setInterval(() => {
					setResetProgress(prev => {
						if (prev === 100) {
							setLocalProgress(0)
							clearInterval(interval)
							setTimeout(() => {
								setResetProgress(0)
							}, 1000)
							return prev
						}
						return prev + 10
					})
				}, 50)
			}, 1000)
		}
	}, [progress])

	return (
		<>
			<input
				ref={hiddenFileInput}
				style={{ display: 'none' }}
				type="file"
				name="image"
				onChange={onSelectedImage}
				accept={ALLOWED_IMAGE_TYPES.join(',')}
			/>
			<div
				className={cn(
					'group relative cursor-pointer rounded-full bg-slate-200',
					progress ? '' : isError ? 'border-2 border-red-400' : '',
					className,
				)}
				style={{
					width: width,
					height: height,
				}}
				onClick={handleInputClick}
			>
				{imageSource && (
					<Image
						src={imageSource}
						alt={alt}
						width={width}
						height={height}
						className={cn(
							'h-full w-full rounded-full',
							isLoading && 'animate-pulse',
						)}
					/>
				)}
				<div className="absolute inset-0 -m-0.5">
					<CircularProgressbar
						value={localProgress}
						strokeWidth={2}
						styles={buildStyles({
							trailColor: '#cbd5e1',
							pathColor: '#64748b',
						})}
					/>
				</div>
				{resetProgress > 0 && (
					<div className="absolute inset-0 -m-0.5">
						<CircularProgressbar
							value={resetProgress}
							strokeWidth={2}
							styles={buildStyles({
								trailColor: '#64748b',
								pathColor: '#cbd5e1',
							})}
						/>
					</div>
				)}
				<div
					className="absolute bottom-0 right-1 flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 group-hover:bg-slate-200"
					style={{
						width: width / 3.33,
						height: height / 3.33,
					}}
				>
					{isLoading ? (
						<div className="h-1/2 w-1/2 animate-spin rounded-full border-b-2 border-t-2 border-slate-400"></div>
					) : isError ? (
						<AlertTriangleIcon className="h-2/3 w-2/3 text-red-400" />
					) : (
						icon || <CameraIcon className="h-3/4 w-3/4 text-slate-400" />
					)}
				</div>
			</div>
			{imageToCrop !== null && (
				<ImageCrop
					source={imageToCrop}
					type="png"
					resize={{ width: 300, height: 300 }}
					onCancel={() => setImageToCrop(null)}
					onConfirm={croppedImage => {
						setImageToCrop(null)
						setImageSource(URL.createObjectURL(croppedImage))
						onChange && onChange(croppedImage)
					}}
				/>
			)}
		</>
	)
}
