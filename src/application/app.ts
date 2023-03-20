import 'reflect-metadata'
import express from 'express'

export const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  return res.json({
    message: 'hello world',
  })
})
