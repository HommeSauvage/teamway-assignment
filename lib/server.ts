import type { User } from '@prisma/client'
import type { NextApiHandler } from 'next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticate } from './auth'
import { ERROR_UNKNOWN, ERROR_UNSUPPORTED_METHOD, ERROR_VALIDATION } from './constants'
import { makeError, StandardError } from './error'
import { err, Result } from './r'
import { ZodError } from 'zod'

export type AuthenticatedNextApiRequest = NextApiRequest & {
  user: User
}
export type AuthenticatedRequestHandler<S = any, E = StandardError> = (req: AuthenticatedNextApiRequest, res: NextApiResponse) => Result<S, E> | Promise<Result<S, E>>
export type UnauthenticatedRequestHandler<S = any, E = StandardError> = (req: NextApiRequest, res: NextApiResponse) => Result<S, E> | Promise<Result<S, E>>

type Method = typeof METHODS[number]
type CreateRequestHandlerOptions = {
  [M in Method]?: {
    authenticate: true
    handler: AuthenticatedRequestHandler
  } | {
    authenticate: false
    handler: UnauthenticatedRequestHandler
  }
}

const METHODS = ['POST', 'PUT', 'GET', 'DELETE'] as const

const handleResponse = (responseData: Result<any, any>, res: NextApiResponse) => {
  const { statusCode, ...data } = responseData.data

  let status = statusCode
  
  if(responseData.ok) {
    status = 200
  } else {
    status = status || 500
  }

  res.status(status)
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
      let error = makeError({
        code: ERROR_UNKNOWN,
        message: 'Something wrong happened',
      })

      if(e instanceof ZodError) {
        error = makeError({
          code: ERROR_VALIDATION,
          statusCode: 422,
          message: e.message || 'The submitted data is not valid',
          validationError: e.issues
        })
      } else {
        // report these errors
        console.error('An error happened', e)
      }

      return handleResponse(err(error), res)
    }
  }

  return handler
}