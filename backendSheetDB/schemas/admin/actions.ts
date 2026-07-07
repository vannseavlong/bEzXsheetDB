import { defineTable, string } from 'longcelot-sheet-db';

// Global action catalog — VIEW, ADD, UPDATE, etc. Reused across modules.
export default defineTable({
  name: 'actions',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    key: string().required().unique(),
    label: string().required(),
  },
});
