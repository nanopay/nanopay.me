import clsx from 'clsx'

const statusColor = {
	active: 'green',
	inactive: 'gray',
	pending: 'yellow',
	error: 'red',
}

export default function ActivityDot({
	status,
}: {
	status: keyof typeof statusColor
}) {
	return (
		<span
			className={`bg-${statusColor[status]}-100 h-4 w-4 flex items-center justify-center rounded-full`}
			aria-hidden="true"
		>
			<span className={`bg-${statusColor[status]}-400 h-2 w-2 rounded-full`} />
		</span>
	)
}
