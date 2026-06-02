export default async function (env: Record<string, string | undefined>) {
  const email = env.SUPER_ADMIN_EMAIL
  if (!email) throw new Error('SUPER_ADMIN_EMAIL not set in .env')

  return {
    users: [
      {
        user_id: `user_${Date.now()}`,
        role: 'super_admin',
        email,
        actor_sheet_id: '',
        status: 'active',
      },
    ],
  }
}
