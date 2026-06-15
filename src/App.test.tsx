import "@testing-library/jest-dom/vitest"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import { App } from "@/App"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  })

  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
})

function renderApp() {
  return render(
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  )
}

describe("App", () => {
  it("renders the AI agent management page", () => {
    renderApp()

    expect(
      screen.getByRole("heading", { level: 1, name: "AI Agent" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Build and manage your Agents from one place.")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Create Agent" })
    ).toBeInTheDocument()

    expect(screen.getByRole("tab", { name: "AI Agent" })).toBeInTheDocument()
    expect(
      screen.getByRole("tab", { name: "Responsive AI Agent" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("tab", { name: "Rule-based Agent" })
    ).toBeInTheDocument()

    const firstAgent = screen.getByRole("article", { name: "31" })
    expect(
      within(firstAgent).getByText("Last Updated 6 hours ago")
    ).toBeInTheDocument()
    expect(within(firstAgent).getByText("Associated")).toBeInTheDocument()
    expect(within(firstAgent).getByText("Skills")).toBeInTheDocument()
    expect(
      within(firstAgent).getByRole("button", { name: "Duplicate 31" })
    ).toBeInTheDocument()
    expect(
      within(firstAgent).getByRole("button", { name: "Delete 31" })
    ).toBeInTheDocument()

    expect(screen.getByRole("article", { name: "YCloud" })).toBeInTheDocument()
    expect(screen.getByRole("article", { name: "测试-lx" })).toBeInTheDocument()
  })

  it("uses the shadcn line tab style", () => {
    renderApp()

    expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "line")

    const activeTab = screen.getByRole("tab", { selected: true })
    expect(activeTab).toHaveAttribute("data-active")
    expect(activeTab).toHaveClass(
      "group-data-[orientation=horizontal]/tabs:after:h-0.5"
    )
    expect(activeTab).toHaveClass("after:bg-foreground")
  })

  it("confirms before deleting an agent", () => {
    renderApp()

    fireEvent.click(
      within(screen.getByRole("article", { name: "YCloud" })).getByRole(
        "button",
        { name: "Delete YCloud" }
      )
    )

    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    expect(screen.getByText("Delete YCloud?")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    expect(screen.getByRole("article", { name: "YCloud" })).toBeInTheDocument()

    fireEvent.click(
      within(screen.getByRole("article", { name: "YCloud" })).getByRole(
        "button",
        { name: "Delete YCloud" }
      )
    )
    fireEvent.click(screen.getByRole("button", { name: "Delete agent" }))

    expect(
      screen.queryByRole("article", { name: "YCloud" })
    ).not.toBeInTheDocument()
  })

  it("shows associated phone numbers when clicking an associated count", () => {
    renderApp()

    fireEvent.click(
      within(screen.getByRole("article", { name: "YCloud" })).getByRole(
        "button",
        { name: "View associated contacts for YCloud" }
      )
    )

    expect(screen.getByText("Ycloudbytester")).toBeInTheDocument()
    expect(screen.getByText("Ycloudbytester+15557928087")).toBeInTheDocument()
  })

  it("shows create and update times when hovering the timestamp info icon", async () => {
    renderApp()

    fireEvent.focus(
      within(screen.getByRole("article", { name: "YCloud" })).getByRole(
        "button",
        { name: "Show timestamps for YCloud" }
      )
    )

    await waitFor(() => {
      expect(screen.getByText("Created: 2026-06-10 09:24")).toBeInTheDocument()
      expect(screen.getByText("Updated: 2026-06-10 18:02")).toBeInTheDocument()
    })
  })

  it("shows a success toast after copying an agent", async () => {
    renderApp()

    fireEvent.click(
      within(screen.getByRole("article", { name: "YCloud" })).getByRole(
        "button",
        { name: "Duplicate YCloud" }
      )
    )

    await waitFor(() => {
      expect(screen.getByText("Agent copied")).toBeInTheDocument()
      expect(
        screen.getByText("YCloud has been duplicated.")
      ).toBeInTheDocument()
    })
  })

  it("creates an agent with a searchable multi-select for contact attributes", async () => {
    renderApp()

    fireEvent.click(screen.getByRole("button", { name: "Create Agent" }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Create AI Agent")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "NewLaunchAgent1" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Shop assistant" }))

    fireEvent.click(
      screen.getByRole("combobox", { name: "Choose contact attributes" })
    )
    fireEvent.change(
      screen.getByPlaceholderText("Search contact attributes..."),
      { target: { value: "email" } }
    )
    fireEvent.click(
      await screen.findByRole("option", {
        name: "Shopify Email Marketing Consent Opt In Level",
      })
    )

    expect(
      within(
        screen.getByRole("combobox", { name: "Choose contact attributes" })
      ).getByText("Shopify Email Marketing Consent Opt In Level")
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Create" }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      expect(
        screen.getByRole("article", { name: "NewLaunchAgent1" })
      ).toBeInTheDocument()
    })
    expect(screen.getByText("Last Updated just now")).toBeInTheDocument()
  })

  it("validates agent names before submitting the create form", async () => {
    renderApp()

    fireEvent.click(screen.getByRole("button", { name: "Create Agent" }))
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "中文 Agent-1" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Create" }))

    expect(
      await screen.findByText("Use letters and numbers only.")
    ).toBeInTheDocument()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(
      screen.queryByRole("article", { name: "中文 Agent-1" })
    ).not.toBeInTheDocument()
  })

  it("keeps role card icons aligned in fixed icon slots", () => {
    renderApp()

    fireEvent.click(screen.getByRole("button", { name: "Create Agent" }))

    const roleIconSlots = document.querySelectorAll('[data-slot="role-icon"]')
    expect(roleIconSlots).toHaveLength(4)

    roleIconSlots.forEach((slot) => {
      expect(slot).toHaveClass("size-5")
      expect(slot).toHaveClass("items-center")
      expect(slot).toHaveClass("justify-center")
    })
  })

  it("highlights selected contact attributes and removes them from chips", async () => {
    renderApp()

    fireEvent.click(screen.getByRole("button", { name: "Create Agent" }))

    fireEvent.click(
      screen.getByRole("combobox", { name: "Choose contact attributes" })
    )

    const selectedOption = screen.getByRole("option", {
      name: "Shopify Last Name",
    })
    expect(selectedOption).toHaveAttribute("data-checked", "true")
    expect(selectedOption).toHaveClass("bg-muted")

    fireEvent.click(
      within(
        screen.getByRole("combobox", { name: "Choose contact attributes" })
      ).getByRole("button", { name: "Remove Shopify Last Name" })
    )

    expect(
      within(
        screen.getByRole("combobox", { name: "Choose contact attributes" })
      ).queryByText("Shopify Last Name")
    ).not.toBeInTheDocument()
  })

  it("keeps empty agent tabs compact", () => {
    renderApp()

    fireEvent.click(screen.getByRole("tab", { name: "Responsive AI Agent" }))
    expect(
      screen.getByText("No responsive ai agent have been added yet.")
    ).toHaveClass("py-6")

    fireEvent.click(screen.getByRole("tab", { name: "Rule-based Agent" }))
    expect(
      screen.getByText("No rule-based agent have been added yet.")
    ).toHaveClass("py-6")
  })
})
