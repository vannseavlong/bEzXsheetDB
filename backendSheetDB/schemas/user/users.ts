import { defineTable, string, date, boolean } from 'longcelot-sheet-db'

export default defineTable({
  name: 'users',
  actor: 'user',
  timestamps: true,
  columns: {
    email: string().required().unique(),
    // Not required: Google sign-up accounts have neither a password nor (necessarily) a
    // phone number on file. Manual /register still enforces both at the route level.
    password_hash: string(),
    first_name: string().required(),
    last_name: string().required(),
    phone: string().unique(),
    profile_url: string(),
    status: boolean().default(true),
    language: string().default('en'),
    gender: string().enum(['MALE', 'FEMALE', 'OTHER']),
    dob: date(),
  },
})
