import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues,
	FormProvider,
	useFormContext,
} from 'react-hook-form'

import { cn } from '@/lib/cn'
import { Label } from '@/components/ui/label'

const Form = FormProvider

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
)

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext>
	)
}

const useFormField = () => {
	const fieldContext = React.use(FormFieldContext)
	const itemContext = React.use(FormItemContext)
	const { getFieldState, formState } = useFormContext()

	const fieldState = getFieldState(fieldContext.name, formState)

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>')
	}

	const { id } = itemContext

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	}
}

type FormItemContextValue = {
	id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
)

const FormItem = ({
	ref,
	className,
	...props
}: React.ComponentProps<'div'>) => {
	const id = React.useId()

	return (
		<FormItemContext value={{ id }}>
			<div ref={ref} className={cn('space-y-2', className)} {...props} />
		</FormItemContext>
	)
}
FormItem.displayName = 'FormItem'

const FormLabel = ({
	ref,
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) => {
	const { error, formItemId } = useFormField()

	return (
		<Label
			ref={ref}
			className={cn(error && 'text-red-500 dark:text-red-900', className)}
			htmlFor={formItemId}
			{...props}
		/>
	)
}
FormLabel.displayName = 'FormLabel'

const FormControl = ({ ref, ...props }: React.ComponentProps<typeof Slot>) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

	return (
		<Slot
			ref={ref}
			id={formItemId}
			aria-describedby={
				!error
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	)
}
FormControl.displayName = 'FormControl'

const FormDescription = ({
	ref,
	className,
	...props
}: React.ComponentProps<'p'>) => {
	const { formDescriptionId } = useFormField()

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
			{...props}
		/>
	)
}
FormDescription.displayName = 'FormDescription'

const FormMessage = ({
	ref,
	className,
	children,
	...props
}: React.ComponentProps<'p'>) => {
	const { error, formMessageId } = useFormField()
	const body = error ? String(error?.message) : children

	if (!body) {
		return null
	}

	return (
		<p
			ref={ref}
			id={formMessageId}
			className={cn(
				'text-sm font-medium text-red-500 dark:text-red-900',
				className,
			)}
			{...props}
		>
			{body}
		</p>
	)
}
FormMessage.displayName = 'FormMessage'

export {
	useFormField,
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	FormField,
}
