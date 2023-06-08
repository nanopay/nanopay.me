const statusColor = {
	active: 'green',
	inactive: 'gray',
	pending: 'yellow',
	error: 'red',
}
import tailwindColors from 'tailwindcss/colors'
import { DefaultColors } from 'tailwindcss/types/generated/colors'

export default function ActivityDot({
	status,
}: {
	status: keyof typeof statusColor
}) {
	const color = statusColor[status] as keyof DefaultColors

	return (
		<span
			className={`h-4 w-4 flex items-center justify-center rounded-full`}
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
