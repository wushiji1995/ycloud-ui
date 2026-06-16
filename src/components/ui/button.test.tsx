import "@testing-library/jest-dom/vitest"

import type { ComponentProps } from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { Button } from "@/components/ui/button"

afterEach(() => {
  cleanup()
})

function StartIcon(props: ComponentProps<"svg">) {
  return <svg aria-label="add icon" {...props} />
}

function EndIcon(props: ComponentProps<"svg">) {
  return <svg aria-label="arrow icon" {...props} />
}

describe("Button", () => {
  it("renders a start icon before the button content", () => {
    render(<Button startIcon={<StartIcon />}>Add Campaign</Button>)

    const button = screen.getByRole("button", { name: /add campaign/i })
    const icon = screen.getByLabelText("add icon")

    expect(icon).toHaveAttribute("data-icon", "inline-start")
    expect(button.firstElementChild).toBe(icon)
  })

  it("disables the button and replaces the start icon with a spinner while loading", () => {
    render(
      <Button loading startIcon={<StartIcon />}>
        Add Campaign
      </Button>
    )

    const button = screen.getByRole("button", { name: /add campaign/i })

    expect(button).toBeDisabled()
    expect(screen.queryByLabelText("add icon")).not.toBeInTheDocument()
    const spinner = button.querySelector('[data-slot="spinner"]')

    expect(spinner).toHaveAttribute("data-icon", "inline-start")
  })

  it("renders an end icon after the button content", () => {
    render(<Button endIcon={<EndIcon />}>Next</Button>)

    const button = screen.getByRole("button", { name: /next/i })
    const icon = screen.getByLabelText("arrow icon")

    expect(icon).toHaveAttribute("data-icon", "inline-end")
    expect(button.lastElementChild).toBe(icon)
  })

  it("replaces an end icon with a spinner while loading when no start icon exists", () => {
    render(
      <Button loading endIcon={<EndIcon />}>
        Download
      </Button>
    )

    const button = screen.getByRole("button", { name: /download/i })
    const spinner = button.querySelector('[data-slot="spinner"]')

    expect(button).toBeDisabled()
    expect(screen.queryByLabelText("arrow icon")).not.toBeInTheDocument()
    expect(spinner).toHaveAttribute("data-icon", "inline-end")
    expect(button.lastElementChild).toBe(spinner)
  })
})
