import multer from 'multer'
import { Router } from 'express'
import { multerConfigs } from '@/application/constraints/upload-multer'
import { Authorization } from '../middlewares/ensure-authenticate'
import { DeletePictureController } from '../controllers/pictures/delete-controller'
import { CreatePictureController } from '../controllers/pictures/create-controller'

const picturesRoutes = Router()
const authorization = new Authorization()

const createPictureController = new CreatePictureController()
const deletePictureController = new DeletePictureController()

const upload = multer(multerConfigs)

// protected routes
picturesRoutes.post(
  '/',
  authorization.ensureAuth,
  upload.single('picture'),
  createPictureController.handle,
)
picturesRoutes.delete(
  '/:aliasKey',
  authorization.ensureAuth,
  deletePictureController.handle,
)

export { picturesRoutes }
