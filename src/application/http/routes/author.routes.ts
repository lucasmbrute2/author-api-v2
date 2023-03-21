import { Router } from 'express'
import { AuthenticateController } from '../controllers/authors/authenticate'
import { ChangePasswordController } from '../controllers/authors/change-password'
import { LogoutController } from '../controllers/authors/logout'
import { RegisterController } from '../controllers/authors/register'
import { Authorization } from '../middlewares/ensure-authenticate'
import { validateAuthorBody } from '../middlewares/validate-author-body'

const authorRouter = Router()

const authorization = new Authorization()

const registerController = new RegisterController()
const authController = new AuthenticateController()
const logoutController = new LogoutController()
const changePasswordController = new ChangePasswordController()

authorRouter.post('/', validateAuthorBody, registerController.handle)
authorRouter.post('/session', validateAuthorBody, authController.handle)

// protected routes
authorRouter.get('/logout', authorization.ensureAuth, logoutController.handle)
authorRouter.patch(
  '/password',
  authorization.ensureAuth,
  validateAuthorBody,
  changePasswordController.handle,
)

export { authorRouter }
