import { AppError } from '@/shared/errors/global-errors'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export function validateRegisterSchema(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const registerBodySchema = z
    .object({
      name: z.string(),
      username: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    })
    .superRefine((data) => {
      if (data.password !== data.confirmPassword) {
        throw new AppError(`Passwords does not match`, 401)
      }
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

export function validateAuthenticateSchema(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authenticateBodySchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
  })

  const validation = authenticateBodySchema.safeParse(req.body)

  if (validation.success === false) {
    throw new AppError(
      `Invalid body: ${JSON.stringify(validation.error.format())}`,
      400,
    )
  }

  return next()
}

export function validateChangePasswordSchema(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authenticateBodySchema = z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  })

  const validation = authenticateBodySchema.safeParse(req.body)

  if (validation.success === false) {
    throw new AppError(
      `Invalid body: ${JSON.stringify(validation.error.format())}`,
      400,
    )
  }

  return next()
}
