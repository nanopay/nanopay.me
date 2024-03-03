import { BackgroundIllustration } from '@/components/BackgroundIllustration'

export default function SetupLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="flex min-h-full flex-1 flex-col overflow-hidden sm:py-28 sm:pt-16">
			<div className="mx-auto flex w-full max-w-2xl flex-col sm:px-6">
				<div className="relative mt-16 hidden sm:block">
					<BackgroundIllustration
						width="1090"
						height="1090"
						className="stroke-nano-light absolute -top-7 left-1/2 h-[788px] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto"
					/>
				</div>
				<div className="z-10 flex h-screen w-full flex-col items-center justify-center sm:mt-10 sm:h-auto">
					{children}
				</div>
			</div>
		</main>
	)
}
