import { env } from '@/application/env'
import { RedisProvider } from '@/application/repositories/redis/redis-provider'
import { AppError } from '@/shared/errors/global-errors'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { container } from 'tsyringe'

export class Authorization {
  async ensureAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    const redisClient = container.resolve(RedisProvider)

    try {
      // @ts-ignore
      // eslint-disable-next-line
      const [_, token] = authHeader.split(' ')

      const { sub: authorId } = verify(token, env.JWT_SECRET)

      const isTokenAvailable = await redisClient.getValue(authorId as string)
      if (isTokenAvailable !== token) {
        throw new AppError('Author token does not match', 401)
      }

      req.authorId = authorId as string

      if (!isTokenAvailable) {
        throw new AppError('Missing token', 403)
      }
    } catch (error) {
      throw new AppError('Missing token', 403)
    }

    return next()
  }
}
