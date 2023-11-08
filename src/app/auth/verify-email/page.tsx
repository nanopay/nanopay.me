import Image from 'next/image'
import Link from 'next/link'

import MailSentSvg from '@/images/mail-sent.svg'

export default function VerifyEmail() {
	return (
		<div className="w-full flex flex-col px-2 sm:px-4 divide-y divide-slate-200">
			<div className="py-6 w-full border-t border-slate-200">
				<h1 className="text-2xl font-semibold text-slate-900">
					Verify your Email
				</h1>
				<p className="text-base font-medium text-slate-600">
					We sent you an email with a magic link to sign in.
				</p>
				<div className="w-full flex justify-center">
					<Image
						width={250}
						height={250}
						src={MailSentSvg}
						alt="email sent art"
					/>
				</div>
			</div>
			<div className="py-6 flex flex-col items-center">
				<h2 className="text-base font-semibold text-slate-600">
					Back to{' '}
					<Link href="/login" className="text-nano underline">
						Login
					</Link>
				</h2>
			</div>
		</div>
	)
}
