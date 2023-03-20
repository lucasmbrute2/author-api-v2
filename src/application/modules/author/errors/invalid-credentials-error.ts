import { AppError } from '@/shared/errors/global-errors'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials', 401)
  }
}
