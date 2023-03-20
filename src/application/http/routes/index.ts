import { Router } from 'express'
import { authorRouter } from './author.routes'
const route = Router()

route.use('/author', authorRouter)

export { route }
