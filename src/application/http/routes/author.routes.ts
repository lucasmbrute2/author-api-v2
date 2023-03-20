import { Router } from 'express'
import { AuthenticateController } from '../controllers/authors/authenticate'
import { LogoutController } from '../controllers/authors/logout'
import { RegisterController } from '../controllers/authors/register'
import { Authorization } from '../middlewares/ensure-authenticate'
import {
  validateAuthenticateSchema,
  validateRegisterSchema,
} from '../middlewares/validate-author-body-schema'

const authorRouter = Router()

const authorization = new Authorization()

const registerController = new RegisterController()
const authController = new AuthenticateController()
const logoutController = new LogoutController()

authorRouter.post('/', validateRegisterSchema, registerController.handle)
authorRouter.post('/session', validateAuthenticateSchema, authController.handle)

// protected routes
authorRouter.get('/logout', authorization.ensureAuth, logoutController.handle)

export { authorRouter }
