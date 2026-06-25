import { defineTable, string, boolean, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'cleaners',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name: string().required(),
    gender: string().required().enum(['Male', 'Female']),
    role: string().required().enum(['LEADER', 'MEMBER']),
    status: boolean().default(true),
    image_url: string(),
    phone: string(),
    joined_date: date().required(),
    auto_assign: boolean().default(false),
    expertises: string(),     // JSON array of expertise strings
    weekly_offs: string(),    // JSON array of weekday strings
  },
});
