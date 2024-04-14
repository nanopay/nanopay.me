import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import z, { ZodError } from 'zod'

export const runtime = 'edge'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 10
const DEFAULT_OFFSET = 0
const DEFAULT_ORDER = 'asc'
const DEFALT_ORDER_BY = 'name'

const schema = z.object({
	limit: z.number().max(MAX_LIMIT),
	offset: z.number(),
	order: z.enum(['asc', 'desc']),
	order_by: z.enum(['name', 'created_at']),
})

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url)
		const { limit, offset, order, order_by } = schema.parse({
			limit: Number(url.searchParams.get('limit') ?? DEFAULT_LIMIT),
			offset: Number(url.searchParams.get('offset') ?? DEFAULT_OFFSET),
			order: url.searchParams.get('order') ?? DEFAULT_ORDER,
			order_by: url.searchParams.get('order_by') ?? DEFALT_ORDER_BY,
		})

		if (limit > MAX_LIMIT) {
			return Response.json(
				{ message: 'Limit is too high' },
				{
					status: 400,
				},
			)
		}

		const supabase = createClient(cookies())

		const { data, error } = await supabase
			.from('services')
			.select('id, name, avatar_url, description')
			.order(order_by, { ascending: order === 'asc' })
			.range(offset, offset + limit - 1)

		if (error) {
			return Response.json(
				{ message: error.message },
				{
					status: 500,
				},
			)
		}

		return Response.json(data)
	} catch (error) {
		if (error instanceof ZodError) {
			return Response.json(
				{ message: 'Invalid query parameters', errors: error.errors },
				{
					status: 400,
				},
			)
		}
		return Response.json(
			{ message: 'Internal server error' },
			{
				status: 500,
			},
		)
	}
}
