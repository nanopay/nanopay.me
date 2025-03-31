import NotFoundImage from '@/images/not-found.svg'
import Image from 'next/image'
import { SUPPORT_EMAIL } from '@/core/constants'
import { AdminClient } from '@/core/client'
import { getLatestPrice } from '@/services/coinmarketcap'
import { unstable_noStore } from 'next/cache'
import { Viewport } from 'next'
import colors from 'tailwindcss/colors'
import { InvoicePayCard } from '@/components/InvoicePayCard'

export const viewport: Viewport = {
	themeColor: colors.slate[800],
}

interface InvoicePageProps {
	params: Promise<{
		sponsorshipId: string
	}>
}

export default async function InvoicePage(props: InvoicePageProps) {
    const params = await props.params;

    const {
        sponsorshipId
    } = params;

    unstable_noStore()

    const client = new AdminClient()

    const [sponsorship, { price: xnoToUsd }] = await Promise.all([
		client.sponsors.get(sponsorshipId),
		getLatestPrice().catch(() => ({
			price: null,
		})),
	])

    if (!sponsorship) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<Image
						src={NotFoundImage}
						alt="Not found"
						className="mx-auto mb-4 h-80 w-80"
					/>
					<h1 className="mb-4 text-2xl font-bold">Sponsorship not found</h1>
					<p className="text-slate-500">
						The sponsorship you are looking for does not exist.
					</p>
					<div className="hover:text-nano mt-16 text-sm text-slate-500">
						<a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
					</div>
				</div>
			</div>
		)
	}

    return (
		<InvoicePayCard
			invoice={sponsorship.invoice}
			xnoToUsd={xnoToUsd}
			autoRedirectOnPay
			fireworks
		/>
	)
}
