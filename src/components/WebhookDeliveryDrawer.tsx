'use client'

import { ComponentProps } from 'react'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { WebhookDelivery } from '@/core/client'
import { PrettyJsonScrollable } from './PrettyJsonScrollable'

export type WebhookDeliveryDrawerProps = ComponentProps<typeof Sheet> & {
	delivery?: WebhookDelivery | null
}

export function WebhookDeliveryDrawer({
	delivery,
	...props
}: WebhookDeliveryDrawerProps) {
	const formatDate = (dateString: string | undefined) => {
		return dateString ? new Date(dateString).toLocaleString() : 'N/A'
	}

	if (!delivery) {
		return null
	}

	return (
		<Sheet {...props}>
			<SheetContent
				className="w-fit max-w-full! md:max-w-2xl! lg:max-w-3xl! xl:max-w-5xl! 2xl:max-w-6xl!"
				onOpenAutoFocus={e => e.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle>Webhook Delivery Details</SheetTitle>
					<SheetDescription className="sr-only">
						Request and response details for the webhook delivery
					</SheetDescription>
				</SheetHeader>
				<ScrollArea className="mt-6 h-[calc(100vh-80px)]">
					<Table>
						<TableBody>
							<TableRow>
								<TableHead className="font-medium">ID</TableHead>
								<TableCell>{delivery.id || "'N/A'"}</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="font-medium">Type</TableHead>
								<TableCell className="font-bold">
									{delivery.type || "'N/A'"}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="font-medium">URL</TableHead>
								<TableCell className="break-all">
									{delivery.url || "'N/A'"}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="font-medium">Status</TableHead>
								<TableCell>
									{delivery.status_code !== undefined &&
									delivery.success !== undefined ? (
										<Badge
											variant={delivery.success ? 'default' : 'destructive'}
											className={
												delivery.success
													? 'bg-green-500 hover:bg-green-600'
													: ''
											}
										>
											{delivery.status_code}{' '}
											{delivery.success ? 'Success' : 'Failed'}
										</Badge>
									) : (
										"'N/A'"
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="font-medium">Created At</TableHead>
								<TableCell>{formatDate(delivery.created_at)}</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="font-medium">Started At</TableHead>
								<TableCell>{formatDate(delivery.started_at)}</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="font-medium">Completed At</TableHead>
								<TableCell>{formatDate(delivery.completed_at)}</TableCell>
							</TableRow>
							<TableRow>
								<TableHead className="font-medium">Redelivery</TableHead>
								<TableCell>
									{delivery.redelivery !== undefined
										? delivery.redelivery
											? 'Yes'
											: 'No'
										: "'N/A'"}
								</TableCell>
							</TableRow>
							<TableRow className="hidden md:table-row">
								<TableHead className="p-4 align-top font-medium">
									Request Body
								</TableHead>
								<TableCell>
									<PrettyJsonScrollable json={delivery.request_body} />
								</TableCell>
							</TableRow>
							<TableRow className="hidden md:table-row">
								<TableHead className="p-4 align-top font-medium">
									Request Headers
								</TableHead>
								<TableCell>
									<PrettyJsonScrollable json={delivery.request_headers} />
								</TableCell>
							</TableRow>
							<TableRow className="hidden md:table-row">
								<TableHead className="p-4 align-top font-medium">
									Response Headers
								</TableHead>
								<TableCell>
									<PrettyJsonScrollable json={delivery.response_headers} />
								</TableCell>
							</TableRow>
							<TableRow className="hidden md:table-row">
								<TableHead className="p-4 align-top font-medium">
									Response Body
								</TableHead>
								<TableCell>
									{delivery.response_body ? (
										<PrettyJsonScrollable json={delivery.response_body} />
									) : (
										'N/A'
									)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					{/* Responsive table for mobile */}
					<Table className="border-t border-slate-200 md:hidden">
						<TableBody>
							<TableRow className="flex flex-col">
								<TableHead className="p-4 align-top font-medium">
									Request Body
								</TableHead>
								<TableCell>
									<PrettyJsonScrollable json={delivery.request_body} />
								</TableCell>
							</TableRow>
							<TableRow className="flex flex-col">
								<TableHead className="p-4 align-top font-medium">
									Request Headers
								</TableHead>
								<TableCell>
									<PrettyJsonScrollable json={delivery.request_headers} />
								</TableCell>
							</TableRow>
							<TableRow className="flex flex-col">
								<TableHead className="p-4 align-top font-medium">
									Response Headers
								</TableHead>
								<TableCell>
									<PrettyJsonScrollable json={delivery.response_headers} />
								</TableCell>
							</TableRow>
							<TableRow className="flex flex-col">
								<TableHead className="p-4 align-top font-medium">
									Response Body
								</TableHead>
								<TableCell>
									{delivery.response_body ? (
										<PrettyJsonScrollable json={delivery.response_body} />
									) : (
										'N/A'
									)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
