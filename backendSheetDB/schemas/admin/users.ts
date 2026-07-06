import { defineTable, string } from 'longcelot-sheet-db';

export default defineTable({
  name: 'users',
  actor: 'admin',
  timestamps: true,
  columns: {
    user_id: string().required().unique(),
    name: string().required(),
    role_id: string().required().ref('roles._id'),
    email: string().required().unique(),
    actor_sheet_id: string(),
    status: string().enum(['active', 'inactive']).default('active'),
    password_hash: string(),
    profile_url: string(),
  },
});
