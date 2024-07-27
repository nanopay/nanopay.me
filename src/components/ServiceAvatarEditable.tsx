'use client'

import ReactDOMServer from 'react-dom/server'
import { useToast } from '@/hooks/useToast'
import ImageInput from './ImageInput'
import { useServiceAvatarUploader } from '@/hooks/useUploader'
import { ReactNode } from 'react'
import { GradientAvatar } from './GradientAvatar'

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
			src={src || encodeSvg(<GradientAvatar uid={id} size={size} />)}
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

export function encodeSvg(reactElement: ReactNode): string {
	return (
		'data:image/svg+xml,' +
		encodeURIComponent(ReactDOMServer.renderToStaticMarkup(reactElement as any))
	)
}
