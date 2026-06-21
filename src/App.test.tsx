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
    private callback: ResizeObserverCallback

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback
    }

    observe(target: Element) {
      this.callback(
        [
          {
            target,
            contentRect: {
              bottom: 288,
              height: 288,
              left: 0,
              right: 960,
              top: 0,
              width: 960,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            },
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          },
        ],
        this
      )
    }

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

    const colorBlock = screen.getByText("hello").parentElement
    expect(colorBlock).toHaveClass("before:from-violet-200")
    expect(colorBlock).toHaveClass("before:to-purple-500")
    expect(colorBlock).toHaveClass("bg-purple-500")
    expect(colorBlock).toHaveClass("before:bg-linear-to-r")
    expect(colorBlock).toHaveClass("hover:before:opacity-0")
    expect(colorBlock).toHaveClass("transition-colors")

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
    expect(activeTab).toHaveClass("after:absolute")
    expect(activeTab).toHaveClass("group-data-horizontal/tabs:after:h-0.5")
    expect(activeTab).toHaveClass("data-active:text-primary")
    expect(activeTab).toHaveClass("after:bg-primary")
  })

  it("renders a deliveries Sankey chart with shadcn chart styling", () => {
    renderApp()

    expect(
      screen.getByRole("heading", { level: 2, name: "Deliveries" })
    ).toBeInTheDocument()
    expect(screen.getByText("Sent")).toBeInTheDocument()
    expect(screen.getByText("1,280")).toBeInTheDocument()
    expect(screen.getByText("Delivered")).toBeInTheDocument()
    expect(screen.getByText("1,192")).toBeInTheDocument()
    expect(screen.getByText("Failed")).toBeInTheDocument()
    expect(screen.getAllByText("88")[0]).toBeInTheDocument()
    expect(screen.getByText("Read")).toBeInTheDocument()
    expect(screen.getByText("826")).toBeInTheDocument()
    expect(screen.getByText("Clicks")).toBeInTheDocument()
    expect(screen.getByText("314")).toBeInTheDocument()
    expect(screen.getByText("Unique replies")).toBeInTheDocument()
    expect(screen.getByText("182")).toBeInTheDocument()
    expect(screen.getByTestId("deliveries-sankey-chart")).toHaveAttribute(
      "data-slot",
      "chart"
    )
    expect(screen.getByTestId("deliveries-sankey-link-0")).toHaveAttribute(
      "stroke",
      "none"
    )
    expect(screen.getByTestId("deliveries-sankey-link-0")).toHaveAttribute(
      "fill"
    )
    expect(screen.getByTestId("deliveries-sankey-link-4")).toBeInTheDocument()
    for (const linkIndex of [0, 1, 2, 3, 4]) {
      expect(
        screen.getByTestId(`deliveries-sankey-link-${linkIndex}`)
      ).toHaveAttribute("data-highlighted", "true")
      expect(
        screen.getByTestId(`deliveries-sankey-link-${linkIndex}`)
      ).not.toHaveAttribute("data-dimmed")
    }
    expect(
      document.querySelector('[data-sankey-node="failed"]')
    ).toBeInTheDocument()
    expect(screen.getByTestId("deliveries-sankey-chart").textContent).toContain(
      "Failed"
    )
  })

  it("highlights a delivery node and only its connected Sankey links on hover", () => {
    renderApp()

    const deliveredNode = document.querySelector(
      '[data-sankey-node="delivered"]'
    )
    expect(deliveredNode).toBeInTheDocument()

    fireEvent.mouseEnter(deliveredNode!)

    expect(deliveredNode).toHaveAttribute("data-highlighted", "true")
    expect(screen.getByTestId("deliveries-sankey-link-0")).toHaveAttribute(
      "data-highlighted",
      "true"
    )
    expect(screen.getByTestId("deliveries-sankey-link-2")).toHaveAttribute(
      "data-highlighted",
      "true"
    )
    expect(screen.getByTestId("deliveries-sankey-link-3")).toHaveAttribute(
      "data-highlighted",
      "true"
    )
    expect(screen.getByTestId("deliveries-sankey-link-4")).toHaveAttribute(
      "data-highlighted",
      "true"
    )
    expect(screen.getByTestId("deliveries-sankey-link-1")).toHaveAttribute(
      "data-dimmed",
      "true"
    )

    fireEvent.mouseLeave(deliveredNode!)

    expect(deliveredNode).not.toHaveAttribute("data-highlighted")
    expect(screen.getByTestId("deliveries-sankey-link-1")).not.toHaveAttribute(
      "data-dimmed"
    )
  })

  it("highlights the full delivery path when hovering an end node", () => {
    renderApp()

    const readNode = document.querySelector('[data-sankey-node="read"]')
    expect(readNode).toBeInTheDocument()

    fireEvent.mouseEnter(readNode!)

    expect(screen.getByTestId("deliveries-sankey-link-0")).toHaveAttribute(
      "data-highlighted",
      "true"
    )
    expect(screen.getByTestId("deliveries-sankey-link-2")).toHaveAttribute(
      "data-highlighted",
      "true"
    )
    expect(screen.getByTestId("deliveries-sankey-link-1")).toHaveAttribute(
      "data-dimmed",
      "true"
    )
    expect(screen.getByTestId("deliveries-sankey-link-3")).toHaveAttribute(
      "data-dimmed",
      "true"
    )
    expect(screen.getByTestId("deliveries-sankey-link-4")).toHaveAttribute(
      "data-dimmed",
      "true"
    )
  })

  it("renders a button clicks line chart with summary cards", () => {
    renderApp()

    expect(
      screen.getByRole("heading", { level: 2, name: "Button clicks" })
    ).toBeInTheDocument()
    expect(screen.getAllByText("Start free trial")[0]).toBeInTheDocument()
    expect(screen.getByText("214")).toBeInTheDocument()
    expect(screen.getByText("68.2% of button clicks")).toBeInTheDocument()
    expect(screen.getAllByText("View pricing")[0]).toBeInTheDocument()
    expect(screen.getByText("72")).toBeInTheDocument()
    expect(screen.getByText("22.9% of button clicks")).toBeInTheDocument()
    expect(screen.getAllByText("Talk to sales")[0]).toBeInTheDocument()
    expect(screen.getByText("28")).toBeInTheDocument()
    expect(screen.getByText("8.9% of button clicks")).toBeInTheDocument()
    expect(screen.getByTestId("button-clicks-chart")).toHaveAttribute(
      "data-slot",
      "chart"
    )
  })

  it("renders a failed reason share chart with failed message total", () => {
    renderApp()

    expect(
      screen.getByRole("heading", { level: 2, name: "Failed reason share" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Failed reasons are aggregated from real-time message status webhooks and may differ from Meta analytics before sync completes."
      )
    ).toBeInTheDocument()
    expect(
      screen.getAllByText("User phone number unrea...")[0]
    ).toBeInTheDocument()
    expect(
      screen.getAllByText("Template paused by quali...")[0]
    ).toBeInTheDocument()
    expect(screen.getByText("Rate limit")).toBeInTheDocument()
    expect(screen.getByText("Other")).toBeInTheDocument()
    expect(screen.getByText("42%")).toBeInTheDocument()
    expect(screen.getByText("Failed messages")).toBeInTheDocument()
    expect(screen.getAllByText("88")[1]).toBeInTheDocument()
    expect(screen.getByTestId("failed-reason-chart")).toHaveAttribute(
      "data-slot",
      "chart"
    )
  })

  it("renders iconfont icons from the imported asset package", () => {
    renderApp()

    expect(
      screen.getByRole("heading", { level: 2, name: "Iconfont icons" })
    ).toBeInTheDocument()
    expect(screen.getByText("icon-sohu_1")).toBeInTheDocument()
    expect(screen.getByText("icon-a-ycloudlogosingle")).toBeInTheDocument()
    expect(screen.getByText("icon-CRMguanli")).toBeInTheDocument()

    const sohuIcon = screen.getByRole("img", { name: "sohu_1" })
    expect(sohuIcon).toHaveClass("iconfont")
    expect(sohuIcon).toHaveClass("icon-sohu_1")

    const ycloudIcon = screen.getByRole("img", {
      name: "a-ycloudlogosingle",
    })
    expect(ycloudIcon).toHaveClass("icon-a-ycloudlogosingle")
  })

  it("renders a Base UI OTP field demo on the home page", () => {
    renderApp()

    expect(
      screen.getByRole("heading", { level: 2, name: "OTP Field" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("group", { name: "Verification code" })
    ).toHaveAttribute(
      "data-slot",
      "otp-field"
    )
    expect(document.querySelector('[data-slot="otp-field-input"]')).toHaveClass(
      "size-8"
    )
    expect(screen.getByText("123-456")).toBeInTheDocument()
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
