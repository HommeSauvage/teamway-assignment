import prisma from 'lib/prisma'
import { UnauthenticatedRequestHandler } from 'lib/server'
import { ok, Result } from 'lib/r'
import { StandardError } from 'lib/error'
import { Questionnaire } from '@prisma/client'
import { DUMMY_QUESTIONNAIRE_CREATE } from './dummy-questionnaire'

export type Response = Questionnaire

const handler: UnauthenticatedRequestHandler = async (): Promise<Result<Response, StandardError>> => {
  return ok(await prisma.questionnaire.create({
    data: DUMMY_QUESTIONNAIRE_CREATE
  }))
}

export default handler