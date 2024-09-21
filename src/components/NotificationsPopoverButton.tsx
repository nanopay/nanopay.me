'use client'

import {
	AlertTriangleIcon,
	BellIcon,
	CheckCircleIcon,
	LucideProps,
} from 'lucide-react'
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

export function NotificationsPopoverButton({
	serviceId,
}: {
	serviceId: string
}) {
	const inbox = useNotifications(serviceId, {
		status: 'inbox',
	})
	const archived = useNotifications(serviceId, {
		status: 'archived',
	})

	const hasNotifications = !!inbox.count

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						'hover:text-nano hover:bg-slate hover:border-nano/30 relative h-8 w-8 rounded-full border border-slate-200 p-0 text-slate-500 sm:h-9 sm:w-9',
						'data-[state=open]:text-nano data-[state=open]:border-nano/30 data-[state=open]:bg-slate-100',
					)}
					aria-label="View notifications"
				>
					<BellIcon className="h-5 w-5" />
					{hasNotifications && (
						<span className="bg-primary absolute right-0 top-0 h-2.5 w-2.5 rounded-full" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 p-0" side="bottom" align="end">
				<Tabs defaultValue="inbox" className="w-full overflow-hidden">
					<TabsList className="grid w-full grid-cols-3 border-b border-slate-200">
						<TabsTrigger
							value="inbox"
							className="py-3 data-[state=active]:font-semibold"
						>
							Inbox{' '}
							<Badge className="ml-2 text-xs" variant="secondary">
								{inbox.count}
							</Badge>
						</TabsTrigger>
						<TabsTrigger value="archive">Archive</TabsTrigger>
						<TabsTrigger value="other">Others</TabsTrigger>
					</TabsList>
					<TabsContent
						value="inbox"
						className="relative m-0 h-[480px] px-0 pb-14"
					>
						<InfiniteScroll
							hasMore={inbox.hasMore}
							loadMore={inbox.loadMore}
							loader={<NotificationItemSkeleton />}
							endMessage={
								hasNotifications ? (
									<NotificationEndMessage />
								) : (
									<NotificationEmptyMessage status="inbox" />
								)
							}
							className="scrollbar-thin overscroll-none"
						>
							{inbox.data.map(notification => (
								<NotificationItem
									key={notification.id}
									notification={notification}
								/>
							))}
						</InfiniteScroll>
						{hasNotifications && (
							<Button
								color="slate"
								variant="outline"
								className="absolute bottom-0 h-14 w-full rounded-t-none"
							>
								Archive All
							</Button>
						)}
					</TabsContent>
					<TabsContent value="archive" className="px-4 py-2">
						<InfiniteScroll
							hasMore={archived.hasMore}
							loadMore={archived.loadMore}
							loader={<NotificationItemSkeleton />}
							endMessage={
								archived.data.length > 0 ? (
									<NotificationEndMessage />
								) : (
									<NotificationEmptyMessage status="archived" />
								)
							}
							className="scrollbar-thin overscroll-none"
						>
							{archived.data.map(notification => (
								<NotificationItem
									key={notification.id}
									notification={notification}
								/>
							))}
						</InfiniteScroll>
					</TabsContent>
					<TabsContent value="other" className="px-4 py-2">
						<NotificationEmptyMessage status="other" />
					</TabsContent>
				</Tabs>
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

function NotificationEmptyMessage({
	status,
}: {
	status: 'inbox' | 'archived' | 'other'
}) {
	return (
		<div className="flex items-center justify-center p-4 text-xs text-slate-500 dark:text-slate-400">
			<p className="text-lg font-semibold">
				{status === 'inbox'
					? 'No notifications yet.'
					: status === 'archived'
					? 'No archived notifications.'
					: 'No other notifications.'}
			</p>
		</div>
	)
}
