import { useId, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Sankey,
  XAxis,
  YAxis,
} from "recharts"
import type { SankeyLinkProps, SankeyNodeProps } from "recharts"
import { toast } from "sonner"
import {
  Blocks,
  Bot,
  ChevronDown,
  Copy,
  Headphones,
  Info,
  MessageCircle,
  Plus,
  ShoppingCart,
  Trash2,
  Users,
  X,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  OtpField,
  OtpFieldGroup,
  OtpFieldInput,
  OtpFieldSeparator,
} from "@/components/ui/otp-field"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconFontIcon } from "@/components/iconfont-icon"
import { iconFontNames } from "@/lib/iconfont"
import { uiDensity } from "@/lib/ui-density"
import { cn } from "@/lib/utils"

type AssociatedContact = {
  name: string
  phone: string
}

type Agent = {
  name: string
  role?: string
  updatedAt: string
  createdAt: string
  updatedAtExact: string
  associatedContacts?: AssociatedContact[]
  contactAttributes?: string[]
  skills: number
}

const agents: Agent[] = [
  {
    name: "31",
    updatedAt: "6 hours ago",
    createdAt: "2026-06-12 09:15",
    updatedAtExact: "2026-06-12 11:42",
    skills: 0,
  },
  {
    name: "YCloud",
    updatedAt: "2 days ago",
    createdAt: "2026-06-10 09:24",
    updatedAtExact: "2026-06-10 18:02",
    associatedContacts: [{ name: "Ycloudbytester", phone: "+15557928087" }],
    skills: 1,
  },
  {
    name: "留资0610",
    updatedAt: "2 days ago",
    createdAt: "2026-06-10 10:31",
    updatedAtExact: "2026-06-10 17:48",
    skills: 0,
  },
  {
    name: "Onboarding UX Audit 0609",
    updatedAt: "3 days ago",
    createdAt: "2026-06-09 10:12",
    updatedAtExact: "2026-06-09 16:20",
    skills: 0,
  },
  {
    name: "123123",
    updatedAt: "3 days ago",
    createdAt: "2026-06-09 11:05",
    updatedAtExact: "2026-06-09 14:44",
    skills: 4,
  },
  {
    name: "线上~",
    updatedAt: "4 days ago",
    createdAt: "2026-06-08 08:40",
    updatedAtExact: "2026-06-08 19:16",
    skills: 1,
  },
  {
    name: "测试-lx",
    updatedAt: "4 days ago",
    createdAt: "2026-06-08 09:03",
    updatedAtExact: "2026-06-08 18:52",
    skills: 0,
  },
]

const tabItems = [
  { value: "ai", label: "AI Agent" },
  { value: "responsive", label: "Responsive AI Agent" },
  { value: "rule", label: "Rule-based Agent" },
]

const roleItems = [
  {
    value: "lead",
    label: "Lead acquisition",
    description: "Help you capture and qualify potential customer information.",
    icon: Users,
  },
  {
    value: "shop",
    label: "Shop assistant",
    description: "Guide customers to the right products instantly.",
    icon: ShoppingCart,
  },
  {
    value: "service",
    label: "Customer service",
    description: "Provide automated support for common inquiries.",
    icon: Headphones,
  },
  {
    value: "custom",
    label: "Custom agent",
    description: "Customize your AI agent for your own workflow.",
    icon: Blocks,
  },
]

const contactAttributeItems = [
  { value: "shopify-last-name", label: "Shopify Last Name" },
  { value: "shopify-first-name", label: "Shopify First Name" },
  {
    value: "shopify-email-marketing-consent",
    label: "Shopify Email Marketing Consent Opt In Level",
  },
  { value: "shopify-phone", label: "Shopify Phone Number" },
  { value: "shopify-email", label: "Shopify Email" },
  { value: "shopify-country", label: "Shopify Country" },
  { value: "shopify-city", label: "Shopify City" },
  { value: "shopify-tags", label: "Shopify Tags" },
  { value: "shopify-total-spent", label: "Shopify Total Spent" },
]

type CreateAgentValues = {
  name: string
  role: string
  contactAttributes: string[]
}

type DeliveryNode = {
  name: string
  label: string
  valueLabel: string
  percent?: string
  color: string
  barWidth?: string
  active?: boolean
}

const deliveryCardHeights = {
  sent: 92,
  delivered: 108,
  failed: 108,
  read: 108,
  clicks: 108,
  uniqueReplies: 108,
} as const

const deliveryCardY = {
  sent: 204,
  delivered: 134,
  failed: 294,
  read: 64,
  clicks: 198,
  uniqueReplies: 332,
} as const

const deliveryFlowSegments = {
  sent: {
    delivered: 1192 / 1280,
    failed: 88 / 1280,
  },
  delivered: {
    read: 826 / (826 + 314 + 182),
    clicks: 314 / (826 + 314 + 182),
    uniqueReplies: 182 / (826 + 314 + 182),
  },
} as const

const deliveryLinkRelations = [
  { source: "sent", target: "delivered" },
  { source: "sent", target: "failed" },
  { source: "delivered", target: "read" },
  { source: "delivered", target: "clicks" },
  { source: "delivered", target: "uniqueReplies" },
] as const

const deliveriesChartConfig = {
  sent: {
    label: "Sent",
    color: "oklch(58.5% 0.233 277.117)",
  },
  delivered: {
    label: "Delivered",
    color: "oklch(72.3% 0.219 149.579)",
  },
  failed: {
    label: "Failed",
    color: "oklch(70.8% 0 0)",
  },
  read: {
    label: "Read",
    color: "oklch(79.5% 0.184 86.047)",
  },
  clicks: {
    label: "Clicks",
    color: "oklch(58.5% 0.233 277.117)",
  },
  uniqueReplies: {
    label: "Unique replies",
    color: "oklch(62.3% 0.214 259.815)",
  },
} satisfies ChartConfig

const deliveriesSankeyData = {
  nodes: [
    {
      name: "sent",
      label: "Sent",
      valueLabel: "1,280",
      color: "var(--color-sent)",
      active: true,
    },
    {
      name: "delivered",
      label: "Delivered",
      valueLabel: "1,192",
      percent: "93.1%",
      color: "var(--color-delivered)",
      barWidth: "93.1%",
    },
    {
      name: "failed",
      label: "Failed",
      valueLabel: "88",
      percent: "6.9%",
      color: "var(--color-failed)",
      barWidth: "6.9%",
    },
    {
      name: "read",
      label: "Read",
      valueLabel: "826",
      percent: "69.3%",
      color: "var(--color-read)",
      barWidth: "69.3%",
    },
    {
      name: "clicks",
      label: "Clicks",
      valueLabel: "314",
      percent: "26.3%",
      color: "var(--color-clicks)",
      barWidth: "26.3%",
    },
    {
      name: "uniqueReplies",
      label: "Unique replies",
      valueLabel: "182",
      percent: "15.3%",
      color: "var(--color-uniqueReplies)",
      barWidth: "15.3%",
    },
  ],
  links: [
    { source: 0, target: 1, value: 1020, color: "var(--color-delivered)" },
    { source: 0, target: 2, value: 260, color: "var(--color-failed)" },
    { source: 1, target: 3, value: 637, color: "var(--color-read)" },
    { source: 1, target: 4, value: 241, color: "var(--color-clicks)" },
    {
      source: 1,
      target: 5,
      value: 142,
      color: "var(--color-uniqueReplies)",
    },
  ],
}

const buttonClickSummaryItems = [
  {
    key: "startFreeTrial",
    label: "Start free trial",
    value: 214,
    percentage: "68.2% of button clicks",
  },
  {
    key: "viewPricing",
    label: "View pricing",
    value: 72,
    percentage: "22.9% of button clicks",
  },
  {
    key: "talkToSales",
    label: "Talk to sales",
    value: 28,
    percentage: "8.9% of button clicks",
  },
] as const

const buttonClicksChartConfig = {
  startFreeTrial: {
    label: "Start free trial",
    color: "oklch(58.5% 0.233 277.117)",
  },
  viewPricing: {
    label: "View pricing",
    color: "oklch(79.5% 0.184 86.047)",
  },
  talkToSales: {
    label: "Talk to sales",
    color: "oklch(70.5% 0.213 47.604)",
  },
} satisfies ChartConfig

const buttonClicksChartData = [
  { day: "Jun 10", startFreeTrial: 20, viewPricing: 3, talkToSales: -2 },
  { day: "Jun 11", startFreeTrial: 24, viewPricing: 4, talkToSales: -3 },
  { day: "Jun 12", startFreeTrial: 28, viewPricing: 3, talkToSales: -2 },
  { day: "Jun 13", startFreeTrial: 41, viewPricing: 6, talkToSales: -3 },
  { day: "Jun 14", startFreeTrial: 32, viewPricing: 5, talkToSales: -3 },
  { day: "Jun 15", startFreeTrial: 39, viewPricing: 8, talkToSales: -1 },
  { day: "Jun 16", startFreeTrial: 7, viewPricing: 0, talkToSales: -7 },
]

const failedReasonChartConfig = {
  share: {
    label: "Share",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const failedReasonChartData = [
  { reason: "User phone number unrea...", share: 42 },
  { reason: "Template paused by quali...", share: 26 },
  { reason: "Rate limit", share: 18 },
  { reason: "Other", share: 14 },
]

const createAgentDefaultValues: CreateAgentValues = {
  name: "",
  role: roleItems[0].value,
  contactAttributes: ["shopify-last-name", "shopify-first-name"],
}

const agentNameRules = {
  maxLength: {
    value: 250,
    message: "Name must be 250 characters or fewer.",
  },
  pattern: {
    value: /^[A-Za-z0-9]+$/,
    message: "Use letters and numbers only.",
  },
  validate: (value: string) => value.trim().length > 0 || "Name is required.",
}

function AgentAvatar() {
  return (
    <div
      className={`flex ${uiDensity.avatar} shrink-0 items-center justify-center rounded-full ring-1 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-400/20`}
    >
      <Bot className={uiDensity.avatarIcon} aria-hidden="true" />
    </div>
  )
}

function AgentRow({
  agent,
  onDelete,
  onCopy,
}: {
  agent: Agent
  onDelete: (agentName: string) => void
  onCopy: (agentName: string) => void
}) {
  return (
    <Card
      role="article"
      aria-label={agent.name}
      className="rounded-lg py-0 shadow-none"
    >
      <CardContent className={`grid ${uiDensity.listRow} sm:items-center`}>
        <div className={`flex min-w-0 items-center ${uiDensity.rowMain}`}>
          <AgentAvatar />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{agent.name}</h2>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Last Updated {agent.updatedAt}</span>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-label={`Show timestamps for ${agent.name}`}
                      className="inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  }
                >
                  <Info className="size-3.5 shrink-0" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  sideOffset={uiDensity.tooltipSideOffset}
                >
                  <div className="grid gap-1">
                    <div>Created: {agent.createdAt}</div>
                    <div>Updated: {agent.updatedAtExact}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:contents">
          <AssociatedMetric
            agentName={agent.name}
            contacts={agent.associatedContacts ?? []}
          />
          <Metric label="Skills" value={agent.skills} />
        </div>

        <div className={`flex justify-end ${uiDensity.actions}`}>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Duplicate ${agent.name}`}
            title={`Duplicate ${agent.name}`}
            onClick={() => onCopy(agent.name)}
          >
            <Copy className="size-4" aria-hidden="true" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${agent.name}`}
                  title={`Delete ${agent.name}`}
                />
              }
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {agent.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The agent and its related data
                  will be removed from this list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => onDelete(agent.name)}
                >
                  Delete agent
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

function AssociatedMetric({
  agentName,
  contacts,
}: {
  agentName: string
  contacts: AssociatedContact[]
}) {
  if (contacts.length === 0) {
    return <Metric label="Associated" value={0} />
  }

  return (
    <div className="min-w-0">
      <div className={uiDensity.metricLabel}>Associated</div>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="xs"
              aria-label={`View associated contacts for ${agentName}`}
              className="mt-0.5 -ml-2 tabular-nums"
            />
          }
        >
          {contacts.length}
          <ChevronDown
            data-icon="inline-end"
            className="size-3"
            aria-hidden="true"
          />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80">
          <PopoverHeader>
            <PopoverTitle>Associated numbers</PopoverTitle>
          </PopoverHeader>
          <div className="grid gap-2">
            {contacts.map((contact) => (
              <div
                key={`${contact.name}-${contact.phone}`}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-muted"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium">{contact.name}</div>
                  <div className="truncate text-muted-foreground">
                    {contact.name}
                    {contact.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <div className={uiDensity.metricLabel}>{label}</div>
      <div className={uiDensity.metricValue}>{value}</div>
    </div>
  )
}

function EmptyPanel({ title }: { title: string }) {
  return (
    <div
      className={`rounded-lg border border-dashed bg-card ${uiDensity.emptyState} text-sm text-muted-foreground`}
    >
      No {title.toLowerCase()} have been added yet.
    </div>
  )
}

function ContactAttributesMultiSelect({
  selectedValues,
  onChange,
}: {
  selectedValues: string[]
  onChange: (selectedValues: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedItems = contactAttributeItems.filter((item) =>
    selectedValues.includes(item.value)
  )

  function toggleAttribute(value: string) {
    onChange(
      selectedValues.includes(value)
        ? selectedValues.filter((selectedValue) => selectedValue !== value)
        : [...selectedValues, value]
    )
  }

  function removeAttribute(value: string) {
    onChange(selectedValues.filter((selectedValue) => selectedValue !== value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <div
            role="combobox"
            tabIndex={0}
            aria-label="Choose contact attributes"
            aria-controls="contact-attributes-listbox"
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto min-h-9 w-full cursor-default justify-between px-2 py-1.5 font-normal"
            )}
          />
        }
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-left">
          {selectedItems.length === 0 ? (
            <span className="text-muted-foreground">Please select</span>
          ) : (
            <>
              {selectedItems.slice(0, 3).map((item) => (
                <Badge key={item.value} variant="secondary">
                  {item.label}
                  <button
                    type="button"
                    aria-label={`Remove ${item.label}`}
                    className="-mr-1 inline-flex size-3.5 items-center justify-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                    onPointerDown={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      removeAttribute(item.value)
                    }}
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </Badge>
              ))}
              {selectedItems.length > 3 && (
                <span className="text-sm text-muted-foreground">
                  +{selectedItems.length - 3}
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          data-icon="inline-end"
          className="size-4 opacity-50"
          aria-hidden="true"
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Search contact attributes..." />
          <CommandList id="contact-attributes-listbox">
            <CommandEmpty>No attributes found.</CommandEmpty>
            <CommandGroup>
              {contactAttributeItems.map((item) => {
                const isSelected = selectedValues.includes(item.value)

                return (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    role="option"
                    aria-selected={isSelected}
                    data-checked={isSelected ? "true" : undefined}
                    className={isSelected ? "bg-muted text-foreground" : ""}
                    onSelect={() => {
                      toggleAttribute(item.value)
                      setOpen(false)
                    }}
                  >
                    {item.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function CreateAgentDialog({ onCreate }: { onCreate: (agent: Agent) => void }) {
  const [open, setOpen] = useState(false)
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateAgentValues>({
    defaultValues: createAgentDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  })
  const name = useWatch({ control, name: "name" }) ?? ""

  function resetForm() {
    reset(createAgentDefaultValues)
  }

  function createAgent(values: CreateAgentValues) {
    onCreate({
      name: values.name.trim(),
      role: values.role,
      updatedAt: "just now",
      createdAt: "2026-06-15 15:45",
      updatedAtExact: "2026-06-15 15:45",
      contactAttributes: values.contactAttributes,
      skills: 0,
    })
    setOpen(false)
    resetForm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" className="size-4" aria-hidden="true" />
        Create Agent
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create AI Agent</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(createAgent)} className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="agent-name">Name</Label>
              <span className="text-xs text-muted-foreground">
                {name.length}/250
              </span>
            </div>
            <Input
              id="agent-name"
              maxLength={250}
              placeholder="Enter a name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "agent-name-error" : undefined}
              {...register("name", agentNameRules)}
            />
            {errors.name && (
              <p id="agent-name-error" className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <div className="grid gap-3">
                <Label>Role</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {roleItems.map((item) => {
                    const Icon = item.icon
                    const isSelected = field.value === item.value

                    return (
                      <button
                        key={item.value}
                        type="button"
                        aria-label={item.label}
                        aria-pressed={isSelected}
                        className={`rounded-lg border bg-card p-3 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 ${
                          isSelected ? "border-ring ring-2 ring-ring/40" : ""
                        }`}
                        onClick={() => field.onChange(item.value)}
                      >
                        <span
                          data-slot="role-icon"
                          className="mb-3 flex size-5 items-center justify-center"
                          aria-hidden="true"
                        >
                          <Icon className="block size-4" />
                        </span>
                        <div className="font-medium">{item.label}</div>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          />

          <Controller
            control={control}
            name="contactAttributes"
            render={({ field }) => (
              <div className="grid gap-2">
                <Label>
                  Choose the contact attributes you want AI Agent to save for
                  user data
                </Label>
                <ContactAttributesMultiSelect
                  selectedValues={field.value}
                  onChange={field.onChange}
                />
              </div>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={name.trim().length === 0}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeliverySankeyNode({
  hoveredNode,
  onHoverNode,
  payload,
  width,
  x,
}: SankeyNodeProps & {
  hoveredNode: string | null
  onHoverNode: (nodeName: string | null) => void
}) {
  const node = payload as SankeyNodeProps["payload"] & DeliveryNode
  const cardHeight = getDeliveryCardHeight(node.name)
  const cardY = getDeliveryCardY(node)
  const isHighlighted = hoveredNode === node.name

  return (
    <foreignObject
      x={x}
      y={cardY}
      width={width}
      height={cardHeight}
      className="overflow-visible"
    >
      <div
        data-sankey-node={node.name}
        data-highlighted={isHighlighted ? "true" : undefined}
        onMouseEnter={() => onHoverNode(node.name)}
        onMouseLeave={() => onHoverNode(null)}
        className={cn(
          "h-full rounded-lg border bg-background/95 p-4 shadow-sm backdrop-blur-sm transition-all",
          node.active && "border-primary ring-2 ring-primary shadow-md",
          isHighlighted && "border-primary ring-2 ring-primary shadow-lg"
        )}
      >
        <div className="grid gap-3">
          <div className="grid gap-1">
            <div className="text-sm font-semibold">{node.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold tabular-nums tracking-tight">
                {node.valueLabel}
              </div>
              {node.percent && (
                <div className="text-xs font-semibold text-muted-foreground">
                  {node.percent}
                </div>
              )}
            </div>
          </div>
          {node.barWidth && (
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: node.barWidth,
                  backgroundColor: node.color,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </foreignObject>
  )
}

function DeliverySankeyLink({
  hoveredNode,
  index,
  payload,
  sourceControlX,
  sourceX,
  targetControlX,
  targetX,
}: SankeyLinkProps & {
  hoveredNode: string | null
}) {
  const link = payload as SankeyLinkProps["payload"] & { color?: string }
  const source = link.source as SankeyLinkProps["payload"]["source"] &
    DeliveryNode
  const target = link.target as SankeyLinkProps["payload"]["target"] &
    DeliveryNode
  const sourcePort = getDeliverySourcePort(source, target.name)
  const targetPort = getDeliveryTargetPort(target)
  const color = link.color ?? "var(--color-sent)"
  const isHighlighted =
    hoveredNode === null ||
    isDeliveryLinkInHighlightedPath(hoveredNode, source.name, target.name)
  const isConnected = hoveredNode === null || isHighlighted

  return (
    <path
      data-testid={`deliveries-sankey-link-${index}`}
      data-highlighted={isHighlighted ? "true" : undefined}
      data-dimmed={!isConnected ? "true" : undefined}
      d={[
        `M${sourceX},${sourcePort.top}`,
        `C${sourceControlX},${sourcePort.top} ${targetControlX},${targetPort.top} ${targetX},${targetPort.top}`,
        `L${targetX},${targetPort.bottom}`,
        `C${targetControlX},${targetPort.bottom} ${sourceControlX},${sourcePort.bottom} ${sourceX},${sourcePort.bottom}`,
        "Z",
      ].join(" ")}
      fill={color}
      fillOpacity={isConnected ? 0.42 : 0.06}
      stroke="none"
      className="transition-opacity duration-200"
    />
  )
}

function isDeliveryLinkInHighlightedPath(
  hoveredNode: string,
  sourceName: string,
  targetName: string
) {
  const pathLinks = getDeliveryHighlightedLinks(hoveredNode)

  return pathLinks.some(
    (link) => link.source === sourceName && link.target === targetName
  )
}

function getDeliveryHighlightedLinks(hoveredNode: string) {
  const highlightedLinks: Array<{ source: string; target: string }> = []
  const visitedUpstream = new Set<string>()
  const visitedDownstream = new Set<string>()

  function collectUpstream(nodeName: string) {
    if (visitedUpstream.has(nodeName)) {
      return
    }
    visitedUpstream.add(nodeName)

    deliveryLinkRelations
      .filter((link) => link.target === nodeName)
      .forEach((link) => {
        highlightedLinks.push(link)
        collectUpstream(link.source)
      })
  }

  function collectDownstream(nodeName: string) {
    if (visitedDownstream.has(nodeName)) {
      return
    }
    visitedDownstream.add(nodeName)

    deliveryLinkRelations
      .filter((link) => link.source === nodeName)
      .forEach((link) => {
        highlightedLinks.push(link)
        collectDownstream(link.target)
      })
  }

  collectUpstream(hoveredNode)
  collectDownstream(hoveredNode)

  return highlightedLinks
}

function getDeliveryCardHeight(nodeName: string) {
  return (
    deliveryCardHeights[nodeName as keyof typeof deliveryCardHeights] ??
    deliveryCardHeights.delivered
  )
}

function getDeliveryCardY(node: SankeyLinkProps["payload"]["source"]) {
  const namedNode = node as SankeyLinkProps["payload"]["source"] & DeliveryNode
  return (
    deliveryCardY[namedNode.name as keyof typeof deliveryCardY] ??
    namedNode.y + namedNode.dy / 2 - getDeliveryCardHeight(namedNode.name) / 2
  )
}

function getDeliverySourcePort(
  source: SankeyLinkProps["payload"]["source"] & DeliveryNode,
  targetName: string
) {
  const cardY = getDeliveryCardY(source)
  const cardHeight = getDeliveryCardHeight(source.name)

  if (source.name === "sent") {
    const deliveredHeight = cardHeight * deliveryFlowSegments.sent.delivered
    if (targetName === "delivered") {
      return { top: cardY, bottom: cardY + deliveredHeight }
    }

    return {
      top: cardY + deliveredHeight,
      bottom: cardY + cardHeight,
    }
  }

  if (source.name === "delivered") {
    const readHeight = cardHeight * deliveryFlowSegments.delivered.read
    const clicksHeight = cardHeight * deliveryFlowSegments.delivered.clicks

    if (targetName === "read") {
      return { top: cardY, bottom: cardY + readHeight }
    }

    if (targetName === "clicks") {
      return {
        top: cardY + readHeight,
        bottom: cardY + readHeight + clicksHeight,
      }
    }

    return {
      top: cardY + readHeight + clicksHeight,
      bottom: cardY + cardHeight,
    }
  }

  return { top: cardY, bottom: cardY + cardHeight }
}

function getDeliveryTargetPort(
  target: SankeyLinkProps["payload"]["target"] & DeliveryNode
) {
  const cardY = getDeliveryCardY(target)
  return {
    top: cardY,
    bottom: cardY + getDeliveryCardHeight(target.name),
  }
}

function DeliveriesSankeyTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    payload?: Partial<DeliveryNode>
  }>
}) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]
  const node = item.payload

  return (
    <div className="grid min-w-32 gap-1.5 rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-sm ring-1 ring-foreground/10">
      <div className="font-medium">{node?.label ?? item.name}</div>
      <div className="flex items-center justify-between gap-4 text-muted-foreground">
        <span>Value</span>
        <span className="font-mono font-medium text-foreground tabular-nums">
          {node?.valueLabel ?? item.value}
        </span>
      </div>
    </div>
  )
}

function DeliveriesSankeyCard() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-semibold">Deliveries</h2>
      </div>
      <div className="min-h-[460px] overflow-visible">
        <ChartContainer
          data-testid="deliveries-sankey-chart"
          config={deliveriesChartConfig}
          className="h-[460px] min-h-[460px] w-full max-w-none aspect-auto overflow-visible"
          initialDimension={{ width: 1200, height: 460 }}
        >
          <Sankey
            data={deliveriesSankeyData}
            dataKey="value"
            nameKey="label"
            align="left"
            verticalAlign="top"
            nodePadding={28}
            nodeWidth={240}
            linkCurvature={0.48}
            margin={{ top: 56, right: 48, bottom: 56, left: 48 }}
            node={(props) => (
              <DeliverySankeyNode
                {...props}
                hoveredNode={hoveredNode}
                onHoverNode={setHoveredNode}
              />
            )}
            link={(props) => (
              <DeliverySankeyLink {...props} hoveredNode={hoveredNode} />
            )}
            sort={false}
          >
            <ChartTooltip
              cursor={false}
              isAnimationActive={false}
              content={<DeliveriesSankeyTooltip />}
            />
          </Sankey>
        </ChartContainer>
      </div>
    </section>
  )
}

function ButtonClicksChartCard() {
  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="text-base font-semibold">Button clicks</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {buttonClickSummaryItems.map((item) => (
          <div key={item.key} className="rounded-md bg-muted/40 p-4">
            <div className="text-sm font-semibold">{item.label}</div>
            <div className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {item.percentage}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-4 text-xs text-muted-foreground">
        {buttonClickSummaryItems.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{
                backgroundColor:
                  buttonClicksChartConfig[
                    item.key as keyof typeof buttonClicksChartConfig
                  ].color,
              }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <ChartContainer
        data-testid="button-clicks-chart"
        config={buttonClicksChartConfig}
        className="mt-4 h-80 min-h-80 w-full"
        initialDimension={{ width: 960, height: 320 }}
      >
        <LineChart
          accessibilityLayer
          data={buttonClicksChartData}
          margin={{ top: 12, right: 28, bottom: 8, left: 8 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="2 4" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} hide />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={36}
            domain={[-8, 50]}
            ticks={[0, 13, 25, 38, 50]}
          />
          <ChartTooltip
            cursor={false}
            isAnimationActive={false}
            content={<ChartTooltipContent />}
          />
          <Line
            dataKey="startFreeTrial"
            type="monotone"
            stroke="var(--color-startFreeTrial)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--color-startFreeTrial)" }}
            activeDot={{ r: 5 }}
          />
          <Line
            dataKey="viewPricing"
            type="monotone"
            stroke="var(--color-viewPricing)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--color-viewPricing)" }}
            activeDot={{ r: 5 }}
          />
          <Line
            dataKey="talkToSales"
            type="monotone"
            stroke="var(--color-talkToSales)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--color-talkToSales)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </section>
  )
}

function FailedReasonShareCard() {
  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="text-base font-semibold">Failed reason share</h2>
      <p className="mt-5 text-sm text-muted-foreground">
        Failed reasons are aggregated from real-time message status webhooks and
        may differ from Meta analytics before sync completes.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
        <div className="relative">
          <ChartContainer
            data-testid="failed-reason-chart"
            config={failedReasonChartConfig}
            className="h-48 min-h-48 w-full pr-14"
            initialDimension={{ width: 760, height: 192 }}
          >
            <BarChart
              accessibilityLayer
              data={failedReasonChartData}
              layout="vertical"
              margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                dataKey="reason"
                type="category"
                tickLine={false}
                axisLine={false}
                width={190}
              />
              <ChartTooltip
                cursor={false}
                isAnimationActive={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="share"
                fill="var(--color-share)"
                radius={4}
                background={{ fill: "var(--muted)" }}
                barSize={8}
              />
            </BarChart>
          </ChartContainer>

          <div className="pointer-events-none absolute top-0 right-0 grid h-48 w-12 content-around text-right text-xs font-semibold text-foreground">
            {failedReasonChartData.map((item) => (
              <div key={item.reason}>{item.share}%</div>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-muted/40 p-5">
          <div className="text-sm font-semibold">Failed messages</div>
          <div className="mt-2 text-4xl font-bold tracking-tight tabular-nums">
            88
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Share is calculated within failed messages only.
          </div>
        </div>
      </div>
    </section>
  )
}

function OtpFieldDemoCard() {
  const id = useId()
  const descriptionId = `${id}-description`

  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="grid gap-1.5">
        <h2 className="text-base font-semibold">OTP Field</h2>
        <p className="text-sm text-muted-foreground">
          Verify sensitive actions with a short one-time code.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="grid gap-2">
            <Label htmlFor={id}>Verification code</Label>
            <OtpField
              id={id}
              aria-label="Verification code"
              aria-describedby={descriptionId}
              defaultValue="123456"
              length={6}
            >
              <OtpFieldGroup>
                {Array.from({ length: 3 }, (_, index) => (
                  <OtpFieldInput
                    key={index}
                    aria-label={
                      index === 0 ? undefined : `Character ${index + 1} of 6`
                    }
                  />
                ))}
              </OtpFieldGroup>
              <OtpFieldSeparator />
              <OtpFieldGroup>
                {Array.from({ length: 3 }, (_, index) => (
                  <OtpFieldInput
                    key={index + 3}
                    aria-label={`Character ${index + 4} of 6`}
                  />
                ))}
              </OtpFieldGroup>
            </OtpField>
          </div>

          <div className="rounded-md bg-muted/40 px-3 py-2 text-right">
            <div className="text-xs text-muted-foreground">Example format</div>
            <div className="mt-1 font-mono text-sm font-semibold tabular-nums">
              123-456
            </div>
          </div>
        </div>
        <p id={descriptionId} className="text-xs text-muted-foreground">
          Codes can be pasted, typed, or autofilled from compatible devices.
        </p>
      </div>
    </section>
  )
}

function IconFontPreviewCard() {
  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="text-base font-semibold">Iconfont icons</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {iconFontNames.map((iconName) => (
          <div
            key={iconName}
            className="flex items-center gap-3 rounded-md border bg-background p-4"
          >
            <div className="flex size-10 items-center justify-center rounded-md bg-green-500/10 text-green-600 dark:text-green-400">
              <IconFontIcon
                name={iconName}
                label={iconName}
                className="text-2xl"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{iconName}</div>
              <div className="truncate text-xs text-muted-foreground">
                icon-{iconName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function copyAgent(agentName: string) {
  toast.success("Agent copied", {
    description: `${agentName} has been duplicated.`,
  })
}

export function App() {
  const [visibleAgents, setVisibleAgents] = useState(agents)

  function createAgent(agent: Agent) {
    setVisibleAgents((currentAgents) => [agent, ...currentAgents])
  }

  function deleteAgent(agentName: string) {
    setVisibleAgents((currentAgents) =>
      currentAgents.filter((agent) => agent.name !== agentName)
    )
  }

  return (
    <main className={`min-h-svh bg-muted/40 ${uiDensity.page} text-foreground`}>
      <section
        className={`mx-auto flex w-full max-w-7xl flex-col ${uiDensity.pageSection}`}
      >
        <div className="relative h-40 w-40 overflow-hidden rounded-b-lg bg-purple-500 text-sm text-purple-950 transition-colors duration-300 ease-out before:absolute before:inset-0 before:bg-linear-to-r before:from-violet-200 before:to-purple-500 before:transition-opacity before:duration-300 before:ease-out hover:text-white hover:before:opacity-0">
          <span className="relative z-10">hello</span>
        </div>
        <header className={uiDensity.header}>
          <div className="space-y-1.5">
            <h1 className={uiDensity.headerTitle}>AI Agent</h1>
            <p className="text-sm text-muted-foreground">
              Build and manage your Agents from one place.
            </p>
          </div>
          <CreateAgentDialog onCreate={createAgent} />
        </header>

        <Tabs defaultValue="ai" className={uiDensity.tabs}>
          <TabsList
            variant="line"
            className="max-w-full justify-start overflow-x-auto"
          >
            {tabItems.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="ai" className={uiDensity.list}>
            {visibleAgents.map((agent) => (
              <AgentRow
                key={agent.name}
                agent={agent}
                onDelete={deleteAgent}
                onCopy={copyAgent}
              />
            ))}
          </TabsContent>
          <TabsContent value="responsive">
            <EmptyPanel title="Responsive AI Agent" />
          </TabsContent>
          <TabsContent value="rule">
            <EmptyPanel title="Rule-based Agent" />
          </TabsContent>
        </Tabs>

        <DeliveriesSankeyCard />
        <ButtonClicksChartCard />
        <FailedReasonShareCard />
        <OtpFieldDemoCard />
        <IconFontPreviewCard />
      </section>
    </main>
  )
}

export default App
