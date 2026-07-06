// Add or edit entries below, then run: pnpm seed:add-user
// role_id must be the `_id` of a row in the `roles` sheet (see the Roles &
// Permissions page in the admin portal, or read the roles sheet directly).

export default async function (_env: Record<string, string | undefined>) {
  return {
    users: [
      {
        user_id: `user_${Date.now()}`,
        role_id: 'PASTE_OPERATION_ROLE_ID_HERE',
        email: 'rsblongseav55@gmail.com',
        status: 'active',
      },
      // {
      //   user_id: `user_${Date.now() + 1}`,
      //   role_id: 'PASTE_FINANCE_ROLE_ID_HERE',
      //   email: 'finance@example.com',
      //   status: 'active',
      // },
    ],
  }
}
