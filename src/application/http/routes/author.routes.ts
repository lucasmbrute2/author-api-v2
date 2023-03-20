import { Router } from 'express'
import { AuthenticateController } from '../controllers/authors/authenticate'
import { RegisterController } from '../controllers/authors/register'
import {
  validateAuthenticateSchema,
  validateRegisterSchema,
} from '../middlewares/validate-author-body-schema'

const authorRouter = Router()

const registerController = new RegisterController()
const authController = new AuthenticateController()

authorRouter.post('/', validateRegisterSchema, registerController.handle)
authorRouter.post('/session', validateAuthenticateSchema, authController.handle)

export { authorRouter }
