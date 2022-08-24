import { ERROR_NOT_FOUND } from './constants'
import { makeError } from './error'
import { err } from './r'

export const notFound = (message: string) => {
  return err(makeError({
    code: ERROR_NOT_FOUND,
    message,
  }))
}