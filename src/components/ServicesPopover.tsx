import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Service } from '@/types/services'
import { ServiceAvatar } from './ServiceAvatar'
import { PlusCircleIcon } from 'lucide-react'
import { Button } from './Button'
import Link from 'next/link'

export interface ServicesPopoverProps
	extends React.ComponentPropsWithoutRef<typeof Popover> {
	services: Service[]
}

export function ServicesPopover({
	services,
	children,
	...props
}: ServicesPopoverProps) {
	return (
		<Popover {...props}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-4">
					<div className="flex items-center justify-between">
						<h4 className="font-medium leading-none">Services</h4>
						<kbd className="bg-muted pointer-events-none flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium opacity-100">
							Esc
						</kbd>
					</div>
					<div className="grid gap-2">
						{services.map(service => (
							<Link
								href={`/${service.name}`}
								className="w-full"
								key={service.id}
							>
								<Button
									variant="ghost"
									key={service.id}
									className="flex w-full items-center justify-start gap-2 text-lg font-medium"
								>
									<ServiceAvatar
										id={service.id}
										size={24}
										src={service.avatar_url}
										alt={service.display_name}
										className="border-slate-300"
									/>
									{service.name}
								</Button>
							</Link>
						))}
					</div>
					<div className="mt-2 border-t border-slate-200 pt-2">
						<Link className="w-full" href="/services/new">
							<Button
								className="flex w-full items-center justify-start gap-2 text-base font-medium hover:bg-slate-200"
								variant="ghost"
							>
								<PlusCircleIcon className="text-nano h-5 w-5" />
								Create Service
							</Button>
						</Link>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
