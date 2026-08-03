import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createSheetAdapter } from 'longcelot-sheet-db';

// Lightweight, read-only sanity check: what tabs currently exist in DEV_USER_SHEET_ID,
// and how many rows does benchmark_records have right now. Useful to confirm a seed
// step actually landed without waiting for a full bench:query run.
async function main() {
  const tokens = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.lsdb-tokens.json'), 'utf-8'));
  const adapter = createSheetAdapter({
    adminSheetId: process.env.ADMIN_SHEET_ID!,
    credentials: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
    },
    tokens,
  });

  const sheetNames = await adapter.getClient().getSheetNames(process.env.DEV_USER_SHEET_ID!);
  console.log('Tabs in DEV_USER_SHEET_ID:', sheetNames);

  for (const table of ['benchmark_records', 'benchmark_scratch']) {
    if (sheetNames.includes(table)) {
      const rows = await adapter.getClient().getAllRows(process.env.DEV_USER_SHEET_ID!, table);
      console.log(`${table}: ${Math.max(0, rows.length - 1)} data rows`);
    } else {
      console.log(`${table}: tab does NOT exist yet`);
    }
  }
}

main().catch((err) => {
  console.error('ERROR:', err instanceof Error ? err.message : err);
  process.exit(1);
});
