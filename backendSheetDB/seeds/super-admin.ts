// Seed the `roles` sheet with a super_admin role first (via the RBAC UI or a
// manual row), then copy its `_id` into SUPER_ADMIN_ROLE_ID before running this.
export default async function (env: Record<string, string | undefined>) {
  const email = env.SUPER_ADMIN_EMAIL
  if (!email) throw new Error('SUPER_ADMIN_EMAIL not set in .env')

  const roleId = env.SUPER_ADMIN_ROLE_ID
  if (!roleId) throw new Error('SUPER_ADMIN_ROLE_ID not set in .env (the _id of the super_admin row in the roles sheet)')

  return {
    users: [
      {
        user_id: `user_${Date.now()}`,
        role_id: roleId,
        email,
        actor_sheet_id: '',
        status: 'active',
      },
    ],
  }
}
