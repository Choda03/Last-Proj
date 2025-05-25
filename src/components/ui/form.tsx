"use client"

import * as React from "react"
import { useForm, UseFormProps, FieldValues, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"

interface FormProps<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  schema: z.ZodType<T>
  onSubmit: SubmitHandler<T>
  defaultValues?: UseFormProps<T>["defaultValues"]
  children: (methods: ReturnType<typeof useForm<T>>) => React.ReactNode
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
  ...props
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
      {...props}
    >
      {children(methods)}
    </form>
  )
}

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  description?: string
}

export function FormField({
  label,
  error,
  description,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={props.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export { useForm } 