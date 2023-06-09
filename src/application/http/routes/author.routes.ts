import { Router } from 'express'
import { AuthenticateController } from '../controllers/authors/authenticate/authenticate-controller'
import { ChangePasswordController } from '../controllers/authors/change-password/change-password-controller'
import { LogoutController } from '../controllers/authors/logout/logout-controller'
import { RefreshTokenController } from '../controllers/authors/refresh/refresh-controller'
import { RegisterController } from '../controllers/authors/register/register-controller'
import { Authorization } from '../middlewares/ensure-authenticate'
import { validateAuthorBody } from '../middlewares/validate-author-body'

const authorRouter = Router()

const authorization = new Authorization()

const registerController = new RegisterController()
const authController = new AuthenticateController()
const logoutController = new LogoutController()
const changePasswordController = new ChangePasswordController()
const refreshTokenController = new RefreshTokenController()

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

authorRouter.patch('/token/refresh', refreshTokenController.handle)

export { authorRouter }
