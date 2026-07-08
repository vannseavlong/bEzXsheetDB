import crypto from 'crypto'

const HEADER = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')

// Short on purpose: this bounds how stale a role's embedded permissions can get.
// The frontend doesn't poll — it transparently refreshes via /me the moment a
// request 401s on an expired token, so a short window here is cheap, not chatty.
const EXPIRY_SECONDS = 60 * 20

export function signJwt(payload: Record<string, unknown>, secret: string): string {
  const now = Math.floor(Date.now() / 1000)
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: now, exp: now + EXPIRY_SECONDS })
  ).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(`${HEADER}.${body}`).digest('base64url')
  return `${HEADER}.${body}.${sig}`
}

export function verifyJwt(token: string, secret: string): Record<string, unknown> {
  const [header, payload, sig] = token.split('.')
  if (!header || !payload || !sig) throw new Error('Malformed token')
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')
  if (sig !== expected) throw new Error('Invalid token signature')
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
  if (typeof decoded.exp === 'number' && Math.floor(Date.now() / 1000) >= decoded.exp) {
    throw new Error('Token expired')
  }
  return decoded
}
