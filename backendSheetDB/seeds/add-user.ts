// Add or edit entries below, then run: pnpm seed:add-user
// Roles: super_admin | admin | operation | finance | marketing — all share the single admin sheet

export default async function (_env: Record<string, string | undefined>) {
  return {
    users: [
      {
        user_id: `user_${Date.now()}`,
        role: 'operation',
        email: 'rsblongseav55@gmail.com',
        status: 'active',
      },
      // {
      //   user_id: `user_${Date.now() + 1}`,
      //   role: 'finance',
      //   email: 'finance@example.com',
      //   status: 'active',
      // },
    ],
  }
}
