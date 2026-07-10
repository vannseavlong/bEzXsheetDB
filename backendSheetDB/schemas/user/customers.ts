import { defineTable, string, date } from 'longcelot-sheet-db'

export default defineTable({
  name: 'customers',
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
    // String enum (not boolean) to match what routes/user/auth.ts actually writes/reads
    // ('active' on register/Google sign-up, `!== 'active'` on login/me).
    status: string().enum(['active', 'inactive']).default('active'),
    language: string().default('en'),
    gender: string().enum(['MALE', 'FEMALE', 'OTHER']),
    dob: date(),
  },
})
