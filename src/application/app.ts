import 'reflect-metadata'
import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express'
import { route } from './http/routes'
import '@/shared/container'
import { AppError } from '@/shared/errors/global-errors'

export const app = express()

app.use(express.json())
app.use(route)

app.get('/', (req, res) => {
  return res.json({
    message: 'hello world',
  })
})

app.use(
  (error: Error, req: Request, res: Response, next: NextFunction): Response => {
    if (error instanceof AppError) {
      const { message, statusCode } = error
      return res.status(statusCode).json({
        message,
      })
    }

    return res.status(500).json({
      status: error,
      message: `Internal server error ${error.message}`,
    })
  },
)
