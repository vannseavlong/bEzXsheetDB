import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createSheetAdapter, SheetAdapter } from 'longcelot-sheet-db';
import benchmarkRecords from '../../schemas/user/benchmark_records';
import benchmarkScratch from '../../schemas/user/benchmark_scratch';

const REQUIRED_ENV = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'ADMIN_SHEET_ID',
  'DEV_USER_SHEET_ID',
];

/**
 * Builds a `user`-actor-scoped adapter context pointed at DEV_USER_SHEET_ID, with
 * both benchmark schemas registered. Every benchmark script shares this so results
 * are comparable (same auth, same cache config, same schemas).
 */
export function buildBenchContext(): ReturnType<SheetAdapter['withContext']> {
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key} (run from backendSheetDB/ with .env loaded)`);
    }
  }

  const tokensPath = path.resolve(process.cwd(), '.lsdb-tokens.json');
  if (!fs.existsSync(tokensPath)) {
    throw new Error(`No OAuth tokens found at ${tokensPath}. Run: npx lsdb sync`);
  }
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  const adapter = createSheetAdapter({
    adminSheetId: process.env.ADMIN_SHEET_ID!,
    credentials: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
    },
    tokens,
  });

  adapter.registerSchema(benchmarkRecords);
  adapter.registerSchema(benchmarkScratch);

  return adapter.withContext({
    userId: 'bench-cli',
    actor: 'user',
    actorSheetId: process.env.DEV_USER_SHEET_ID!,
  });
}
