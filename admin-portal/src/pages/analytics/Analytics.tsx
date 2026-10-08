import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, AlertTriangle, DatabaseZap, RefreshCw, Route, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OverviewCard } from '@/components/shared/OverviewCard'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'
import {
  useAnalyticsEvents,
  useAnalyticsHistory,
  useRunBackfill,
  useAnalyticsStatus,
  useAnalyticsSummary,
  useRunSync,
  useSyncRuns,
  type FunnelStep,
  type KeyCount,
} from '@/api/analytics'

const RANGES = [
  { value: '7', label: 'Last 7 days' },
  { value: '14', label: 'Last 14 days' },
  { value: '30', label: 'Last 30 days' },
]

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n)
const fmtDate = (iso: string | null, pattern = 'dd MMM, HH:mm') => {
  if (!iso) return '—'
  try { return format(parseISO(iso), pattern) } catch { return iso }
}
const label = (s: string) => s.replace(/_/g, ' ')

function FunnelCard({ title, steps, isLoading }: { title: string; steps: FunnelStep[]; isLoading: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
          : steps.map((s, i) => (
              <div key={s.step}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium capitalize">{label(s.step)}</span>
                  <span className="text-muted-foreground">
                    {fmt(s.users)} users
                    {i > 0 && <span className="ml-2 text-xs">({Math.round(s.pctOfPrevious * 100)}% of previous)</span>}
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(s.pctOfFirst * 100, s.users ? 2 : 0)}%` }} />
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  )
}

function RankList({ title, rows, isLoading, format: render = label }: { title: string; rows: KeyCount[]; isLoading: boolean; format?: (k: string) => string }) {
  const max = rows[0]?.count ?? 1
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? <Skeleton className="h-24 w-full" /> : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data in this range.</p>
        ) : rows.map((r) => (
          <div key={r.key} className="text-sm">
            <div className="flex justify-between"><span className="truncate pr-2">{render(r.key)}</span><span className="text-muted-foreground">{fmt(r.count)}</span></div>
            <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary/70" style={{ width: `${(r.count / max) * 100}%` }} /></div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function Analytics() {
  const { hasPermission } = usePermission()
  const canSync = hasPermission(MODULES.ANALYTICS, ACTIONS.UPDATE)
  const [days, setDays] = useState('7')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const status = useAnalyticsStatus()
  const summary = useAnalyticsSummary(Number(days))
  const events = useAnalyticsEvents({ page, limit: 20, search })
  const runs = useSyncRuns()
  const sync = useRunSync()
  const backfill = useRunBackfill()
  const [histFrom, setHistFrom] = useState('')

  const s = status.data
  const t = summary.data?.totals
  const loading = summary.isLoading
  const busy = sync.isPending || s?.running
  const history = useAnalyticsHistory({}, Boolean(s?.running))
  const h = history.data

  return (
    <div className="h-full space-y-4 overflow-y-auto p-4">
      {/* Status / sync bar */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0F7] text-[#102C90]"><DatabaseZap className="h-4 w-4" /></div>
            <div className="text-sm">
              {s && !s.configured ? (
                <>
                  <div className="font-medium">BigQuery not connected</div>
                  <div className="text-muted-foreground">Set <code>BQ_PROJECT_ID</code> and <code>BQ_DATASET</code> on the backend — see Docs/tracking/bigquery-setup-guide.md.</div>
                </>
              ) : (
                <>
                  <div className="font-medium">Firebase → BigQuery <span className="font-mono text-xs text-muted-foreground">{s?.project}.{s?.dataset}</span></div>
                  <div className="text-muted-foreground">
                    {s ? `${fmt(s.totalEvents)} events stored · last synced ${fmtDate(s.lastSuccess?.finishedAt ?? null)}` : 'Loading…'}
                    {s?.autoSyncMinutes ? ` · auto every ${s.autoSyncMinutes} min` : ' · manual sync'}
                  </div>
                  {s?.lastRun?.status === 'FAILED' && (
                    <div className="mt-1 flex items-center gap-1 text-destructive"><AlertTriangle className="h-3.5 w-3.5" />{s.lastRun.error}</div>
                  )}
                  {s?.configProblem && <div className="text-destructive">{s.configProblem}</div>}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>{RANGES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
            {canSync && (
              <Button disabled={!s?.configured || busy} onClick={() => sync.mutate(undefined)}>
                <RefreshCw className={`mr-2 h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
                {busy ? 'Syncing…' : 'Sync now'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <OverviewCard title="Events" value={loading ? '…' : fmt(t?.events ?? 0)} icon={Activity} tone="blue" description="All Firebase events stored" />
        <OverviewCard title="Users" value={loading ? '…' : fmt(t?.users ?? 0)} icon={Users} tone="green" description="Registered + guest devices" />
        <OverviewCard title="Journeys" value={loading ? '…' : fmt(t?.journeys ?? 0)} icon={Route} tone="amber" description="Distinct journey_id" />
        <OverviewCard title="Checkout value" value={loading ? '…' : `$${fmt(Math.round(t?.checkoutValue ?? 0))}`} icon={Wallet} tone="purple" description="Sum of checkout_started" />
      </div>

      {/* Trend */}
      <Card>
        <CardHeader><CardTitle>Daily events & users</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.data?.daily} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(d) => fmtDate(d, 'dd MMM')} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip labelFormatter={(d) => fmtDate(String(d), 'dd MMM yyyy')} />
                  <Legend />
                  <Area type="monotone" dataKey="events" name="Events" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.12} strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="users" name="Users" stroke="#06C270" fill="#06C270" fillOpacity={0.1} strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Funnels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FunnelCard title="Booking funnel (unique users)" steps={summary.data?.bookingFunnel ?? []} isLoading={loading} />
        <FunnelCard title="Registration funnel (unique users)" steps={summary.data?.registrationFunnel ?? []} isLoading={loading} />
      </div>

      {/* Breakdowns */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RankList title="Top events" rows={summary.data?.topEvents.slice(0, 8) ?? []} isLoading={loading} />
        <RankList title="Platforms" rows={summary.data?.platforms ?? []} isLoading={loading} format={(k) => k} />
        <RankList title="Most viewed services (id)" rows={summary.data?.topServices ?? []} isLoading={loading} format={(k) => `Service #${k}`} />
        <RankList title="Campaigns" rows={summary.data?.campaigns ?? []} isLoading={loading} format={(k) => k} />
      </div>

      {/* Raw data */}
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">History (GA4)</TabsTrigger>
          <TabsTrigger value="events">Event stream</TabsTrigger>
          <TabsTrigger value="runs">Sync history</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="text-sm">
                  <div className="font-medium">Daily history from the Google Analytics API</div>
                  <div className="text-muted-foreground">
                    BigQuery only exports from the day it was linked. This pulls everything earlier, as counts per day × event × platform × country (no per-user rows).
                    {h?.available.from ? ` Stored: ${h.available.from} → ${h.available.to}.` : ' Nothing stored yet.'}
                  </div>
                  {s?.lastHistoryRun?.status === 'FAILED' && (
                    <div className="mt-1 flex items-center gap-1 text-destructive"><AlertTriangle className="h-3.5 w-3.5" />{s.lastHistoryRun.error}</div>
                  )}
                </div>
                {canSync && (
                  <div className="flex items-center gap-2">
                    <Input type="date" className="h-9 w-[160px]" value={histFrom} onChange={(e) => setHistFrom(e.target.value)} title="Leave empty to pull all available history" />
                    <Button disabled={!s?.ga4Configured || busy} onClick={() => backfill.mutate({ from: histFrom || undefined })}>
                      <DatabaseZap className="mr-2 h-4 w-4" />
                      {busy && s?.running ? 'Running…' : histFrom ? 'Backfill from date' : 'Backfill all history'}
                    </Button>
                  </div>
                )}
              </div>

              <div className="h-[220px] w-full">
                {history.isLoading ? <Skeleton className="h-full w-full" /> : !h?.daily.length ? (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No history yet — run a backfill.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={h.daily} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={40} tickFormatter={(d) => fmtDate(d, 'dd MMM yy')} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip labelFormatter={(d) => fmtDate(String(d), 'dd MMM yyyy')} />
                      <Area type="monotone" dataKey="events" name="Events" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.12} strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Table>
                    <TableHeader><TableRow><TableHead>Event</TableHead><TableHead className="text-right">Total events</TableHead><TableHead className="text-right">Active days</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {(h?.topEvents ?? []).map((e) => (
                        <TableRow key={e.key}>
                          <TableCell><Badge variant="outline" className="font-mono text-xs">{e.key}</Badge></TableCell>
                          <TableCell className="text-right">{fmt(e.count)}</TableCell>
                          <TableCell className="text-right">{fmt(e.activeDays)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="space-y-4">
                  <RankList title="Platforms" rows={h?.platforms ?? []} isLoading={history.isLoading} format={(k) => k} />
                  <RankList title="Countries" rows={h?.countries ?? []} isLoading={history.isLoading} format={(k) => k} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardContent className="space-y-3 p-4">
              <Input className="max-w-sm" placeholder="Search event, user, journey, campaign…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Time</TableHead><TableHead>Event</TableHead><TableHead>User</TableHead><TableHead>Platform</TableHead><TableHead>Service</TableHead><TableHead>Value</TableHead><TableHead>Params</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {(events.data?.data ?? []).map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="whitespace-nowrap text-sm">{fmtDate(e.occurredAt)}</TableCell>
                      <TableCell><Badge variant="outline" className="font-mono text-xs">{e.name}</Badge></TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{(e.userId ?? e.userPseudoId ?? '—').slice(0, 12)}</TableCell>
                      <TableCell className="text-sm">{e.platform ?? '—'}</TableCell>
                      <TableCell className="text-sm">{e.serviceId ?? '—'}</TableCell>
                      <TableCell className="text-sm">{e.value != null ? `${e.value} ${e.currency ?? ''}` : '—'}</TableCell>
                      <TableCell className="max-w-[260px] truncate font-mono text-xs text-muted-foreground" title={JSON.stringify(e.params)}>{JSON.stringify(e.params)}</TableCell>
                    </TableRow>
                  ))}
                  {!events.isLoading && !events.data?.data.length && (
                    <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No events yet — run a sync.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{fmt(events.data?.meta.total ?? 0)} events</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                  <span>Page {page} / {events.data?.meta.totalPages ?? 1}</span>
                  <Button variant="outline" size="sm" disabled={page >= (events.data?.meta.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runs">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Started</TableHead><TableHead>Source</TableHead><TableHead>Status</TableHead><TableHead>Trigger</TableHead><TableHead>Fetched</TableHead><TableHead>Inserted</TableHead><TableHead>Skipped (dupes)</TableHead><TableHead>Scanned</TableHead><TableHead>Error</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {(runs.data?.data ?? []).map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-sm">{fmtDate(r.startedAt)}</TableCell>
                      <TableCell className="text-sm">{r.source === 'ga4_history' ? 'GA4 history' : 'BigQuery'}</TableCell>
                      <TableCell><Badge variant={r.status === 'SUCCESS' ? 'approve' : r.status === 'FAILED' ? 'reject' : 'warning'}>{r.status}</Badge></TableCell>
                      <TableCell className="text-sm">{r.trigger}{r.triggeredBy ? ` · ${r.triggeredBy}` : ''}</TableCell>
                      <TableCell>{fmt(r.rowsFetched)}</TableCell>
                      <TableCell>{fmt(r.rowsInserted)}</TableCell>
                      <TableCell>{fmt(r.rowsSkipped)}</TableCell>
                      <TableCell className="text-sm">{(r.bytesProcessed / 1024 / 1024).toFixed(1)} MB</TableCell>
                      <TableCell className="max-w-[240px] truncate text-xs text-destructive" title={r.error ?? ''}>{r.error ?? ''}</TableCell>
                    </TableRow>
                  ))}
                  {!runs.isLoading && !runs.data?.data.length && (
                    <TableRow><TableCell colSpan={9} className="py-8 text-center text-muted-foreground">No syncs yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
