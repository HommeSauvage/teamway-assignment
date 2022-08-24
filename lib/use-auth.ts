import Cookies from 'js-cookie'
import { COOKIES_AUTH_TOKEN } from './constants'

// This is some mock hook to simulate auth
export const useAuth = () => {
  return {
    authToken: Cookies.get(COOKIES_AUTH_TOKEN)
  }
}