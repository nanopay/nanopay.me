import { useState } from 'react'

export const uploadFileWithXHR = async (
	file: File,
	url: string,
	progressCallback?: (progress: number) => void,
): Promise<{ url: string }> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', url, true)

		xhr.upload.onprogress = function (event) {
			if (progressCallback && event.lengthComputable) {
				const percentComplete = (event.loaded / event.total) * 100
				progressCallback(percentComplete)
			}
		}

		xhr.onload = function () {
			if (xhr.status === 201) {
				try {
					const response = JSON.parse(xhr.responseText)
					const url = response.url
					new URL(url)
					resolve({ url })
				} catch (error) {
					reject('Error uploading file. Invalid response')
				}
			} else {
				reject('Error uploading file. Status: ' + xhr.status)
			}
		}

		xhr.onerror = function () {
			reject('Error uploading file. Check your network connection.')
		}

		const formData = new FormData()
		formData.append('file', file)

		xhr.send(formData)
	})
}

export type UploaderOptions = {
	onSuccess?: (url: string) => void
	onError?: (message: string) => void
	onUploading?: (bool: boolean) => void
}

export const useUploader = (apiUrl: string, options: UploaderOptions = {}) => {
	const [isUploading, setIsUploading] = useState(false)
	const [isError, setIsError] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [progress, setProgress] = useState(0)

	const reset = () => {
		setIsUploading(false)
		setIsError(false)
		setIsSuccess(false)
		setProgress(0)
	}

	return {
		upload: async (image: File): Promise<void> => {
			reset()
			setIsUploading(true)
			try {
				await uploadFileWithXHR(image, apiUrl, setProgress)
				setIsSuccess(true)
				if (options.onSuccess) {
					options.onSuccess(apiUrl)
				}
				if (options.onUploading) {
					options.onUploading(true)
				}
			} catch (error) {
				setIsError(true)
				if (options.onError) {
					options.onError(
						error instanceof Error ? error.message : 'Unknown error',
					)
				}
			} finally {
				setIsUploading(false)
				if (options.onUploading) {
					options.onUploading(false)
				}
			}
		},
		isUploading,
		isSuccess,
		isError,
		progress,
	}
}

export const useServiceAvatarUploader = (
	serviceNameOrId: string,
	options: UploaderOptions,
) => {
	return useUploader(`/${serviceNameOrId}/avatar`, options)
}

export const useUserAvatarUploader = (options: UploaderOptions) => {
	return useUploader(`/profile/avatar`, options)
}
