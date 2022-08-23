export type Ok<T> = {
  ok: true
  err: false
  data: T
}

export type Err<T> = {
  ok: false
  err: true
  data: T
}

export type Result<S, E> = Ok<S> | Err<E>

export const ok = <T>(data: T): Ok<T> => {
  return {
    ok: true,
    err: false,
    data,
  }
}

export const err = <T>(data: T): Err<T> => {
  return {
    ok: false,
    err: true,
    data,
  }
}