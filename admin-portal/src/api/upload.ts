const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

function getToken(): string | null {
  try { return localStorage.getItem('beasy_admin_token') } catch { return null }
}

export async function uploadImage(file: File): Promise<string> {
  const token = getToken()
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE}/admin/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Upload failed')
  return json.url as string
}
