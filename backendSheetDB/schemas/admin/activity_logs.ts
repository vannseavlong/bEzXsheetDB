import { defineTable, string } from 'longcelot-sheet-db';

export default defineTable({
  name: 'activity_logs',
  actor: 'admin',
  timestamps: true,
  columns: {
    username: string(),
    method: string(),
    url: string(),
    module: string(),
    detail: string(),
  },
});
