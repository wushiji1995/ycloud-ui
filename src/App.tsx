import { useState } from "react"
import { toast } from "sonner"
import {
  Bot,
  ChevronDown,
  Copy,
  Info,
  MessageCircle,
  Plus,
  Trash2,
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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

type AssociatedContact = {
  name: string
  phone: string
}

type Agent = {
  name: string
  updatedAt: string
  createdAt: string
  updatedAtExact: string
  associatedContacts?: AssociatedContact[]
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

function copyAgent(agentName: string) {
  toast.success("Agent copied", {
    description: `${agentName} has been duplicated.`,
  })
}

export function App() {
  const [visibleAgents, setVisibleAgents] = useState(agents)

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
          <Button>
            <Plus
              data-icon="inline-start"
              className="size-4"
              aria-hidden="true"
            />
            Create Agent
          </Button>
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
