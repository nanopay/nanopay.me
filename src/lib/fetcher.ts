export type FetcherGetParams = Record<string, string | number>

export type FetcherRequestData = Record<string, any> | any[]

export interface FetcherOptions extends Omit<RequestInit, 'body' | 'method'> {}

export default class Fetcher {
	baseUrl: string

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	private async request<R = any>(url: string, init?: RequestInit) {
		const options: RequestInit = {
			method: 'GET',
			credentials: 'include',
			...init,
			headers: {
				'Content-Type': 'application/json',
				...init?.headers,
			},
		}

		const response = await fetch(this.combineURLs(this.baseUrl, url), options)

		if (!response.ok) {
			let message = 'The server responded with an unexpected status.'
			try {
				const json = await response.json()
				if (json.message) {
					message = json.message
				}
			} catch {}
			throw new FetcherError(message, response)
		}

		const result: R = await response.json()

		return result
	}

	private objectToQueryString(obj: FetcherGetParams) {
		return Object.keys(obj)
			.map(key => key + '=' + obj[key])
			.join('&')
	}

	private combineURLs(baseURL: string, relativeURL: string) {
		return relativeURL
			? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
			: baseURL
	}

	get<R = any>(
		url: string,
		data?: FetcherGetParams | null,
		options?: FetcherOptions,
	) {
		return this.request<R>(
			data ? `${url}?${this.objectToQueryString(data)}` : url,
			options,
		)
	}

	post<R = any>(
		url: string,
		data?: FetcherRequestData | null,
		options?: FetcherOptions,
	) {
		return this.request<R>(url, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		})
	}

	put<R = any>(
		url: string,
		data: FetcherRequestData,
		options?: FetcherOptions,
	) {
		return this.request<R>(url, {
			...options,
			method: 'PUT',
			body: JSON.stringify(data),
		})
	}

	patch<R = any>(
		url: string,
		data: FetcherRequestData,
		options?: FetcherOptions,
	) {
		return this.request<R>(url, {
			...options,
			method: 'PATCH',
			body: JSON.stringify(data),
		})
	}

	delete<R = any>(url: string, options?: FetcherOptions) {
		return this.request<R>(url, {
			...options,
			method: 'DELETE',
		})
	}
}

export class FetcherError extends Error {
	name = 'FetcherError'
	status: number | null = null
	statusText: string | null = null

	constructor(message: string, response: Response) {
		super(message)
		if (response) {
			this.status = response.status
			this.statusText = response.statusText
		}
	}
}
