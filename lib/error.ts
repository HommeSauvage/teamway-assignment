export type StandardError<M = any> = {
  code: string
  message?: string
  metadata?: M
}

export const makeError = <M>(err: StandardError<M>) => {
  return err
}