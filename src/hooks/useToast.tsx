import { toast, ToastOptions } from 'react-toastify'

const DEFAULT_OPTIONS: ToastOptions = {
	position: 'bottom-center',
	autoClose: 15000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: 'light',
}

const Msg = ({
	title,
	description,
}: {
	title: string
	description?: string
}) => (
	<div>
		<h2 className="text-md text-semibold text-slate-600">{title}</h2>
		{description && <p className="text-sm text-slate-500">{description}</p>}
	</div>
)

export const useToast = () => {
	const showSuccess = (
		title: string,
		description?: string,
		options?: ToastOptions,
	) => {
		toast.success(<Msg title={title} description={description} />, {
			...DEFAULT_OPTIONS,
			autoClose: 5000,
			...options,
		})
	}

	const showError = (
		title: string,
		description?: string,
		options?: ToastOptions,
	) => {
		toast.error(<Msg title={title} description={description} />, {
			...DEFAULT_OPTIONS,
			...options,
		})
	}

	const showInfo = (
		title: string,
		description?: string,
		options?: ToastOptions,
	) => {
		toast.info(<Msg title={title} description={description} />, {
			...DEFAULT_OPTIONS,
			...options,
		})
	}

	const showWarning = (
		title: string,
		description?: string,
		options?: ToastOptions,
	) => {
		toast.warning(<Msg title={title} description={description} />, {
			...DEFAULT_OPTIONS,
			...options,
		})
	}

	return { showSuccess, showError, showInfo, showWarning }
}
