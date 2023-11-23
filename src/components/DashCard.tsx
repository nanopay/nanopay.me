import { SvgIconComponent } from '@mui/icons-material'
import clsx from 'clsx'

export interface DashCardProps extends React.HTMLProps<HTMLDivElement> {
	name: string
	href: string
	icon:
		| SvgIconComponent
		| React.ForwardRefExoticComponent<
				React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
					title?: string
					titleId?: string
				} & React.RefAttributes<SVGSVGElement>
		  >
	amount: number
	hrefLabel: string
}

export default function DashCard({
	name,
	icon: Icon,
	amount,
	href,
	hrefLabel,
	...props
}: DashCardProps) {
	return (
		<div
			{...props}
			className={clsx(
				'overflow-hidden rounded-lg bg-white shadow',
				props.className,
			)}
		>
			<div className="p-5">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<Icon className="h-6 w-6 text-slate-400" aria-hidden="true" />
					</div>
					<div className="ml-5 w-0 flex-1">
						<dl>
							<dt className="truncate text-sm font-medium text-slate-500">
								{name}
							</dt>
							<dd>
								<div className="text-lg font-medium text-slate-900">
									{amount}
								</div>
							</dd>
						</dl>
					</div>
				</div>
			</div>
			<div className="bg-slate-100 px-5 py-3">
				<div className="text-sm">
					<a
						href={href}
						className="font-medium text-cyan-700 hover:text-cyan-900"
					>
						{hrefLabel}
					</a>
				</div>
			</div>
		</div>
	)
}
