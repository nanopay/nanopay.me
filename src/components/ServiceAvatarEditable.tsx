'use client'

import { useToast } from '@/hooks/useToast'
import ImageInput from './ImageInput'
import { useServiceAvatarUploader } from '@/hooks/useUploader'

export interface ServiceAvatarEditableProps {
	id: string
	src?: string | null
	size?: number
	alt?: string
	onChange?: (url: string) => void
	onUploading?: (bool: boolean) => void
}

export function ServiceAvatarEditable({
	id,
	src,
	size = 98,
	alt = 'Service Avatar',
	onChange,
	onUploading,
}: ServiceAvatarEditableProps) {
	const { showError } = useToast()

	const { upload, isUploading, progress, isError } = useServiceAvatarUploader(
		id,
		{ onSuccess: onChange, onUploading, onError: showError },
	)

	return (
		<ImageInput
			src={src || `https://avatar.vercel.sh/${id}`}
			crop={true}
			onChange={upload}
			isLoading={isUploading}
			isError={isError}
			progress={progress}
			width={size}
			height={size}
			alt={alt}
		/>
	)
}
