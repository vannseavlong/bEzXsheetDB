// Read-only: pulls monthly Google Analytics 4 numbers for the marketing export and writes them to a JSON file.
// It calls the GA4 Data API only. It does NOT touch the database, the sheets or the analytics_* tables.
//
// Run (from backendSheetDB):
//   npx tsx scripts/ga4-marketing-fill.ts --months 2026-08,2026-09 --out ga4-fill.json
// Credentials: same as the analytics sync. Reads BQ_KEY_FILE / BQ_CREDENTIALS_JSON and GA_PROPERTY_ID
// (or BQ_DATASET = analytics_<id>) from .env, or GOOGLE_APPLICATION_CREDENTIALS. Use ENV_FILE=.env.prod to pick a file.
import dotenv from 'dotenv'
import fs from 'fs'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

dotenv.config({ path: process.env.ENV_FILE ?? '.env' })

const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

const months = arg('months', '2026-08,2026-09').split(',')
const outFile = arg('out', 'ga4-fill.json')
const property =
  process.env.GA_PROPERTY_ID ?? process.env.BQ_DATASET?.replace(/^analytics_/, '') ?? ''
if (!property) throw new Error('Set GA_PROPERTY_ID (or BQ_DATASET=analytics_<id>) in the env file')

const client = process.env.BQ_CREDENTIALS_JSON
  ? new BetaAnalyticsDataClient({ credentials: JSON.parse(process.env.BQ_CREDENTIALS_JSON) })
  : process.env.BQ_KEY_FILE
    ? new BetaAnalyticsDataClient({ keyFilename: process.env.BQ_KEY_FILE })
    : new BetaAnalyticsDataClient()

const lastDay = (m: string) => {
  const [y, mo] = m.split('-').map(Number)
  return `${m}-${String(new Date(y, mo, 0).getDate()).padStart(2, '0')}`
}

type Platform = 'Android' | 'iOS' | 'Combined'
const PLATFORMS: Platform[] = ['Android', 'iOS', 'Combined']
const platformFilter = (p: Platform) => ({
  filter: {
    fieldName: 'platform',
    inListFilter: { values: p === 'Combined' ? ['Android', 'iOS'] : [p] },
  },
})

const num = (v?: string | null) => Number(v ?? 0)

async function run(month: string, p: Platform) {
  const property_ = `properties/${property}`
  const dateRanges = [{ startDate: `${month}-01`, endDate: lastDay(month) }]
  const dimensionFilter = platformFilter(p)

  // Whole-month query with no date dimension, so totalUsers is a true unique count for the month.
  const [events] = await client.runReport({
    property: property_,
    dateRanges,
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    dimensionFilter,
    limit: 10000,
  })
  const eventMap: Record<string, { eventCount: number; totalUsers: number }> = {}
  for (const r of events.rows ?? []) {
    eventMap[r.dimensionValues?.[0]?.value ?? ''] = {
      eventCount: num(r.metricValues?.[0]?.value),
      totalUsers: num(r.metricValues?.[1]?.value),
    }
  }

  const [totals] = await client.runReport({
    property: property_,
    dateRanges,
    metrics: [
      { name: 'activeUsers' },
      { name: 'newUsers' },
      { name: 'sessions' },
      { name: 'userEngagementDuration' },
    ],
    dimensionFilter,
  })
  const t = totals.rows?.[0]?.metricValues ?? []
  const totalsOut = {
    activeUsers: num(t[0]?.value),
    newUsers: num(t[1]?.value),
    sessions: num(t[2]?.value),
    userEngagementDurationSec: num(t[3]?.value),
  }

  const [returning] = await client.runReport({
    property: property_,
    dateRanges,
    dimensions: [{ name: 'newVsReturning' }],
    metrics: [{ name: 'activeUsers' }],
    dimensionFilter,
  })
  const returningUsers = num(
    returning.rows?.find((r) => r.dimensionValues?.[0]?.value === 'returning')?.metricValues?.[0]?.value
  )

  // Top services by views. Needs the event parameter `service_name` registered as an event-scoped
  // custom dimension in GA4; if it is not, this is reported as unavailable instead of failing the run.
  let topServices: { service: string; eventCount: number; totalUsers: number }[] | { unavailable: string } = []
  try {
    const [top] = await client.runReport({
      property: property_,
      dateRanges,
      dimensions: [{ name: 'customEvent:service_name' }],
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            dimensionFilter,
            { filter: { fieldName: 'eventName', stringFilter: { value: 'view_content' } } },
          ],
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 10,
    })
    topServices = (top.rows ?? []).map((r) => ({
      service: r.dimensionValues?.[0]?.value ?? '',
      eventCount: num(r.metricValues?.[0]?.value),
      totalUsers: num(r.metricValues?.[1]?.value),
    }))
  } catch (e) {
    topServices = { unavailable: e instanceof Error ? e.message.slice(0, 200) : String(e) }
  }

  return { events: eventMap, totals: totalsOut, returningUsers, topServices }
}

async function main() {
  const out: Record<string, unknown> = {
    property,
    generatedAt: new Date().toISOString(),
    note: 'GA4 Data API, platform in (Android, iOS) for Combined. Unique users are for the whole month.',
    months: {} as Record<string, Record<string, unknown>>,
  }
  for (const m of months) {
    const perPlatform: Record<string, unknown> = {}
    for (const p of PLATFORMS) {
      perPlatform[p] = await run(m, p)
      console.log(`fetched ${m} ${p}`)
    }
    ;(out.months as Record<string, unknown>)[m] = perPlatform
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2))
  console.log(`wrote ${outFile}`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
