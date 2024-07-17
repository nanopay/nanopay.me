import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/Button'
import NotFoundImage from '@/images/not-found.svg'
import { cn } from '@/lib/cn'

export interface NotFoundCardProps
	extends React.ComponentPropsWithoutRef<'div'> {
	path: string
	forEmail: string
}

export function NotFoundCard({ path, forEmail, ...props }: NotFoundCardProps) {
	return (
		<Card {...props} className={cn('w-full p-8', props.className)}>
			<CardContent className="text-center">
				<Image
					src={NotFoundImage}
					alt="Not found"
					className="mx-auto mb-4 h-64 w-64"
				/>
				<h1 className="mb-4 text-3xl font-bold">Not Found</h1>
				<p className="text-slate-500">
					You are logged in as <b>{forEmail}</b>
				</p>
				<div className="mt-8">
					<Link href={`/logout?next=${path}`}>
						<Button>Sign in as a different user</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
