import { GetServerSidePropsContext } from 'next'

export default function AuthRedirect() {
	return 'redirecting...'
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// we must force redirect to ensure the cookies will be saved

	const { redirectTo } = ctx.query

	if (typeof redirectTo === 'string' && redirectTo) {
		ctx.res.writeHead(302, {
			Location: `/${redirectTo}`,
		})
		ctx.res.end()
	} else {
		ctx.res.writeHead(302, {
			Location: `/home`,
		})
		ctx.res.end()
	}
}
