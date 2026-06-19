# longcelot-sheet-db — Improvement Tracking

Discovered while building the bEasy admin portal.

---

## ✅ Fixed in v0.1.16

| # | Item |
|---|---|
| 1 | OAuth scopes — shipped `createLoginOAuthManager` with `openid email profile` |
| 2 | Built-in auth routes — shipped `createAuthRouter` with `registrationPolicy` |
| 3 | Seed duplicates — shipped `--skip-existing` and `--upsert` flags |
| 4 | No `upsert()` in CRUD — shipped `ctx.table().upsert()` |
| 5 | CLI sync blocks CI — shipped `sync --token-file <path>` |
| 6 | No `createMany()` — shipped `ctx.table().createMany([...])` |
| 7 | Seed file not dynamic-friendly — seed files now accept `async function(env)` |
| 8 | No `count()` aggregate — shipped `ctx.table().count({ where })` |

---

## ✅ Fixed in v0.1.17

| # | Item |
|---|---|
| 1 | `sync` now appends missing column headers to existing tabs — reads row-1 headers, diffs against schema, appends any missing (purely additive, existing data untouched) |

---

## ✅ Fixed in v0.1.20

| # | Item |
|---|---|
| 1 | Actor-owned sheets — `createUserSheet` accepts `{ actorTokens }` to create the sheet in the actor's own Drive, then shares with admin |
| 2 | Drive folder organisation — `driveFolder: { root, subfolders }` in `SheetAdapterConfig`; folder created on first use per role, cached |
| 3 | Pluggable file upload — `StorageAdapter` interface + built-in `DriveStorageAdapter`; `adapter.upload(buffer, options)` and `adapter.deleteFile(url)` |
| 4 | Per-actor `TokenStore` — `tokenStore` option on `createSheetAdapter`; adapter calls `tokenStore.get(userId)` in `createUserSheet` when `actorTokens` not passed directly |
| 5 | Shared Drive support — `sharedDriveId` option passes `supportsAllDrives: true` to all Drive calls |

**Breaking change:** `createUserSheet` 4th positional param changed from `extraFields` to `options?: CreateUserSheetOptions`. Migrate: `createUserSheet(id, role, email, { full_name })` → `createUserSheet(id, role, email, { extraFields: { full_name } })`

---

## 🗺️ Owner Roadmap (not yet shipped)

| Item | Priority |
|---|---|
| NestJS guard / middleware variant of `createAuthRouter` | Medium |
| Service account alternative for CI (no tokens file needed) | Medium |
| `invite-only` registration policy (user must exist with `status: 'invited'`) | Future |
| CLI `--env` flag to pass individual env vars to dynamic seed files | Future |
| `adapter.join()` — query across multiple actor sheets in memory | Medium |

---

## 🐛 Open Bugs (discovered during testing)

---

## 📬 Feature Request — Drive Architecture & File Upload (submitted 2026-06-19)

Discovered while building bEasy (admin portal + mini-app). These are architectural gaps that affect every project using the package, not just ours.

---

### 1. Actor-owned sheets — sheets should live in the actor's Drive, not the admin's

**Current behaviour:**
`createUserSheet()` calls `spreadsheets.create` using the admin's OAuth tokens (loaded from `.sheet-db-tokens.json`). This means every user sheet is physically created inside the **admin's Google Drive**, then shared with the user via `shareWithUser`. The admin account owns and stores all sheets.

**Problem:**
- Admin's 15 GB Drive quota is consumed by every user's sheet, not the user's own quota.
- One admin account becomes a single point of failure for all user data.
- Unmanageable at scale — 500 registered users = 500 spreadsheets in one Drive root.

**Requested behaviour:**
When a new actor registers via Google OAuth, use **their OAuth tokens** (returned from the login flow) to create the spreadsheet in **their own Drive**, then call `shareWithUser` to grant the admin account editor access. The user bears their own storage cost; admin only holds a reference (`actor_sheet_id`).

**Technical requirement for the package owner:**
This requires per-actor token storage. The suggested API change:

```ts
// Current
await adapter.createUserSheet(userId, role, email)

// Proposed — pass the actor's own tokens obtained during their Google login
await adapter.createUserSheet(userId, role, email, {
  actorTokens: { access_token, refresh_token, expiry_date },
  extraFields: { ... },
})
```

The package would use `actorTokens` to create the sheet via the actor's auth client, then use the admin tokens to share it back. Callers are responsible for persisting and passing the actor's refresh token — the package should not store tokens internally.

---

### 2. Folder and subfolder organisation for Drive

**Current behaviour:**
`createSpreadsheet` calls `sheets.spreadsheets.create` with no `parents` field. Every sheet created by the package lands at the **root of the owning Drive** with no grouping.

**Problem:**
With even 20 users across multiple roles (admin, seller, cleaner), the Drive root becomes an unorganised dump. No way to distinguish actor sheets from other Drive files visually.

**Requested behaviour:**
Allow an optional `folderConfig` in `SheetAdapterConfig` (or `sheet-db.config.ts`) that specifies a named folder structure. The package creates the folder if it doesn't exist, then passes its ID as `parents` when creating sheets.

**Suggested API:**

```ts
// sheet-db.config.ts
export default {
  actors: [...],
  driveFolder: {
    root: 'bEasy Staging',        // created at Drive root if missing
    subfolders: {
      admin:     'Admin Data',
      seller:    'Sellers',
      cleaner:   'Cleaners',
    },
  },
}
```

Result in Drive:
```
My Drive/
└── bEasy Staging/
    ├── Admin Data/
    │   └── admin-sheet (central)
    ├── Sellers/
    │   ├── seller-user123
    │   └── seller-user456
    └── Cleaners/
        └── cleaner-user789
```

`sheet-db sync` and `sheet-db mock-users` should respect `driveFolder` so dev sheets are also organised.

---

### 3. File upload support — pluggable storage adapter

**Current behaviour:**
The package has no file upload concept. There is no way to store binary files (images, documents, PDFs) through the SDK.

**Problem:**
Real apps need to store images (product photos, avatars, banners). Without a built-in pattern, every project invents its own upload layer independently and stores raw URLs in `string()` columns with no consistency.

**Requested behaviour — Option A (Drive upload, simplest):**
Add a `adapter.upload(file, options)` method that uploads to Google Drive using the admin's (or actor's) tokens and returns a publicly accessible URL. Files should be placed in the `driveFolder.root` configured above, inside an `uploads/` subfolder, optionally partitioned by actor role or table name.

```ts
const url = await adapter.upload(buffer, {
  filename: 'product-image.jpg',
  mimeType: 'image/jpeg',
  folder: 'uploads/products',   // relative to driveFolder.root
  public: true,                  // sets Drive permission type: 'anyone', role: 'reader'
})
// returns: https://drive.google.com/uc?id=FILE_ID
```

**Requested behaviour — Option B (pluggable storage, recommended for production path):**
Expose a `StorageAdapter` interface so callers can plug in any provider. The package ships a built-in `DriveStorageAdapter`; callers can swap to S3, GCS, or Cloudinary without changing any other code.

```ts
interface StorageAdapter {
  upload(file: Buffer, options: UploadOptions): Promise<string>  // returns public URL
  delete(url: string): Promise<void>
}

// Built-in
import { DriveStorageAdapter } from 'longcelot-sheet-db'
const adapter = createSheetAdapter({
  ...,
  storage: new DriveStorageAdapter({ folder: 'uploads' }),
})

// Or swap to any provider — zero other changes
import { S3StorageAdapter } from 'longcelot-sheet-db/storage/s3'
const adapter = createSheetAdapter({
  ...,
  storage: new S3StorageAdapter({ bucket: 'my-bucket', region: 'ap-southeast-1' }),
})
```

This aligns with the package's own migration philosophy: swap the adapter, keep all other code.

The URL stored in the `string()` column should be **provider-agnostic** (just a URL) so migrating providers requires only re-uploading files and updating URLs in the sheet — the schema never changes.

---

### 4. Per-actor token lifecycle management

**Current behaviour:**
The package reads tokens from a single `.sheet-db-tokens.json` file at startup. There is no per-user token concept — all Drive and Sheets API calls use one shared credential regardless of which actor triggered the request.

**Problem:**
- Tokens expire. If the single token file expires and no refresh happens, **the entire backend goes down**.
- Makes actor-owned sheets (item 1 above) impossible without a per-actor token store.
- No separation between "admin backend token" (for CLI sync, schema ops) and "request-scoped actor token" (for user-initiated data operations).

**Requested behaviour:**
Introduce a `TokenStore` interface that the caller implements, allowing tokens to be loaded/saved per actor:

```ts
interface TokenStore {
  get(actorId: string): Promise<OAuthTokens | null>
  set(actorId: string, tokens: OAuthTokens): Promise<void>
}

const adapter = createSheetAdapter({
  ...,
  tokenStore: myDatabaseTokenStore,  // caller provides — could be Redis, DB, file per actor
})
```

The admin backend token remains the default fallback for CLI operations. Per-actor tokens are passed at `withContext()` time or looked up via `TokenStore` by `userId`.

---

### 5. Shared Drive (Google Workspace) support

**Current behaviour:**
The package only works with personal Google Drive accounts (`My Drive`). `spreadsheets.create` with no `supportsAllDrives` flag fails silently or errors on Shared Drives.

**Requested behaviour:**
Add a `sharedDriveId` option in `SheetAdapterConfig`. When set, all sheet creation and file operations pass `supportsAllDrives: true` and `driveId: sharedDriveId`. This allows teams using Google Workspace to put all staging data in a centrally managed Shared Drive, avoiding the personal-account storage problem entirely.

```ts
const adapter = createSheetAdapter({
  ...,
  sharedDriveId: process.env.SHARED_DRIVE_ID,  // optional; falls back to My Drive
})
```

---

### Summary table

| # | Request | Impact | Complexity |
|---|---------|--------|------------|
| 1 | Actor-owned sheets (actor's Drive, not admin's) | High — fixes storage quota and isolation | High — needs per-actor token flow |
| 2 | Folder/subfolder organisation in Drive | Medium — quality of life, manageability | Low — add `parents` to `spreadsheets.create` |
| 3 | Pluggable file upload (Drive or external provider) | High — enables real app use cases | Medium — new interface + built-in Drive impl |
| 4 | Per-actor token lifecycle / TokenStore interface | High — required for item 1, resilience | Medium — interface + withContext wiring |
| 5 | Shared Drive (Google Workspace) support | Medium — unblocks team/enterprise use | Low — `supportsAllDrives` flag + config |
