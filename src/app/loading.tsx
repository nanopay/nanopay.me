import Loading from '@/components/Loading'

export default function LoadingPage() {
	return (
		<div className="relative h-screen w-full">
			<Loading className="absolute left-1/2 top-1/2  h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px]" />
		</div>
	)
}
