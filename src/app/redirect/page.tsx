import { redirect } from 'next/navigation'

export default async function RedirectPage({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined }
}) {
	const to = searchParams?.to

	if (typeof to === 'string' && to) {
		redirect(to)
	} else {
		redirect('/home')
	}
}
