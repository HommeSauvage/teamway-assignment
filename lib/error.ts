import type { ZodIssue } from 'zod'

export type StandardError<M = any> = {
  code: string
  statusCode?: number
  message?: string
  metadata?: M
  validationError?: ZodIssue[]
}

export const makeError = <M>(err: StandardError<M>) => {
  return err
}