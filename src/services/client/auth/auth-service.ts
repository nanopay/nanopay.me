import { SITE_URL } from '@/constants'
import { BaseService } from '../base-service'
import { signWithEmailAndPasswordSchema } from './auth-schemas'

export class AuthService extends BaseService {
	async signUpWithEmailAndPassword({
		email,
		password,
	}: {
		email: string
		password: string
	}) {
		signWithEmailAndPasswordSchema.parse({ email, password })
		const { data, error } = await this.supabase.auth.signUp({
			email,
			password,
		})
		if (error) {
			throw new Error(error.message)
		}
		return data
	}

	async signInWithEmailAndPassword({
		email,
		password,
	}: {
		email: string
		password: string
	}) {
		signWithEmailAndPasswordSchema.parse({ email, password })
		const { data, error } = await this.supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) {
			throw new Error(error.message)
		}
		return data
	}

	async signInWithGithub({
		next,
	}: {
		next?: string
	}): Promise<{ url: string }> {
		const redirectTo = new URL(SITE_URL)
		redirectTo.pathname = '/auth/callback'
		if (next) {
			redirectTo.searchParams.set('next', next)
		}

		const { data, error } = await this.supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: redirectTo.toString(),
			},
		})

		if (error) {
			throw new Error(error.message)
		}

		return data
	}

	async exchangeCodeForSession(code: string) {
		const { error } = await this.supabase.auth.exchangeCodeForSession(code)
		if (error) {
			throw new Error(error.message)
		}
	}

	async recoveryWithOtp(email: string, token: string) {
		const { data, error } = await this.supabase.auth.verifyOtp({
			email,
			token,
			type: 'recovery',
		})
		if (error) {
			throw new Error(error.message)
		}
		return data
	}

	async verifySignUpWithOtp(email: string, token: string) {
		const { data, error } = await this.supabase.auth.verifyOtp({
			email,
			token,
			type: 'signup',
		})
		if (error) {
			throw new Error(error.message)
		}
		return data
	}

	async sendMagicLink(email: string) {
		const { error } = await this.supabase.auth.signInWithOtp({ email })
		if (error) {
			throw new Error(error.message)
		}
	}

	async resetPasswordForEmail(email: string) {
		const { error } = await this.supabase.auth.resetPasswordForEmail(email)
		if (error) {
			throw new Error(error.message)
		}
	}

	async signOut() {
		const { error } = await this.supabase.auth.signOut()
		if (error) {
			throw new Error(error.message)
		}
	}
}
