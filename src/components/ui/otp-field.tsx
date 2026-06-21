import * as React from "react"
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function OtpField({
  className,
  ...props
}: OTPFieldPrimitive.Root.Props) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="otp-field"
      className={cn(
        "flex items-center gap-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function OtpFieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="otp-field-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function OtpFieldInput({
  className,
  ...props
}: OTPFieldPrimitive.Input.Props) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="otp-field-input"
      className={cn(
        "size-8 rounded-md border border-input bg-input/20 text-center text-sm font-medium tabular-nums transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function OtpFieldSeparator({
  className,
  children = "-",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="otp-field-separator"
      className={cn("px-1 text-sm font-medium text-muted-foreground", className)}
      {...props}
    >
      {children}
    </SeparatorPrimitive>
  )
}

export { OtpField, OtpFieldGroup, OtpFieldInput, OtpFieldSeparator }
