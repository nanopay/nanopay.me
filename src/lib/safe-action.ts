import { createSafeActionClient, SafeActionResult } from 'next-safe-action'
import { Schema } from 'next-safe-action/adapters/types'

export const safeAction = createSafeActionClient({
	async handleServerError(error) {
		let message = 'Unknown error'

		if (error instanceof Error) {
			message = error.message
		}

		throw new Error(message)
	},
})

export type SafeActionErrorType =
	| 'serverError'
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
	error: Omit<SafeActionResult<ServerError, S, BAS, CVE, CBAVE, Data>, 'data'>,
): UseActionError => {
	if (error.serverError) {
		return {
			type: 'serverError',
			message: error.serverError as string,
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
