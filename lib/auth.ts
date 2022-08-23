import type { NextApiRequest } from 'next'
import { err, ok, Result } from 'lib/r'
import { makeError, StandardError } from './error'
import { ERROR_UNAUTHENTICATED } from './constants'
import prisma from 'lib/prisma'
import type { User } from '@prisma/client'

type AuthResult = {
  user: User
}

const UNAUTHENTICATED = makeError({
  code: ERROR_UNAUTHENTICATED,
  statusCode: 401,
  message: 'You are not authenticated'
})

export const authenticate = async (req: NextApiRequest): Promise<Result<AuthResult, StandardError>> => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if(!token) {
    return err(UNAUTHENTICATED)
  }

  const user = await prisma.user.findUnique({
    where: {
      authToken: token
    }
  })

  if(!user) {
    return err(UNAUTHENTICATED)
  }

  return ok({
    user,
  })
}