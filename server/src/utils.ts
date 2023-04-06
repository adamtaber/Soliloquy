import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config'
import { jwtPayload } from './types'

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production'
}

export const checkToken = (req: any) => {
  try {
    if (req.cookies.id) {
      const verification = jwt.verify(req.cookies.id, JWT_SECRET as string) as jwtPayload
      return verification.user_id
    }
    return false
  } catch(err) {
    console.log(err)
    return false
  }
}

