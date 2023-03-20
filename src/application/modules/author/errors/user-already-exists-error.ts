import { AppError } from '@/shared/errors/global-errors'

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists', 409)
  }
}
