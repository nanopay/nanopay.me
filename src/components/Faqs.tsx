import { Container } from '@/components/Container'
import { CONTACT_EMAIL } from '@/core/constants'

const faqs = [
	[
		{
			question: 'Is there any fee or limit?',
			answer:
				'Like Nano, we have no fees. However, due to our limited resources, we are temporarily limiting our service to 100 invoices per day. With the development of new non-custodial strategies and support from funders, we will be able to increase these limits.',
		},
		{
			question: 'Which wallets are supported?',
			answer:
				'NanoPay.me supports any wallet capable of transferring Nano (XNO).',
		},
	],
	[
		{
			question: 'Is this custodial?',
			answer:
				"Yes and no... To ensure that different customers don't send Nano to the same address, a new account is created for each invoice. However, as soon as the transaction is detected, we send it to the merchant's wallet in less than ~2 seconds. Additionally, we are exploring non-custodial solutions such as non-hardened key derivations.",
		},

		{
			question: 'Where is NanoPay.me based?',
			answer:
				'On the internet! NanoPay.me is not a company, but a completely free and open-source community project with no headquarters.',
		},
	],
	[
		{
			question: 'Do my customers need sign in?',
			answer:
				'We do not require any form of identification from your customers. By default, we only save the wallet address used for sending. Each merchant is responsible for associating invoices with their customers through invoice metadata or with their own backend.',
		},
		{
			question: 'How to contribute?',
			answer:
				'You can help maintain the project by making donations, contributing code, auditing, and sharing it with your friends!',
		},
	],
]

export function Faqs() {
	return (
		<section
			id="faqs"
			aria-labelledby="faqs-title"
			className="border-t border-slate-200 py-20 sm:py-32"
		>
			<Container>
				<div className="mx-auto max-w-2xl lg:mx-0">
					<h2
						id="faqs-title"
						className="text-3xl font-medium tracking-tight text-slate-900"
					>
						Frequently asked questions
					</h2>
					<p className="mt-2 text-lg text-slate-600">
						If you have any other questions, reach out to us at:{' '}
						<a
							href={`mailto:${CONTACT_EMAIL}`}
							className="text-slate-900 underline"
						>
							{CONTACT_EMAIL}
						</a>
						.
					</p>
				</div>
				<ul
					role="list"
					className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
				>
					{faqs.map((column, columnIndex) => (
						<li key={columnIndex}>
							<ul role="list" className="space-y-10">
								{column.map((faq, faqIndex) => (
									<li key={faqIndex}>
										<h3 className="text-lg font-semibold leading-6 text-slate-900">
											{faq.question}
										</h3>
										<p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</Container>
		</section>
	)
}
