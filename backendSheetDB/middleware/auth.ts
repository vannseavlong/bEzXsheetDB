import type { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt'

export interface AuthRequest extends Request {
  user?: Record<string, unknown>
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorised' })
  }
  try {
    const token = header.slice(7)
    req.user = verifyJwt(token, process.env.JWT_SECRET ?? 'dev-secret-change-in-production')
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role as string | undefined
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}
