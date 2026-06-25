import { defineTable, string, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'blocked_schedules',
  actor: 'admin',
  timestamps: true,
  softDelete: true,
  columns: {
    name: string().required(),
    blocked_date: date().required(),
    start_time: string().required(),
    end_time: string().required(),
    cleaner_ids: string(),    // JSON array of cleaner _ids
    associated_address: string(),
  },
});
