import { defineTable, string } from 'longcelot-sheet-db';

// One row per role↔module↔action grant — stores module+action directly to avoid join lookups.
export default defineTable({
  name: 'role_permissions',
  actor: 'admin',
  timestamps: true,
  columns: {
    role_id: string().required(),
    module: string().required(),
    action: string().required(),
  },
});
