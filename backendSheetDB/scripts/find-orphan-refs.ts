// Read-only: lists rows in the admin Sheet whose `ref` columns point at a missing parent row.
// Run: DB_DRIVER=sheets npx tsx scripts/find-orphan-refs.ts
import fs from 'fs'
import path from 'path'
import { createAdapter } from '../config/adapter'

async function main() {
  const { adapter } = createAdapter()
  const ctx = adapter.withContext({ userId: 'orphan-scan', actor: 'admin', actorSheetId: '' })
  const dir = path.join(__dirname, '../schemas/admin')
  const schemas = await Promise.all(
    fs.readdirSync(dir).filter((f) => f.endsWith('.ts')).map(async (f) => (await import(path.join(dir, f))).default),
  )
  const ids = new Map<string, Set<string>>()
  const rows = new Map<string, Record<string, unknown>[]>()
  for (const s of schemas) {
    try {
      const r = await ctx.table(s.name).findMany({})
      rows.set(s.name, r)
      ids.set(s.name, new Set(r.map((x) => String(x._id))))
    } catch (e) {
      console.log(`skip ${s.name}: ${(e as Error).message}`)
    }
  }
  let total = 0
  for (const s of schemas) {
    for (const [col, def] of Object.entries(s.columns as Record<string, { ref?: string }>)) {
      if (!def.ref) continue
      const [parent] = def.ref.split('.')
      const parentIds = ids.get(parent)
      if (!parentIds) continue
      for (const r of rows.get(s.name) ?? []) {
        const v = r[col]
        if (v !== null && v !== undefined && v !== '' && !parentIds.has(String(v))) {
          total++
          console.log(`${s.name}._id=${r._id}  ${col}=${v}  -> missing in ${parent}`)
        }
      }
    }
  }
  console.log(`\n${total} orphaned reference(s)`)
}
main().catch((e) => { console.error(e); process.exit(1) })
