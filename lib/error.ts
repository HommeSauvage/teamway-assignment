export type StandardError<M = any> = {
  code: string
  statusCode?: number
  message?: string
  metadata?: M
}

export const makeError = <M>(err: StandardError<M>) => {
  return err
}