const statusColor = {
	active: 'green',
	inactive: 'slate',
	pending: 'yellow',
	error: 'red',
}
import tailwindColors from 'tailwindcss/colors'

export default function ActivityDot({
	status,
}: {
	status: keyof typeof statusColor
}) {
	const color = statusColor[status] as keyof typeof tailwindColors

	return (
		<span
			className={`flex h-4 w-4 items-center justify-center rounded-full`}
			style={{
				backgroundColor: tailwindColors[color]['100'],
			}}
			aria-hidden="true"
		>
			<span
				className={`h-2 w-2 rounded-full`}
				style={{
					backgroundColor: tailwindColors[color]['400'],
				}}
			/>
		</span>
	)
}
