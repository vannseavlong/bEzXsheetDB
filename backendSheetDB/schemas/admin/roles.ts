import { defineTable, string } from 'longcelot-sheet-db';

export default defineTable({
  name: 'roles',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name: string().required().unique(),
    description: string(),
    status: string().enum(['active', 'inactive']).default('active'),
    created_by: string().required(),
  },
});
