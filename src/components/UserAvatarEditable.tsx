'use client'

import { useToast } from '@/hooks/useToast'
import ImageInput from './ImageInput'
import { ALLOWED_IMAGE_TYPES, DEFAULT_AVATAR_URL } from '@/constants'
import { useUserAvatarUploader } from '@/hooks/useUploader'

export interface ServiceAvatarEditableProps {
	src?: string | null
	size?: number
	alt?: string
	onChange?: (url: string) => void
	onUploading?: (bool: boolean) => void
}

export function UserAvatarEditable({
	src,
	size = 98,
	alt = 'User Avatar',
	onChange,
	onUploading,
}: ServiceAvatarEditableProps) {
	const { showError } = useToast()

	const { upload, isUploading, progress, isError } = useUserAvatarUploader({
		onSuccess: onChange,
		onUploading,
		onError: showError,
	})

	return (
		<ImageInput
			src={src || DEFAULT_AVATAR_URL}
			crop={true}
			onChange={upload}
			isLoading={isUploading}
			isError={isError}
			progress={progress}
			width={size}
			height={size}
			alt={alt}
			acceptTypes={ALLOWED_IMAGE_TYPES}
		/>
	)
}
