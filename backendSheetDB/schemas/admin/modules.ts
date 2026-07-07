import { defineTable, string, json } from 'longcelot-sheet-db';

// Module catalog — the permission "buckets" a role can be granted access to.
// action_ids restricts which actions are applicable to this module (drives the
// RBAC matrix's editable vs N/A cells).
export default defineTable({
  name: 'modules',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    key: string().required().unique(),
    label: string().required(),
    section: string().default('Other'),
    action_ids: json().default([]),
  },
});
