import { StandardError } from './error'
import { err, ok, Result } from './r'

type Wrapper<T> = {
  status: number
  body: T
}

export const enhancedFetch = async <S, E = StandardError>(url: string, init?: RequestInit): Promise<Result<Wrapper<S>, Wrapper<E>>> => {
  const result = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      ...init?.headers
    }
  })

  let body
  try {
    body = await result.json()
  } catch(e) {
    body = null
  }
  
  const status = result.status

  const data = {
    status,
    body
  }

  const respondWith = status < 300 && status >= 200 ? ok : err

  return respondWith(data)
}