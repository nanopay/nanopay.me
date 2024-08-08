import { ApiDocsMobileHeader } from './_components/ApiDocsMobileHeader'
import { ApiDocsDesktopSidebar } from './_components/ApiDocsDesktopSidebar'

export default function ApiDocsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen w-full flex-1 flex-col md:flex">
			<ApiDocsDesktopSidebar />
			<ApiDocsMobileHeader />
			<main className="flex flex-1 flex-col md:ml-48 lg:ml-64">
				<article className="prose lg:prose-lg prose-slate max-w-3xl p-6">
					{children}
				</article>
			</main>
		</div>
	)
}
