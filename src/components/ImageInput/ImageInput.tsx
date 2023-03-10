import { useEffect, useRef, useState } from 'react'
import { CameraIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { ImageCrop } from './ImageCrop'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import clsx from 'clsx'

interface ImageInputProps {
	source: string
	onChange?: (file: File) => void
	isLoading?: boolean
	isError?: boolean
	className?: string
	icon?: React.ReactNode
	crop?: boolean
	progress?: number
}

export function ImageInput({
	source,
	onChange,
	className,
	isLoading,
	isError,
	icon,
	crop = false,
	progress = 0,
}: ImageInputProps) {
	const [imageSource, setImageSource] = useState<string>(source)
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
				accept="image/png,image/jpeg,image/jpg,image/webp"
			/>
			<div
				className={clsx(
					'group relative h-32 w-32 cursor-pointer rounded-full',
					progress ? '' : isError ? 'border-2 border-red-400' : '',
					className,
				)}
				onClick={handleInputClick}
			>
				<img
					src={imageSource}
					alt="Imagem Perfil"
					className={clsx(
						'h-full w-full rounded-full',
						isLoading && 'animate-pulse',
					)}
				/>
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
				<div className="absolute right-2 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 group-hover:bg-gray-200">
					{isLoading ? (
						<div className="h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-gray-400"></div>
					) : isError ? (
						<ExclamationCircleIcon className="h-6 w-6 text-red-400" />
					) : (
						icon || <CameraIcon className="h-5 w-5 text-gray-400" />
					)}
				</div>
			</div>
			{imageToCrop !== null && (
				<ImageCrop
					source={imageToCrop}
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
