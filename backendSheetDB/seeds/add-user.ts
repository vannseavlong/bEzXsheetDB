// Add or edit entries below, then run: pnpm seed:add-user
// Roles: super_admin | admin | operation | finance | marketing
// actor_sheet_id: leave '' for super_admin/admin; use DEV_*_SHEET_ID for others

export default async function (env: Record<string, string | undefined>) {
  return {
    users: [
      {
        user_id: `user_${Date.now()}`,
        role: 'operation',
        email: 'rsblongseav55@gmail.com',
        actor_sheet_id: env.DEV_OPERATION_SHEET_ID ?? '',
        status: 'active',
      },
      // {
      //   user_id: `user_${Date.now() + 1}`,
      //   role: 'finance',
      //   email: 'finance@example.com',
      //   actor_sheet_id: env.DEV_FINANCE_SHEET_ID ?? '',
      //   status: 'active',
      // },
    ],
  }
}
