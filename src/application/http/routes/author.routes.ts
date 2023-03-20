import { Router } from 'express'
import { RegisterController } from '../controllers/authors/register'
import { validateBodySchema } from '../middlewares/validate-author-body-schema'

const authorRouter = Router()

const registerController = new RegisterController()

authorRouter.post('/', validateBodySchema, registerController.handle)

export { authorRouter }
