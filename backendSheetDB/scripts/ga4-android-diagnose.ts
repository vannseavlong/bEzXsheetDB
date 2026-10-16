// Read-only diagnostic: why do Android first_open events (GA4) far exceed Android store installs?
// Pulls from the GA4 Data API (history) and, if configured, BigQuery (only since the export link date).
// Nothing is written to the database, the sheets or the analytics_* tables.
//
// Run (from backendSheetDB):
//   ENV_FILE=.env npx tsx scripts/ga4-android-diagnose.ts --from 2026-08-01 --to 2026-09-30 --out android-diagnose.json
import dotenv from 'dotenv'
import fs from 'fs'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { BigQuery } from '@google-cloud/bigquery'

dotenv.config({ path: process.env.ENV_FILE ?? '.env' })

const arg = (n: string, d: string) => {
  const i = process.argv.indexOf(`--${n}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d
}
const from = arg('from', '2026-08-01')
const to = arg('to', '2026-09-30')
const outFile = arg('out', 'android-diagnose.json')
const property = process.env.GA_PROPERTY_ID ?? process.env.BQ_DATASET?.replace(/^analytics_/, '') ?? ''
if (!property) throw new Error('Set GA_PROPERTY_ID (or BQ_DATASET=analytics_<id>)')

const creds = process.env.BQ_CREDENTIALS_JSON
  ? { credentials: JSON.parse(process.env.BQ_CREDENTIALS_JSON) }
  : process.env.BQ_KEY_FILE
    ? { keyFilename: process.env.BQ_KEY_FILE }
    : {}
const ga = new BetaAnalyticsDataClient(creds)

const firstOpen = {
  filter: { fieldName: 'eventName', stringFilter: { value: 'first_open' } },
}
const platformIs = (p: string) => ({ filter: { fieldName: 'platform', stringFilter: { value: p } } })
const num = (v?: string | null) => Number(v ?? 0)

async function table(dimension: string, platform: string, limit = 20) {
  const [res] = await ga.runReport({
    property: `properties/${property}`,
    dateRanges: [{ startDate: from, endDate: to }],
    dimensions: [{ name: dimension }],
    metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    dimensionFilter: { andGroup: { expressions: [firstOpen, platformIs(platform)] } },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit,
  })
  return (res.rows ?? []).map((r) => ({
    value: r.dimensionValues?.[0]?.value ?? '',
    firstOpens: num(r.metricValues?.[0]?.value),
    users: num(r.metricValues?.[1]?.value),
  }))
}

async function daily() {
  const [res] = await ga.runReport({
    property: `properties/${property}`,
    dateRanges: [{ startDate: from, endDate: to }],
    dimensions: [{ name: 'date' }, { name: 'platform' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: firstOpen,
    orderBys: [{ dimension: { dimensionName: 'date' } }],
    limit: 10000,
  })
  const out: Record<string, Record<string, number>> = {}
  for (const r of res.rows ?? []) {
    const d = r.dimensionValues?.[0]?.value ?? ''
    const date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`
    const p = r.dimensionValues?.[1]?.value ?? ''
    ;(out[date] ??= {})[p] = num(r.metricValues?.[0]?.value)
  }
  return out
}

/** deviceModel x country for Android first opens: shows whether the test-looking models are US / (not set) devices. */
async function modelByCountry() {
  const [res] = await ga.runReport({
    property: `properties/${property}`,
    dateRanges: [{ startDate: from, endDate: to }],
    dimensions: [{ name: 'deviceModel' }, { name: 'country' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: { andGroup: { expressions: [firstOpen, platformIs('Android')] } },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 40,
  })
  return (res.rows ?? []).map((r) => ({
    model: r.dimensionValues?.[0]?.value ?? '',
    country: r.dimensionValues?.[1]?.value ?? '',
    firstOpens: num(r.metricValues?.[0]?.value),
  }))
}

/** Android first opens per month with the suspected test traffic removed (emulators, OnePlus8Pro, Pixel 6 Pro). */
async function adjustedByMonth() {
  const out: Record<string, { all: number; withoutSuspected: number }> = {}
  for (const [start, end, label] of [['2026-08-01', '2026-08-31', '2026-08'], ['2026-09-01', '2026-09-30', '2026-09']]) {
    const run = async (extra: object[]) => {
      const [res] = await ga.runReport({
        property: `properties/${property}`,
        dateRanges: [{ startDate: start, endDate: end }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: { andGroup: { expressions: [firstOpen, platformIs('Android'), ...extra] } },
      })
      return num(res.rows?.[0]?.metricValues?.[0]?.value)
    }
    const notSuspect = [
      { notExpression: { filter: { fieldName: 'deviceModel', stringFilter: { matchType: 'BEGINS_WITH' as const, value: 'sdk_gphone' } } } },
      { notExpression: { filter: { fieldName: 'deviceModel', inListFilter: { values: ['OnePlus8Pro', 'Pixel 6 Pro'] } } } },
    ]
    out[label] = { all: await run([]), withoutSuspected: await run(notSuspect) }
  }
  return out
}

async function bigQuery() {
  const project = process.env.BQ_PROJECT_ID
  const dataset = process.env.BQ_DATASET
  if (!project || !dataset) return { skipped: 'BQ_PROJECT_ID / BQ_DATASET not set' }
  const bq = new BigQuery({ projectId: project, location: process.env.BQ_LOCATION, ...creds })
  const base = `FROM \`${project}.${dataset}.events_*\` WHERE event_name = 'first_open' AND platform = 'ANDROID'`
  const run = async (sql: string) => (await bq.query({ query: sql, location: process.env.BQ_LOCATION }))[0]
  try {
    const [bySource, byModel, byVersion, summary] = await Promise.all([
      run(`SELECT IFNULL(app_info.install_source, '(none)') AS install_source, COUNT(*) AS first_opens ${base} GROUP BY 1 ORDER BY 2 DESC LIMIT 20`),
      run(`SELECT device.mobile_brand_name AS brand, device.mobile_model_name AS model, COUNT(*) AS first_opens ${base} GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 20`),
      run(`SELECT app_info.version AS version, COUNT(*) AS first_opens ${base} GROUP BY 1 ORDER BY 2 DESC LIMIT 15`),
      run(`SELECT COUNT(*) AS first_opens, COUNT(DISTINCT user_pseudo_id) AS instances, MIN(event_date) AS from_date, MAX(event_date) AS to_date ${base}`),
    ])
    return { summary: summary[0], bySource, byModel, byVersion, note: 'BigQuery only holds data since the export link (October 2026).' }
  } catch (e) {
    return { error: e instanceof Error ? e.message.slice(0, 300) : String(e) }
  }
}

async function main() {
  const result = {
    range: { from, to },
    property,
    generatedAt: new Date().toISOString(),
    dailyFirstOpenByPlatform: await daily(),
    androidByDeviceModel: await table('deviceModel', 'Android', 25),
    androidByAppVersion: await table('appVersion', 'Android', 15),
    androidByOsVersion: await table('operatingSystemVersion', 'Android', 15),
    androidByCountry: await table('country', 'Android', 10),
    androidBySource: await table('firstUserSource', 'Android', 10),
    iosByAppVersion: await table('appVersion', 'iOS', 10),
    androidModelByCountry: await modelByCountry(),
    androidAdjustedByMonth: await adjustedByMonth(),
    bigQueryAndroid: await bigQuery(),
  }
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2))
  console.log(`wrote ${outFile}`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
