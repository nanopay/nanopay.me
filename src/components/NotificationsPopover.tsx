'use client'

import { AlertTriangleIcon, CheckCircleIcon, LucideProps } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from './ui/badge'
import { useNotifications } from '@/hooks/useNotifications'
import { InfiniteScroll } from './InfiniteScroll'
import {
	Notification,
	NotificationInvoiceData,
	NotificationType,
	NotificationWebhookData,
} from '@/core/client/notifications'
import { cn } from '@/lib/cn'
import { TimeAgo } from './TimeAgo'
import { Button } from './Button'

export function NotificationsPopover({
	serviceId,
	children,
}: {
	serviceId: string
	children: React.ReactNode
}) {
	const { data, count, loading, error, hasMore, loadMore } =
		useNotifications(serviceId)

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-96 p-0" side="bottom" align="end">
				<Card className="border-none shadow-none">
					<CardHeader className="p-0">
						<Tabs defaultValue="inbox" className="w-full overflow-hidden">
							<TabsList className="grid w-full grid-cols-3 border-b border-slate-200">
								<TabsTrigger
									value="inbox"
									className="py-3 data-[state=active]:font-semibold"
								>
									Inbox{' '}
									<Badge className="ml-2 text-xs" variant="secondary">
										{count}
									</Badge>
								</TabsTrigger>
								<TabsTrigger value="archive">Archive</TabsTrigger>
								<TabsTrigger value="comments">Others</TabsTrigger>
							</TabsList>
							<TabsContent value="inbox" className="m-0 p-0">
								<CardContent className="h-[480px] px-0 py-2">
									<InfiniteScroll
										hasMore={hasMore}
										loadMore={loadMore}
										loader={<NotificationItemSkeleton />}
										endMessage={
											data.length > 0 ? (
												<NotificationEndMessage />
											) : (
												<NotificationEmptyMessage />
											)
										}
										className="scrollbar-thin"
									>
										{data.map(notification => (
											<NotificationItem
												key={notification.id}
												notification={notification}
											/>
										))}
									</InfiniteScroll>
								</CardContent>
							</TabsContent>
							<TabsContent value="archive">
								<CardContent className="px-4 py-2">
									<p className="text-sm text-slate-500 dark:text-slate-400">
										No archived notifications.
									</p>
								</CardContent>
							</TabsContent>
							<TabsContent value="comments">
								<CardContent className="px-4 py-2">
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Nothing to see here.
									</p>
								</CardContent>
							</TabsContent>
						</Tabs>
					</CardHeader>
					<CardFooter className="p-4">
						{data.length > 0 && (
							<Button color="slate" variant="outline" className="w-full">
								Archive All
							</Button>
						)}
					</CardFooter>
				</Card>
			</PopoverContent>
		</Popover>
	)
}

const buildNotificationMessage = (
	type: NotificationType,
	data: NotificationInvoiceData | NotificationWebhookData,
) => {
	switch (type) {
		case 'INVOICE_PAID':
			return (
				<span>
					Invoice paid:{' '}
					<b className="font-semibold">
						{(data as NotificationInvoiceData).title}
					</b>
				</span>
			)
		case 'INVOICE_EXPIRED':
			return (
				<span>
					Invoice expirose:{' '}
					<b className="font-semibold">
						{(data as NotificationInvoiceData).title}
					</b>
				</span>
			)
		case 'INVOICE_ERROR':
			return (
				<span>
					Invoice error:{' '}
					<b className="font-semibold">
						{(data as NotificationInvoiceData).title}
					</b>
				</span>
			)
		case 'WEBHOOK_FAILURE':
			return (
				<span>
					Webhook failure:{' '}
					<b className="font-semibold">
						{(data as NotificationWebhookData).name}
					</b>
				</span>
			)
	}
}

const NotificationIcon = ({
	type,
	...props
}: LucideProps & {
	type: NotificationType
}) => {
	switch (type) {
		case 'INVOICE_PAID':
			return (
				<div className="mt-1 rounded-full border border-emerald-600/20 bg-emerald-400/10 p-2">
					<CheckCircleIcon
						className={cn('h-5 w-5 text-emerald-600', props.className)}
					/>
				</div>
			)
		case 'INVOICE_EXPIRED':
			return (
				<div className="mt-1 rounded-full border border-amber-600/20 bg-yellow-400/10 p-2">
					<AlertTriangleIcon
						className={cn('h-5 w-5 text-amber-600', props.className)}
					/>
				</div>
			)
		case 'INVOICE_ERROR':
			return (
				<div className="mt-1 rounded-full border border-rose-600/20 bg-rose-400/10 p-2">
					<AlertTriangleIcon
						className={cn('h-5 w-5 text-rose-600', props.className)}
					/>
				</div>
			)
		case 'WEBHOOK_FAILURE':
			return (
				<div className="mt-1 rounded-full border border-rose-600/20 bg-rose-400/10 p-2">
					<AlertTriangleIcon
						className={cn('h-5 w-5 text-rose-600', props.className)}
					/>
				</div>
			)
	}
}

function NotificationItem({ notification }: { notification: Notification }) {
	const message = buildNotificationMessage(notification.type, notification.data)

	return (
		<div
			key={notification.id}
			className="flex cursor-pointer items-start gap-4 border-b p-4 last:border-b-0 hover:bg-slate-100"
		>
			<NotificationIcon type={notification.type} className="h-5 w-5" />
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium leading-none">{message}</p>
				<p className="text-sm text-slate-500 dark:text-slate-400">
					<TimeAgo dateTime={notification.createdAt} />
				</p>
			</div>
			<div className="flex-shrink-0">
				<div className="bg-nano h-2 w-2 rounded-full" />
			</div>
		</div>
	)
}

function NotificationItemSkeleton() {
	return (
		<div className="flex items-start gap-4 border-b p-4 last:border-b-0">
			<div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
			<div className="flex-1 space-y-1">
				<div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
				<div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
			</div>
			<div className="flex-shrink-0">
				<div className="h-2 w-2 animate-pulse rounded-full bg-slate-200" />
			</div>
		</div>
	)
}

function NotificationEndMessage() {
	return (
		<div className="flex items-center justify-center p-4 text-xs text-slate-500 dark:text-slate-400">
			<p>
				<span className="font-semibold">Yay! </span>
				You have seen it all
			</p>
		</div>
	)
}

function NotificationEmptyMessage() {
	return (
		<div className="flex items-center justify-center p-4 text-xs text-slate-500 dark:text-slate-400">
			<p className="mt-8 text-lg font-semibold">No notifications yet.</p>
		</div>
	)
}
