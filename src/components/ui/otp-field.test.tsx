import "@testing-library/jest-dom/vitest"

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  OtpField,
  OtpFieldGroup,
  OtpFieldInput,
  OtpFieldSeparator,
} from "@/components/ui/otp-field"

describe("OtpField", () => {
  it("renders fixed-width shadcn styled slots with separators", () => {
    render(
      <OtpField aria-label="Verification code" length={6}>
        <OtpFieldGroup>
          <OtpFieldInput />
          <OtpFieldInput aria-label="Character 2 of 6" />
          <OtpFieldInput aria-label="Character 3 of 6" />
        </OtpFieldGroup>
        <OtpFieldSeparator />
        <OtpFieldGroup>
          <OtpFieldInput aria-label="Character 4 of 6" />
          <OtpFieldInput aria-label="Character 5 of 6" />
          <OtpFieldInput aria-label="Character 6 of 6" />
        </OtpFieldGroup>
      </OtpField>
    )

    const root = screen.getByRole("group", { name: "Verification code" })
    expect(root).toHaveAttribute("data-slot", "otp-field")
    expect(root).toHaveClass("flex")
    expect(root).toHaveClass("items-center")

    const firstSlot = document.querySelector('[data-slot="otp-field-input"]')
    expect(firstSlot).toHaveAttribute("data-slot", "otp-field-input")
    expect(firstSlot).toHaveClass("size-8")
    expect(firstSlot).toHaveClass("text-center")
    expect(firstSlot).toHaveClass("focus-visible:ring-2")

    expect(screen.getByText("-")).toHaveAttribute(
      "data-slot",
      "otp-field-separator"
    )
  })
})
