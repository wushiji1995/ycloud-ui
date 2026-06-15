import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
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
      </section>
    </main>
  )
}

export default App
