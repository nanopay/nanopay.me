import Image from 'next/image'
import Link from 'next/link'

import MailSentSvg from '@/images/mail-sent.svg'

export default function VerifyEmail({
	searchParams,
}: {
	searchParams: { email: string }
}) {
	return (
		<div className="flex w-full flex-col divide-y divide-slate-200 px-2 sm:px-4">
			<div className="w-full border-t border-slate-200 py-6">
				<h1 className="text-2xl font-semibold text-slate-900">
					Verify your Email
				</h1>
				<p className="text-base font-medium text-slate-600">
					We sent you an email to <strong>{searchParams.email}</strong> with a
					magic link to sign in.
				</p>
				<div className="flex w-full justify-center">
					<Image
						width={250}
						height={250}
						src={MailSentSvg}
						alt="email sent art"
					/>
				</div>
				<p className="text-sm font-medium text-slate-600">
					Please also check your spam box.
				</p>
			</div>
			<div className="flex flex-col items-center py-6">
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
