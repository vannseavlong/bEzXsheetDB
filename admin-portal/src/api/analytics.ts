import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { apiClient, buildQuery } from './client'
import { toast } from '@/hooks/use-toast'
import type { ListParams, ListResponse } from './createResourceHooks'

const BASE = '/admin/analytics'

export interface SyncRun {
  id: string
  source: 'bigquery' | 'ga4_history'
  status: 'RUNNING' | 'SUCCESS' | 'FAILED'
  trigger: 'manual' | 'schedule'
  triggeredBy: string | null
  startedAt: string
  finishedAt: string | null
  rowsFetched: number
  rowsInserted: number
  rowsSkipped: number
  bytesProcessed: number
  error: string | null
}

export interface AnalyticsStatus {
  configured: boolean
  project: string | null
  dataset: string | null
  intraday: boolean
  autoSyncMinutes: number
  maxRowsPerSync: number
  running: boolean
  configProblem: string | null
  totalEvents: number
  ga4Configured: boolean
  ga4PropertyId: string | null
  historyRows: number
  lastHistoryRun: SyncRun | null
  lastRun: SyncRun | null
  lastSuccess: SyncRun | null
}

export interface FunnelStep { step: string; users: number; pctOfFirst: number; pctOfPrevious: number }
export interface KeyCount { key: string; count: number }

export interface AnalyticsSummary {
  range: { from: string; to: string }
  totals: { events: number; users: number; sessions: number; journeys: number; checkoutValue: number }
  daily: { date: string; events: number; users: number }[]
  topEvents: KeyCount[]
  platforms: KeyCount[]
  topServices: KeyCount[]
  campaigns: KeyCount[]
  bookingFunnel: FunnelStep[]
  registrationFunnel: FunnelStep[]
}

export interface AnalyticsEvent {
  id: string
  eventId: string
  name: string
  occurredAt: string
  userPseudoId: string | null
  userId: string | null
  platform: string | null
  appVersion: string | null
  journeyId: string | null
  serviceId: number | null
  value: number | null
  currency: string | null
  campaign: string | null
  source: string | null
  params: Record<string, string | number>
}

export const useAnalyticsStatus = () =>
  useQuery({
    queryKey: ['analytics', 'status'],
    queryFn: () => apiClient.get<{ data: AnalyticsStatus }>(`${BASE}/status`).then((r) => r.data),
    // Poll only while a sync is in flight so the button/status flip back by themselves.
    refetchInterval: (q) => (q.state.data?.running ? 3000 : false),
  })

export const useAnalyticsSummary = (days: number) =>
  useQuery({
    queryKey: ['analytics', 'summary', days],
    queryFn: () => {
      const to = new Date().toISOString().slice(0, 10)
      const from = new Date(Date.now() - (days - 1) * 86_400_000).toISOString().slice(0, 10)
      return apiClient.get<{ data: AnalyticsSummary }>(`${BASE}/summary${buildQuery({ from, to })}`).then((r) => r.data)
    },
  })

export const useAnalyticsEvents = (params: ListParams) =>
  useQuery({
    queryKey: ['analytics', 'events', params],
    queryFn: () => apiClient.get<ListResponse<AnalyticsEvent>>(`${BASE}/events${buildQuery(params)}`),
    placeholderData: keepPreviousData,
  })

export const useSyncRuns = () =>
  useQuery({
    queryKey: ['analytics', 'sync-runs'],
    queryFn: () => apiClient.get<ListResponse<SyncRun>>(`${BASE}/sync-runs${buildQuery({ page: 1, limit: 10 })}`),
  })

export function useRunSync() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (days?: number) => apiClient.post<{ data: { rowsInserted: number; rowsFetched: number } }>(`${BASE}/sync`, { days }),
    onSuccess: ({ data }) => {
      toast({ title: 'BigQuery sync finished', description: `${data.rowsInserted} new events (${data.rowsFetched} fetched)` })
    },
    onError: (e) => toast({ title: 'Sync failed', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['analytics'] }),
  })
}

export interface AnalyticsHistory {
  available: { from: string | null; to: string | null }
  range: { from: string | null; to: string | null }
  totalEvents: number
  daily: { date: string; events: number }[]
  topEvents: { key: string; count: number; activeDays: number }[]
  platforms: KeyCount[]
  countries: KeyCount[]
}

export const useAnalyticsHistory = (range: { from?: string; to?: string }, poll: boolean) =>
  useQuery({
    queryKey: ['analytics', 'history', range],
    queryFn: () => apiClient.get<{ data: AnalyticsHistory }>(`${BASE}/history${buildQuery(range)}`).then((r) => r.data),
    refetchInterval: poll ? 5000 : false, // fills in live while a backfill is running
  })

export function useRunBackfill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { from?: string; to?: string }) => apiClient.post<{ message: string }>(`${BASE}/backfill`, body),
    onSuccess: () => toast({ title: 'Backfill started', description: 'Pulling GA4 history in the background — numbers appear as it runs.' }),
    onError: (e) => toast({ title: 'Backfill failed to start', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['analytics'] }),
  })
}
