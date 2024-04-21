import api from '@/services/api'
import { cookies } from 'next/headers'
import { HookForm } from './hook-settings-form'

interface Props {
	params: {
		serviceName: string
		hookId: string
	}
}

const fetchData = async (hookId: string) => {
	return api.services.hooks.get(hookId, {
		headers: {
			Cookie: cookies().toString(),
		},
	})
}

export const metadata = {
	title: 'Webhook Settings',
}

export default async function Webhooks({ params }: Props) {
	const hook = await fetchData(params.hookId)
	return <HookForm hook={hook} />
}
