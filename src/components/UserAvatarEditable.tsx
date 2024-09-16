'use client'

import { useToast } from '@/hooks/useToast'
import ImageInput from './ImageInput'
import { DEFAULT_AVATAR_URL } from '@/core/constants'
import { useUserAvatarUploader } from '@/hooks/useUploader'

export interface ServiceAvatarEditableProps {
	src?: string | null
	size?: number
	alt?: string
	isLoading?: boolean
	onChange?: (url: string) => void
	onUploading?: (bool: boolean) => void
}

export function UserAvatarEditable({
	src,
	size = 98,
	alt = 'User Avatar',
	isLoading,
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
			isLoading={isUploading || isLoading}
			isError={isError}
			progress={progress}
			width={size}
			height={size}
			alt={alt}
		/>
	)
}
