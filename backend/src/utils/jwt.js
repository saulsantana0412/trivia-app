import jwt from 'jsonwebtoken'

import { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_EXPIRES_IN } from '../config/config.js'

export function signAccessToken(payload){
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})
}

export function signRefreshToken(payload){
    return jwt.sign(payload, JWT_SECRET, {expiresIn: REFRESH_EXPIRES_IN})
}

export function verifyToken(token){
    return jwt.verify(token, JWT_SECRET)
}

export function generateTokens(payload) {
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    }
  }
  