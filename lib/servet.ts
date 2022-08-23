import type { User } from '@prisma/client'
import type { NextApiHandler } from 'next'
import { NextApiRequest, NextApiResponse } from 'next'
import { authenticate } from './auth'
import { ERROR_UNKNOWN, ERROR_UNSUPPORTED_METHOD } from './constants'
import { makeError, StandardError } from './error'
import { err, Result } from './r'

type AuthenticatedNextApiRequest = NextApiRequest & {
  user: User
}
type AuthenticatedRequestHandler<S = any, E = StandardError> = (req: AuthenticatedNextApiRequest, res: NextApiResponse) => Result<S, E> | Promise<Result<S, E>>
type UnauthenticatedRequestHandler<S = any, E = StandardError> = (req: NextApiRequest, res: NextApiResponse) => Result<S, E> | Promise<Result<S, E>>

type Method = typeof METHODS[number]
type CreateRequestHandlerOptions = {
  [M in Method]: {
    authenticate: true
    handler: AuthenticatedRequestHandler
  }  | {
    authenticate?: false
    handler: UnauthenticatedRequestHandler
  }
}

const METHODS = ['POST', 'PUT', 'GET', 'DELETE'] as const

const handleResponse = (responseData: Result<any, any>, res: NextApiResponse) => {
  const { statusCode, ...data } = responseData.data

  let status = statusCode
  
  if(responseData.ok) {
    status = 200
  } else if(!status) {
    status = 500
  }

  
  res.status(statusCode)
  res.json(data)
}


export const createRequestHandler = (options: CreateRequestHandlerOptions) => {
  const handler: NextApiHandler = async (req, res) => {
    const method = req.method as Method | undefined
    const handlerDetails = method && METHODS.includes(method) ? options[method] : null

    // Check method
    if(!handlerDetails) {
      return handleResponse(err(makeError({
          code: ERROR_UNSUPPORTED_METHOD,
          statusCode: 405,
          message: 'This method is not supported',
        }
      )), res)
    }

    try {
      // Authenticate
      if(handlerDetails.authenticate) {
        const authResult = await authenticate(req)
        if(authResult.err) {
          return handleResponse(authResult, res)
        }

        (req as AuthenticatedNextApiRequest).user = authResult.data.user
      }

      // Handle response
      return handleResponse(await handlerDetails.handler(req as any, res), res)
    } catch(e) {
      return handleResponse(err(makeError({
        code: ERROR_UNKNOWN,
        message: 'Something wrong happened',
      }
    )), res)
    }
  }

  return handler
}