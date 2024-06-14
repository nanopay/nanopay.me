export const checkUUID = (str: string) => {
	const regex = new RegExp(
		'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
		'gi',
	)
	return regex.test(str)
}
