import 'reflect-metadata'
import express from 'express'
import { route } from './http/routes'
import '@/shared/container'

export const app = express()

app.use(express.json())
app.use(route)

app.get('/', (req, res) => {
  return res.json({
    message: 'hello world',
  })
})
