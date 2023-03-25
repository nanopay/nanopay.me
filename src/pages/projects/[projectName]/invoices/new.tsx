import { useRouter } from 'next/router'
import Head from 'next/head'
import { useMutation, useQuery } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import { JSONSchemaType } from 'ajv'
import Image from 'next/image'

import { Container } from '@/components/Container'
import MButton from '@/components/MButton'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Header } from '@/components/Header'
import { UserProfile } from '@/types/users'
import { InvoiceCreate } from '@/types/invoice'
import { INVOICE_MINIMUM_PRICE } from '@/constants'
import Layout from '@/components/Layout'

const schema: JSONSchemaType<InvoiceCreate> = {
	type: 'object',
	properties: {
		title: {
			type: 'string',
			minLength: 2,
			maxLength: 40,
		},
		description: { type: 'string', maxLength: 512, nullable: true },
		price: { type: 'number', minimum: INVOICE_MINIMUM_PRICE },
		recipient_address: {
			type: 'string',
			pattern: '^nano_[13456789abcdefghijkmnopqrstuwxyz]{60}$',
		},
		metadata: { type: 'object', nullable: true },
	},
	required: ['title', 'price', 'recipient_address'],
	additionalProperties: false,
}

export default function NewProject({ user }: { user: UserProfile }) {
	const { showError, showSuccess } = useToast()
	const router = useRouter()

	const projectName = router.query.projectName as string

	const { data: project, isLoading } = useQuery({
		queryKey: ['project', projectName],
		queryFn: () => api.projects.get(projectName).then(res => res.data),
	})

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<InvoiceCreate>({
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const {
		mutate: onSubmit,
		isLoading: isSubmitting,
		isSuccess,
		data: createdApiKey,
	} = useMutation({
		mutationFn: async (data: InvoiceCreate) =>
			api.invoices.create(project?.id as string, data).then(res => res.data),
		onSuccess: res => {
			showSuccess('Invoice created')
			router.push(`/projects/${project?.name}/invoices/${res.id}`)
		},
		onError: (err: any) => {
			showError('Error creating project', api.getErrorMessage(err))
		},
	})

	const onErrorSubmiting = () => {
		showError('Error creating project', 'Check the fields entered')
	}

	if (!projectName) {
		return null
	}

	if (!isLoading && !project) {
		return (
			<>
				<Head>
					<title>Invoice - NanoPay.me</title>
				</Head>
				<Header user={user} className="bg-white border-b border-slate-100" />
				<Container>
					<div>Something went wrong!</div>
				</Container>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>Invoice - NanoPay.me</title>
			</Head>
			<Layout user={user}>
				<Container className="sm:mt-4 w-full max-w-xl h-screen sm:h-auto flex flex-col items-center space-y-6 bg-white py-8 px-16 pb-16 shadow sm:rounded-lg">
					<div className="w-full max-w-xl flex flex-col space-y-6 px-4 sm:px-8 pb-4">
						<div className="w-full flex items-center justify-between space-x-8">
							<h1 className="text-lg font-semibold text-slate-600">
								New Invoice
							</h1>
							<div />
						</div>

						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<Input
									label="Title"
									{...field}
									onChange={e => field.onChange(e.target.value)}
									errorMessage={errors.title?.message}
									className="w-full"
									autoCapitalize="words"
									style={{
										textTransform: 'capitalize',
									}}
									disabled={isSubmitting || isSuccess}
								/>
							)}
						/>

						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<Input
									label="Description (optional)"
									{...field}
									onChange={e => field.onChange(e.target.value.slice(0, 512))}
									errorMessage={errors.description?.message}
									className="w-full"
									multiline={true}
									disabled={isSubmitting || isSuccess}
								/>
							)}
						/>

						<Controller
							name="price"
							control={control}
							render={({ field }) => (
								<Input
									label="Price / Amount"
									type="number"
									{...field}
									onChange={e => field.onChange(Number(e.target.value))}
									errorMessage={errors.price?.message}
									className="w-full"
									autoCapitalize="words"
									style={{
										textTransform: 'capitalize',
									}}
									disabled={isSubmitting || isSuccess}
								/>
							)}
						/>

						<Controller
							name="recipient_address"
							control={control}
							render={({ field }) => (
								<Input
									label="Recipient Nano Address"
									{...field}
									onChange={e => field.onChange(e.target.value)}
									errorMessage={errors.recipient_address?.message}
									className="w-full"
									autoCapitalize="words"
									style={{
										textTransform: 'capitalize',
									}}
									disabled={isSubmitting || isSuccess}
								/>
							)}
						/>
					</div>

					<MButton
						onClick={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
						loading={isSubmitting}
						disabled={
							isSuccess ||
							!watch('title') ||
							!watch('price') ||
							!watch('recipient_address')
						}
					>
						{isSubmitting ? 'Creating Invoice...' : 'Create Invoice'}
					</MButton>
				</Container>
			</Layout>
		</>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createServerSupabaseClient(ctx)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	return {
		props: {
			user: session?.user?.user_metadata?.internal_profile || {
				name: 'error',
				email: 'error',
				avatar_url: 'error',
			},
		},
	}
}
