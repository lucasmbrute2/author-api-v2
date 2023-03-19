export class BaseEntityFieldValidation {
  constructor(
    private readonly field: string,
    private readonly regex: RegExp,
    private readonly shouldValidate: boolean,
  ) {
    if (!this.shouldValidate) return
    if (!this.field) throw new Error('Missing field, please provide a input')

    if (!this.isInputValid())
      throw new Error(`The field ${this.field} is invalid.`)
  }

  private isInputValid(): boolean {
    return this.field.match(this.regex) !== null
  }

  value() {
    return this.field
  }
}
