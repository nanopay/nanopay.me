import Checkout from '@/components/Checkout'

export default function () {
	return (
		<div className="w-full max-w-3xl mx-auto h-screen flex sm:items-center justify-center">
			<Checkout
				invoiceId={234}
				address={
					'nano_35zcb75xf44zptp9hjikdbikrnh4mhhehrjm7w8gy8fmik8jjbdq3kg4xwat'
				}
				amount={15}
				usd={10.5}
				paid={false}
				expiresAt={new Date(Date.now() + 1000 * 60 * 5)}
			/>
		</div>
	)
}
