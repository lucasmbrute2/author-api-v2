import { sign } from 'jsonwebtoken'
import { env } from '../env'
import { Author } from '../modules/author/entities/author'
import {
  AccessTokenExpiration,
  RefreshTokenExpiration,
} from './token-expiration'

interface CreateTokensResponse {
  accessToken: {
    token: string
    expirationTime: number
  }
  refreshToken: {
    token: string
    expirationTime: number
  }
}

export function createAccessTokenAndRefreshToken(
  author: Author,
): CreateTokensResponse {
  const accessTokenExpirationTime = new AccessTokenExpiration()
    .tokenExpirationInHours

  const accessToken = sign({}, env.JWT_SECRET, {
    expiresIn: `${accessTokenExpirationTime}h`,
    subject: author.id,
  })

  const refreshTokenExpirationTime = new RefreshTokenExpiration()
    .tokenExpirationInHours

  const refreshToken = sign({}, env.JWT_SECRET, {
    expiresIn: `${refreshTokenExpirationTime}h`,
    subject: author.id,
  })

  return {
    accessToken: {
      token: accessToken,
      expirationTime: accessTokenExpirationTime,
    },
    refreshToken: {
      expirationTime: refreshTokenExpirationTime,
      token: refreshToken,
    },
  }
}
