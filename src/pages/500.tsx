import Error500 from '@/components/Errors/500'
import { useRouter } from 'next/router'

export default function ErrorPage500() {
	const router = useRouter()

	const message = router.query.message

	return (
		<Error500 message={typeof message === 'string' ? message : undefined} />
	)
}
