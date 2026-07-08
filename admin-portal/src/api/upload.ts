import { refreshToken, forceReauth } from './client'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

function getToken(): string | null {
  try { return localStorage.getItem('beasy_admin_token') } catch { return null }
}

async function postUpload(form: FormData): Promise<Response> {
  const token = getToken()
  return fetch(`${BASE}/admin/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
}

export async function uploadImage(file: File, isRetry = false): Promise<string> {
  const form = new FormData()
  form.append('file', file)

  const res = await postUpload(form)
  const json = await res.json()
  if (!res.ok) {
    if (res.status === 401 && !isRetry) {
      const newToken = await refreshToken()
      if (newToken) return uploadImage(file, true)
      forceReauth()
    }
    throw new Error(json.message ?? 'Upload failed')
  }
  return json.url as string
}
