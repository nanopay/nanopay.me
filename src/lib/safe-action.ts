import { Schema } from '@typeschema/main'
import { createSafeActionClient } from 'next-safe-action'
import { HookResult } from 'next-safe-action/hooks'

export const safeAction = createSafeActionClient({
	async handleReturnedServerError(error) {
		let message = 'Erro desconhecido'

		if (error instanceof Error) {
			message = error.message
		}

		return message
	},
})

export type SafeActionErrorType =
	| 'serverError'
	| 'fetchError'
	| 'validationErrors'
	| 'bindArgsValidationErrors'
	| 'unknownError'

export interface UseActionError {
	type: SafeActionErrorType
	message: string
}

export const getSafeActionError = <
	ServerError,
	S extends Schema | undefined,
	BAS extends readonly Schema[],
	CVE,
	CBAVE,
	Data,
>(
	error: Omit<HookResult<ServerError, S, BAS, CVE, CBAVE, Data>, 'data'>,
): UseActionError => {
	if (error.serverError) {
		return {
			type: 'serverError',
			message: error.serverError as string,
		}
	}
	if (error.fetchError) {
		return {
			type: 'fetchError',
			message: error.fetchError,
		}
	}
	if (error.validationErrors) {
		console.error('Validation Error', error.validationErrors)
		return {
			type: 'validationErrors',
			message: 'Validation error, check logs for more info',
		}
	}
	if (error.bindArgsValidationErrors) {
		console.error('Bind Args Validation Error', error.bindArgsValidationErrors)
		return {
			type: 'bindArgsValidationErrors',
			message: 'Validation error, check logs for more info',
		}
	}
	return { type: 'unknownError', message: 'Tente novamente mais tarde' }
}
