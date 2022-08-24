import { useCallback } from 'react'
import type { Fetcher } from 'swr'
import { enhancedFetch } from './fetch'
import { useAuth } from './use-auth'

type DefaultKey = string | null

export const useSWRFetcher = <D = unknown>(): Fetcher<D, DefaultKey> => {
  // This should be a proper state management for auth, but for the sake of the example,
  // we'll just do it this way
  const { authToken } = useAuth()

  const fetcher: Fetcher<D, DefaultKey> = useCallback(async (url: string): Promise<D> => {
    const result = await enhancedFetch<D>(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })

    if(result.err) {
      throw result.data.body
    }

    return result.data.body
  }, [authToken])

  return fetcher
}