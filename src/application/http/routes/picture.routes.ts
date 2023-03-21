import multer from 'multer'
import { Router } from 'express'
import { multerConfigs } from '@/application/constraints/upload-multer'
import { Authorization } from '../middlewares/ensure-authenticate'
import { DeletePictureController } from '../controllers/pictures/delete-controller'
import { CreatePictureController } from '../controllers/pictures/create-controller'
import { FetchPicturesController } from '../controllers/pictures/fetch-pictures-controller'

const picturesRoutes = Router()
const authorization = new Authorization()

const createPictureController = new CreatePictureController()
const deletePictureController = new DeletePictureController()
const fetchPicturesController = new FetchPicturesController()

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

picturesRoutes.get(
  '/me/search',
  authorization.ensureAuth,
  fetchPicturesController.handle,
)

export { picturesRoutes }
