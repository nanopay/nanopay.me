import { Button } from '@/components/Button'
import { CONTACT_EMAIL } from '@/core/constants'
import NotFoundImage from '@/images/not-found.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function PageNotFound() {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="text-center">
				<Image
					src={NotFoundImage}
					alt="Not found"
					className="mx-auto mb-4 h-80 w-80"
				/>
				<h1 className="mb-4 text-2xl font-bold text-slate-700">
					Page not found
				</h1>
				<p className="text-slate-500">
					The page you are looking for does not exist.
				</p>
				<div className="py-4">
					<Link href="/">
						<Button variant="outline">Back to home page</Button>
					</Link>
				</div>
				<div className="mt-8 text-sm text-slate-500">
					<p>Think this is a bug? Contact us:</p>
					<Link
						className="text-nano hover:underline"
						href={`mailto:${CONTACT_EMAIL}`}
					>
						{CONTACT_EMAIL}
					</Link>
				</div>
			</div>
		</div>
	)
}
