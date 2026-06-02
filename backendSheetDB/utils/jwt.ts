import crypto from 'crypto'

const HEADER = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')

export function signJwt(payload: Record<string, unknown>, secret: string): string {
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) })
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
  return JSON.parse(Buffer.from(payload, 'base64url').toString())
}
