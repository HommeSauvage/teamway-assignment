import Cookies from 'js-cookie'
import { useCallback } from 'react'
import type { Fetcher } from 'swr'
import { COOKIES_AUTH_TOKEN } from './constants'
import { enhancedFetch } from './fetch'

type DefaultKey = string | null

export const useSWRFetcher = <D = unknown>(): Fetcher<D, DefaultKey> => {
  // This should be a proper state management for auth, but for the sake of the example,
  // we'll just do it this way
  const token = Cookies.get(COOKIES_AUTH_TOKEN)

  const fetcher: Fetcher<D, DefaultKey> = useCallback(async (url: string): Promise<D> => {
    const result = await enhancedFetch<D>(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if(result.err) {
      throw result.data.body
    }

    return result.data.body
  }, [token])

  return fetcher
}