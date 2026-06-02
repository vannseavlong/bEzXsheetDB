import { defineTable, string } from 'longcelot-sheet-db';

// Join table: one row per role↔permission grant.
export default defineTable({
  name: 'role_permissions',
  actor: 'admin',
  timestamps: true,
  columns: {
    role_id: string().required().ref('roles._id'),
    permission_id: string().required().ref('permissions._id'),
  },
});
