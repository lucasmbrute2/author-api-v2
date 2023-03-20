import { AppError } from '@/shared/errors/global-errors'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export function validateBodySchema(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    username: z.string().email(),
    password: z.string().min(6),
  })

  const validation = registerBodySchema.safeParse(req.body)

  if (validation.success === false) {
    throw new AppError(
      `Invalid body: ${JSON.stringify(validation.error.format())}`,
      400,
    )
  }

  return next()
}
