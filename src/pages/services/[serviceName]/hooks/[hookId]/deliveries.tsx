import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import api from '@/services/api'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/Auth'
import { useToast } from '@/hooks/useToast'
import { Box, Skeleton, Tab, Tabs } from '@mui/material'
import tailwindColors from 'tailwindcss/colors'
import { HookDelivery } from '@/types/hooks'
import Link from 'next/link'
import HookDelivieries from '@/components/HookDeliveries'

export default function Webhooks() {
	const { user } = useAuth()

	const router = useRouter()

	const { showError } = useToast()

	const serviceName = router.query.serviceName as string

	const hookId = router.query.hookId as string

	const tabs = [
		{
			label: 'Settings',
			href: `/services/${serviceName}/hooks/${hookId}`,
		},
		{
			label: 'Deliveries',
			href: `/services/${serviceName}/hooks/${hookId}/deliveries`,
		},
	]

	const { data: deliveries } = useQuery({
		queryKey: ['delieveries', hookId],
		queryFn: () =>
			api.services.hooks.deliveries.list(hookId).then(res => res.data),
		enabled: !!serviceName && !!hookId,
		onError: (err: any) => {
			showError(
				'Fail getting hook deliveries',
				api.getErrorMessage(err) || 'Try again later',
			)
		},
	})

	if (!serviceName || !hookId) {
		return null
	}

	return (
		<>
			<Head>
				<title>Webook Deliveries - NanoPay.me</title>
			</Head>
			<Layout user={user}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
					<Tabs value={1}>
						{tabs.map((tab, index) => (
							<Tab
								key={index}
								label={tab.label}
								href={tab.href}
								LinkComponent={Link}
							/>
						))}
					</Tabs>
				</Box>
				<>
					{!deliveries ? (
						<Skeleton
							variant="rectangular"
							animation="wave"
							width="full"
							height={240}
							className="rounded-lg"
							sx={{ bgcolor: tailwindColors.slate['200'] }}
						/>
					) : (
						<HookDeliveriesList deliveries={deliveries} />
					)}
				</>
			</Layout>
		</>
	)
}

const HookDeliveriesList = ({ deliveries }: { deliveries: HookDelivery[] }) => {
	return (
		<>
			<HookDelivieries deliveries={deliveries} />
		</>
	)
}