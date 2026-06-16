import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      data-slot="spinner"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("animate-spin", className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.25"
      />
      <path
        fill="currentColor"
        d="M22 12a10 10 0 0 1-10 10v-4a6 6 0 0 0 6-6z"
      />
    </svg>
  )
}

export { Spinner }
