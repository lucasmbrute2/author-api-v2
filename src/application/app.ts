import 'reflect-metadata'
import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express'
import { route } from './http/routes'
import '@/shared/container'
import { AppError } from '@/shared/errors/global-errors'
import cookieParser from 'cookie-parser'
import path from 'path'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(route)
app.use('/picture/', express.static(path.resolve(__dirname, '..', 'tmp')))

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
