import { GetServerSidePropsContext } from 'next'

export default function Redirect() {
	return 'redirecting...'
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// we must force redirect to ensure the cookies will be saved

	const { to } = ctx.query

	if (typeof to === 'string' && to) {
		ctx.res.writeHead(302, {
			Location: decodeURI(to),
		})
		ctx.res.end()
	} else {
		ctx.res.writeHead(302, {
			Location: `/home`,
		})
		ctx.res.end()
	}
}
