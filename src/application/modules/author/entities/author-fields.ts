import { validation } from '@/application/constraints/validate-entity-fields-regex'
import { BaseEntityFieldValidation } from '@/application/helpers/base-entity-field-validation'

export class Username extends BaseEntityFieldValidation {
  constructor(field: string, shouldValidate = true) {
    super(field, validation.emailValidation, shouldValidate)
  }
}

export class Password extends BaseEntityFieldValidation {
  constructor(field: string, shouldValidate = true) {
    super(field, validation.passwordValidation, shouldValidate)
  }
}
