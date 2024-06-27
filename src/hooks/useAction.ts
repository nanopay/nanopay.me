import { ActionErrorResponse, ActionSuccessResponse } from '@/lib/handle-action'
import { useState, useTransition, useCallback } from 'react'

export type ActionError = {
	type: 'error'
	message: string
}

type Action<TArgs extends any[], TResult> = (
	...args: TArgs
) => Promise<ActionSuccessResponse<TResult> | ActionErrorResponse>

export interface UseActionOptions<TResult> {
	onError?: (error: ActionError) => void
	onSuccess?: (result: TResult) => void
	onSettled?: () => void
}

export interface UseActionReturn<TArgs extends any[], TResult> {
	data: TResult | null
	error: ActionError | null
	execute: (...args: TArgs) => Promise<void>
	isExecuting: boolean
	isSuccess: boolean
	isError: boolean
	isSettled: boolean
}

/**
 * Custom React hook for handling asynchronous actions with state management.
 * Executes a provided asynchronous function (`action`) and manages loading, success,
 * error states, and transitions using React's concurrent mode (`useTransition`).
 * Use with actions handled by handleAction.
 *
 * @template TArgs - The types of arguments expected by the action function.
 * @template TResult - The type of the result returned by the action function.
 *
 * @param {Action<TArgs, TResult>} action - The asynchronous action function to execute.
 * @param {UseActionOptions<TResult>} [options={}] - Optional configuration for error, success,
 *                                                  and settled state handlers.
 * @returns {UseActionReturn<TArgs, TResult>} An object containing state variables and an
 *                                           `execute` function to trigger the action.
 *
 * @example
 * // Basic usage:
 * const { data, error, execute, isExecuting, isSuccess, isError, isSettled } = useAction(myServerAction,
 *   {
 *     onError: (error) => console.error('Action failed:', error),
 *     onSuccess: (result) => console.log('Action succeeded with result:', result),
 *     onSettled: () => console.log('Action execution completed.'),
 *   }
 * );
 *
 * // Trigger the action:
 * execute('example', 123);
 */
export const useAction = <TArgs extends any[], TResult>(
	action: Action<TArgs, TResult>,
	options: UseActionOptions<TResult> = {},
): UseActionReturn<TArgs, TResult> => {
	const { onError, onSuccess, onSettled } = options
	const [data, setData] = useState<TResult | null>(null)
	const [error, setError] = useState<ActionError | null>(null)
	const [isSuccess, setIsSuccess] = useState(false)
	const [isError, setIsError] = useState(false)
	const [isSettled, setIsSettled] = useState(false)
	const [isPending, startTransition] = useTransition()

	const handleError = useCallback(
		(error: ActionError) => {
			setIsError(true)
			setError(error)
			if (onError) onError(error)
		},
		[onError],
	)

	const isErrorResult = (result: unknown) => {
		console.log('result', result, typeof result)
		return (
			result instanceof Object &&
			'_error' in result &&
			typeof result._error === 'string'
		)
	}

	const execute = useCallback(
		async (...args: TArgs) => {
			setIsSuccess(false)
			setIsError(false)
			setIsSettled(false)

			return new Promise<void>(async res => {
				startTransition(async () => {
					try {
						const result = await action(...args)
						console.log('result', result, isErrorResult(result))
						if (isErrorResult(result)) {
							return handleError({
								type: 'error',
								message: (result as any)._error,
							})
						}
						setData((result as ActionSuccessResponse<TResult>)._data)
						setIsSuccess(true)
						if (onSuccess)
							onSuccess((result as ActionSuccessResponse<TResult>)._data)
					} catch (error: unknown) {
						return handleError({
							type: 'error',
							message:
								error instanceof Error ? error.message : 'An error occurred',
						})
					} finally {
						setIsSettled(true)
						if (onSettled) onSettled()
						res()
					}
				})
			})
		},
		[action, onError, onSuccess, onSettled, startTransition],
	)

	return {
		data,
		error,
		execute,
		isExecuting: isPending,
		isSuccess,
		isError,
		isSettled,
	}
}
