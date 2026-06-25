import { defineTable, string, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'push_notifications',
  actor: 'admin',
  timestamps: true,
  columns: {
    name: string().required(),
    title_en: string().required(),
    body_en: string().required(),
    type: string().required().enum(['GENERAL', 'PACKAGE_DEAL']),
    schedule_type: string().required().enum(['now', 'schedule', 'event']),
    scheduled_at: date(),
    status: string().enum(['DRAFT', 'SCHEDULED', 'SENT', 'FAILED']).default('DRAFT'),
    audience: string().enum(['ALL', 'SELECTED']).default('ALL'),
    target_user_ids: string(),
  },
});
