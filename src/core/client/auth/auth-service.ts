import { BaseService } from '../base-service'
import { signWithEmailAndPasswordSchema, verifyOtpSchema } from './auth-schemas'
import { z } from 'zod'
import { VerifyOtp } from './auth-types'
import { SITE_URL } from '@/core/constants'

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
		redirectTo,
	}: {
		redirectTo?: string
	}): Promise<{ url: string }> {
		z.string().url().parse(redirectTo)
		const { data, error } = await this.supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: redirectTo,
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

	async verifyOtp({ email, token, type }: VerifyOtp) {
		verifyOtpSchema.parse({ email, token, type })
		const { data, error } = await this.supabase.auth.verifyOtp({
			email,
			token,
			type,
		})
		if (error) {
			throw new Error(error.message)
		}
		return data
	}

	async sendMagicLink(email: string) {
		const { error } = await this.supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${SITE_URL}/auth/callback?next=/`,
			},
		})
		if (error) {
			throw new Error(error.message)
		}
	}

	async resetPasswordForEmail(email: string) {
		const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${SITE_URL}/auth/callback?next=/change-password`,
		})
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
