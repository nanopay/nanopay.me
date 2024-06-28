import { isNotFoundError } from 'next/dist/client/components/not-found'
import { isRedirectError } from 'next/dist/client/components/redirect'

type ActionFunction<T> = (...args: any[]) => Promise<T>

export interface ActionErrorResponse {
	_error: string
}

export interface ActionSuccessResponse<T> {
	_data: T
}

/**
 * Handles execution and error handling for an asynchronous action function.
 * @param action The asynchronous action function to be handled.
 * @returns A function that, when called, executes the action function and handles any errors.
 */
export const handleAction =
	<T>(action: ActionFunction<T>) =>
	async (
		...args: any[]
	): Promise<ActionSuccessResponse<T> | ActionErrorResponse> => {
		try {
			const result = await action(...args)
			return { _data: result }
		} catch (error) {
			if (isRedirectError(error) || isNotFoundError(error)) {
				throw error
			}
			return {
				_error: error instanceof Error ? error.message : 'An error occurred',
			}
		}
	}
