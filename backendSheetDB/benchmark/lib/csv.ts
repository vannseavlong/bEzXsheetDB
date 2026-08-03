import fs from 'fs';
import path from 'path';

/** Appends one row to a CSV file, writing the header first if the file doesn't exist yet. */
export function appendCsvRow(filePath: string, row: Record<string, string | number>): void {
  const absolute = path.resolve(filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });

  const columns = Object.keys(row);
  const line = columns.map((c) => String(row[c])).join(',') + '\n';

  if (!fs.existsSync(absolute)) {
    fs.writeFileSync(absolute, columns.join(',') + '\n');
  }
  fs.appendFileSync(absolute, line);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function percentile(sortedMs: number[], p: number): number {
  if (sortedMs.length === 0) return 0;
  const idx = Math.min(sortedMs.length - 1, Math.floor((p / 100) * sortedMs.length));
  return sortedMs[idx];
}
