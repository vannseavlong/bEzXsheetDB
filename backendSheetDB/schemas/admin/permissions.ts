import { defineTable, string } from 'longcelot-sheet-db';

// Each row represents one module+action pair (e.g. CLEANER:VIEW, ORDER:DELETE).
export default defineTable({
  name: 'permissions',
  actor: 'admin',
  timestamps: true,
  columns: {
    module: string().required(),
    action: string().required().enum(['VIEW', 'ADD', 'UPDATE', 'DELETE', 'EXPORT', 'ASSIGN', 'MARK_AS_PAID']),
    description: string(),
  },
});
