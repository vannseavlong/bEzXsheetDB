# Firebase → BigQuery → bEzXsheetDB: Setup Guide

How to link Firebase Analytics to BigQuery, then pull those events into the **bEzXsheetDB** staging clone and read them on its admin portal (**Business Growth → App Analytics**).

```
bEasy-app (Flutter)            Firebase Analytics            BigQuery                      bEzXsheetDB
AnalyticsHelper.track  ──►  GA4 property / project  ──►  analytics_<property_id>  ──►  backendSheetDB  ──►  admin-portal
(event_id, journey_id…)       (auto export)               events_YYYYMMDD                services/bigquery-sync     /analytics
                                                          events_intraday_YYYYMMDD       analytics_events (table)
```

Event names and params follow [bEasy-tracking-architecture-guide.md](bEasy-tracking-architecture-guide.md) §4.

---

## 1. Before you start

| Need | Detail |
|---|---|
| Firebase project | The one your **prod app** reports to (check `google-services.json` / `GoogleService-Info.plist` per flavor). Dev and prod flavors may be different projects. |
| Role | **Owner** on the Firebase/GCP project to create the link. |
| Billing | Daily export works in the free BigQuery sandbox. **Streaming (intraday) export needs billing enabled** (Blaze plan), and sandbox tables expire (60 days by default). For a real data store, enable billing. |
| Region | Chosen **once**, in the wizard's *Select a region* dropdown (default `us`), and cannot be changed afterwards. Use the same value for `BQ_LOCATION`. |

> **Why no data in dev builds?** `AnalyticsHelper` only sends events from **release builds** and **never for staff phone numbers** (`_sendEnabled` in `bEasy-app/lib/analytics/analytics_helper.dart`). Test with a release/TestFlight build and a non-staff account, or you will see an empty dataset.

---

## 2. Link Firebase to BigQuery (Firebase console)

1. Open [Firebase console](https://console.firebase.google.com) → select the project → ⚙️ **Project settings** → **Integrations** tab → **BigQuery** card → **Link**. This opens a multi-step wizard; **step 2 "Configure integration"** is where everything below is set.
2. **Export settings: Integrations → Google Analytics** — toggle **on** ("Export raw event data from Google Analytics for each of your apps"). Then:

   | Field | What to do |
   |---|---|
   | **Apps exporting** | Shows e.g. "2 of 2 apps". Click the ✏️ pencil only if you want to exclude one (keep both Android + iOS). |
   | **Select a region** | Defaults to **`us`** (a multi-region). Change it if you want data nearer to Cambodia (e.g. `asia-southeast1`). **Cannot be changed after linking.** Whatever you pick must be copied to `BQ_LOCATION` (`us` → `BQ_LOCATION=US`). |
   | **Daily** | Tick it. Both boxes are **unchecked by default**, so nothing exports until you choose at least one. Full export once a day → `events_YYYYMMDD`. |
   | **Streaming** | Optional ("within seconds of arrival" → `events_intraday_YYYYMMDD`). Needs billing enabled; if you tick it, keep `BQ_INCLUDE_INTRADAY=true`, otherwise set it to `false`. |
   | **Include advertising identifiers in export** | **Leave unchecked** — the tracking guide says never to store IDFA/ad IDs. |

3. **Export settings: Firebase products** — all three are **off** by default; none are needed for this feature. Each exports into its **own dataset** (not `analytics_*`), so they never affect the sync:
   - **Crashlytics** — crash/ANR data (optional, useful later for stability reports).
   - **Performance Monitoring** — traces and network requests (skip; can be large).
   - **Cloud Messaging** — detailed FCM delivery data (optional; relevant later for push results in the automation guide).
4. **Import from BigQuery → Imported segments (Beta)** — leave **off**; that is for pushing your own segments into Firebase, the opposite direction.
5. Click **Link to BigQuery** (bottom right). The link is created immediately, but Firebase shows **"Dataset not created"** until the first export arrives. The dataset is created then (usually within a few hours, up to ~24 h), and the first daily table follows.

### What you should see after linking

Firebase creates a **dataset** (a folder of tables) in your Google Cloud project. Its name is `analytics_` + your GA4 **Property ID**. For this project the Property ID is `506666727` (GA → Admin → Property settings → Property details, top right), so:

```
BQ_DATASET=analytics_506666727
```

Open [BigQuery console](https://console.cloud.google.com/bigquery) → pick the project → expand it. Inside the dataset you will see one table per day:

| Table | Meaning |
|---|---|
| `events_20261006`, `events_20261007`, … | Daily export, one table per finished day. **First one can take up to ~24 h** after linking. |
| `events_intraday_20261007` | Streaming export, today only. Only exists if you ticked *Streaming*. |

If the dataset is not there yet, wait: Firebase → Integrations → BigQuery shows *Dataset not created* until the first export lands. Also check that real events are being sent (release build, non-staff account).

> `BQ_PROJECT_ID` is the Google Cloud **project ID** (shown at the top of the BigQuery console), which is not necessarily the GA property name `suntel-beasy-pro`.
> Daily tables are named by the property's reporting time zone (here GMT+07:00); the sync already allows for that.

### Optional: check that events arrived

In the BigQuery console click **Compose new query**, paste this, replace `<project>` with your project ID, and **Run**. It counts events per name over the last 3 days:

```sql
SELECT event_name, COUNT(*) AS n
FROM `<project>.analytics_506666727.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY))
GROUP BY 1 ORDER BY n DESC;
```

You should see the contract events (`service_viewed`, `booking_started`, …) next to Firebase auto events (`screen_view`, `session_start`, …).

---

## 3. Create a read-only service account for the backend

The backend must not use your personal login. Create a dedicated reader.

**A. Create it** — Google Cloud console → **IAM & Admin → Service accounts → Create service account**. Name `beasy-bq-reader`, click **Create and continue**, skip the optional steps, **Done**. Its email is `beasy-bq-reader@<project-id>.iam.gserviceaccount.com`.

> Do **not** use the account's own *Principals with access* tab for permissions — that tab only controls who may manage the account.

**B. Let it run queries (project level)** — left menu **IAM → Grant access** → *New principals*: the email above → role **BigQuery Job User** → **Save**.

**C. Let it read the analytics data (dataset level)** — available once `analytics_<id>` exists. BigQuery → dataset **⋮ → Share → Manage permissions → Add principal** → the email → role **BigQuery Data Viewer** → **Save**.
*(Shortcut while the dataset doesn't exist yet: grant **BigQuery Data Viewer** on the project in step B; tighten later.)*

**D. Create a key** — **Service accounts →** `beasy-bq-reader` **→ Keys → Add key → Create new key → JSON → Create**. A `.json` file downloads. Move it **outside any git repo** (e.g. `~/secrets/bq-reader.json`), never commit it, and point `BQ_KEY_FILE` at it.

---

## 4. Configure bEzXsheetDB backend

Add to `bEzXsheetDB/backendSheetDB/.env` (all are **optional**; the feature stays off until `BQ_PROJECT_ID` and `BQ_DATASET` are set):

```bash
# ─── Firebase → BigQuery analytics ────────────────────────────────────────
BQ_PROJECT_ID=suntel-beasy-pro
BQ_DATASET=analytics_506666727
BQ_LOCATION=asia-southeast1                         # exactly the region picked in the wizard (default: us)

# Pick ONE credential method:
BQ_KEY_FILE=/absolute/path/to/bq-reader.json     # local dev
# BQ_CREDENTIALS_JSON={"type":"service_account",...}   # hosted (Render): paste the whole JSON on one line
# (neither set → Application Default Credentials: `gcloud auth application-default login`)

BQ_LOOKBACK_DAYS=3            # first sync goes this far back
BQ_MAX_ROWS_PER_SYNC=5000     # per run, oldest first; backlog is drained over several runs
BQ_INCLUDE_INTRADAY=true      # set false if streaming export is off
ANALYTICS_SYNC_INTERVAL_MIN=0 # 0 = manual button only; e.g. 30 = auto sync every 30 min
```

Then:

```bash
cd bEzXsheetDB/backendSheetDB
pnpm install                  # adds @google-cloud/bigquery
npx lsdb sync --table analytics_events,analytics_sync_runs   # creates the 2 new tabs (additive, other tables untouched)
pnpm dev
```

`ON_SCHEMA_MISMATCH` defaults to `warn`, so starting the server does **not** create tables — run the `lsdb sync` above once. It adds two tabs to the admin Google Sheet: `analytics_events` and `analytics_sync_runs`. (For Postgres in production, export the schema with `lsdb migrate` and apply it.)

### Grant portal access

New module **`ANALYTICS`** (actions `VIEW`, `UPDATE`):

- `super_admin` sees it automatically.
- Other roles: portal → **Roles & Permissions** → sync the module catalog, then tick **App Analytics (BigQuery)** → *View* (read data) and *Update* (allow **Sync now**).

---

## 5. Pull and view the data

1. Run the portal (`cd admin-portal && pnpm dev`) → sign in → **Business Growth → App Analytics**.
2. The top bar shows `project.dataset`, stored event count and last sync. Click **Sync now**.
3. Check **Sync history** tab: *Fetched / Inserted / Skipped / Scanned MB*. A re-run should insert ~0 (everything dupes → *Skipped*).
4. Read the page:
   - **KPIs** — events, users (registered + guest devices), journeys, checkout value.
   - **Daily events & users** trend.
   - **Booking funnel** and **Registration funnel** — unique users per step.
   - **Top events / platforms / most viewed services / campaigns.**
   - **Event stream** — raw rows with every param (`params_json`) for debugging the contract.

API (all under `/api/admin/analytics`, JWT + `ANALYTICS:VIEW`): `GET /status`, `GET /summary?from=&to=`, `GET /events?event=&search=&page=`, `GET /sync-runs`, `POST /sync` (`ANALYTICS:UPDATE`, optional `{ "days": 7 }` to force a re-pull of the last N days).

---

## 5b. Old data (before the link): GA4 history backfill

**BigQuery export is not retroactive.** It only contains events from the day you linked (7 Oct 2026). Everything earlier stays inside Google Analytics, and Google offers no way to backfill raw events.

bEzXsheetDB therefore also pulls **aggregated history** from the **GA4 Data API** into the `analytics_daily_events` table: one row per **day × event × platform × country** with `event_count` and `total_users`. It goes back as far as the property has data. It is counts only: no per-user rows, `journey_id` or params, so funnels by journey exist only from the link date onward. GA4 report numbers can differ slightly from BigQuery (thresholding/modelling).

**One-time setup**
1. **Enable the API** — Google Cloud console (project `suntel-beasy-pro`) → *APIs & Services → Library* → **Google Analytics Data API** → **Enable**.
2. **Give the service account access to the GA4 property** — analytics.google.com → *Admin → Property access management → +* → add `beasy-bq-reader@suntel-beasy-pro.iam.gserviceaccount.com` with role **Viewer**.
   (Granting it on the property is separate from Google Cloud IAM; the Job User / Data Viewer roles do not cover this.)
3. `GA_PROPERTY_ID` is optional: it defaults to the number inside `BQ_DATASET` (`506666727`).
4. Create the tables once: `npx lsdb sync --table analytics_daily_events,analytics_sync_runs`.

**Run it** — portal → App Analytics → **History (GA4)** tab → **Backfill all history** (or pick a start date). It runs in the background in month-sized chunks; the chart fills in as it goes, and progress shows in *Sync history* (source *GA4 history*). Re-running is safe: new rows are inserted, changed counts are updated, nothing is duplicated. API: `POST /api/admin/analytics/backfill { "from"?: "YYYY-MM-DD", "to"?: "YYYY-MM-DD" }`, `GET /api/admin/analytics/history`.

> Sheets size: ~tens to a few hundred rows per day. A year of history is tens of thousands of rows, which fits staging, but prefer a start date over "all" if the property is old.

---

## 6. How the sync works (so you can trust it)

- **Incremental.** Starts at the last successful run's `watermark_micros` minus a 1 h overlap (catches offline devices); first run uses `BQ_LOOKBACK_DAYS`.
- **Idempotent.** Dedupe key `event_id`: the app's own UUID for contract events; for Firebase auto/legacy events a hash of `user_pseudo_id | event_timestamp | event_name | bundle_sequence | ga_session_id`. The same event from `events_intraday_*` and later `events_*` collapses to one row.
- **Bounded cost.** Queries filter `_TABLE_SUFFIX` + `event_timestamp > watermark`, so only recent partitions are scanned. Scanned MB per run is recorded.
- **Never skips rows.** Max `BQ_MAX_ROWS_PER_SYNC` per run, oldest first; the watermark only advances past stored rows.
- **Failure-safe.** A failed run is logged (`status=FAILED`, `error`) and does not move the watermark.
- **Raw is immutable.** `analytics_events` is append-only; fix mapping problems by re-syncing (`days`) into a clean table, not by editing rows.

### What lands in `analytics_events`

| Column | From |
|---|---|
| `event_id`, `event_name`, `occurred_micros`, `occurred_at`, `event_date` | `event_params.event_id` / BQ row, `event_timestamp` (UTC) |
| `user_pseudo_id`, `user_id`, `ga_session_id`, `platform`, `app_version`, `country` | BQ fields |
| `journey_id`, `reg_flow_id`, `service_id`, `entry_point`, `value`, `currency` | contract params |
| `campaign`, `source`, `medium` | `campaign_code` / `utm_*` params, else BQ `traffic_source` |
| `params_json` | every event param, JSON |

Edit the mapping in `backendSheetDB/services/bigquery-mapper.ts` if the app adds params you want as columns.

---

## 7. Limits of this staging setup & moving to production

| Topic | Staging (Sheets) | Production |
|---|---|---|
| Storage | Google Sheets caps at ~10M cells per spreadsheet; this table has ~24 columns ⇒ keep to a few hundred thousand events. Reads load the whole tab. | Postgres (`DB_DRIVER=postgres`) — same schema, no cell limit. |
| Aggregation | `/summary` aggregates in memory | Move to SQL, or query BigQuery directly / materialize a daily table |
| Retention | Prune old rows manually | Partition/prune by `event_date` |
| Ingestion | Pull by button or `ANALYTICS_SYNC_INTERVAL_MIN` | Scheduled job (Cloud Scheduler → `POST /sync`, or the interval) |

If the staging volume grows, lower the cost first: set `BQ_MAX_ROWS_PER_SYNC`, drop noisy events by adding a `AND event_name NOT IN ('screen_view','user_engagement')` filter in `buildQuery()` of `services/bigquery-sync.ts`.

---

## 8. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Portal says **BigQuery not connected** | `BQ_PROJECT_ID` / `BQ_DATASET` missing; restart the backend after editing `.env`. |
| `Not found: Dataset … analytics_…` | Wrong dataset id, wrong project, or wrong `BQ_LOCATION` (must match the dataset region). |
| `Access Denied: … bigquery.jobs.create` | Service account lacks **BigQuery Job User** on the *project*. |
| `Access Denied: … bigquery.tables.getData` | Lacks **Data Viewer** on the *dataset*. |
| `Invalid JSON` / `BQ_KEY_FILE not found` | Pasted JSON broken by newlines (keep one line, `\n` inside `private_key` stay escaped) or bad file path. |
| Sync succeeds, 0 rows | Dataset exists but no daily table yet (first export takes up to ~24 h) and streaming is off — or the app has only sent debug/staff events (see §1 note). |
| Intraday skipped silently | Streaming export not enabled (or sandbox); expected, daily tables still sync. Set `BQ_INCLUDE_INTRADAY=false` to stop trying. |
| Users look double | One person = `user_pseudo_id` before login and `user_id` after; the portal counts `user_id` when present, else the device. Full identity stitching needs the backend `identity_link` from the architecture guide. |
| Funnel steps all zero except `app_opened` | App version predating the contract events; check `app_version` in the event stream. |
| Backfill: `PERMISSION_DENIED` / `User does not have sufficient permissions for this property` | The service account is not a **Viewer on the GA4 property** (step 2 of §5b). |
| Backfill: `Google Analytics Data API has not been used in project … or it is disabled` | Enable the API (step 1 of §5b), wait a minute, retry. |
| `A sync is already running` (409) | One sync at a time; wait for the status bar to finish. |

---

## 9. Checklist

- [ ] Firebase → Integrations → BigQuery linked (Daily on, Streaming optional), region noted
- [ ] `analytics_<id>` dataset visible; sanity query returns contract events
- [ ] Service account with *Job User* (project) + *Data Viewer* (dataset); key stored outside git
- [ ] `.env` filled, `lsdb sync --table analytics_events,analytics_sync_runs` run, tabs exist
- [ ] Role granted `ANALYTICS` (View / Update)
- [ ] **Sync now** succeeds; second run shows ~0 inserted
- [ ] Funnel numbers spot-checked against the BigQuery console
