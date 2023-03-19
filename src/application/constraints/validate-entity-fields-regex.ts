export const validation = {
  passwordValidation:
    /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g,
  emailValidation: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g),
}
