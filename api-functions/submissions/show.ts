import prisma from 'lib/prisma'
import { AuthenticatedRequestHandler } from 'lib/server'
import { z } from 'zod'
import { ok, Result } from 'lib/r'
import type { StandardError } from 'lib/error'
import { SubmissionWithQuestionnaire } from 'backend-types'
import { notFound } from 'lib/helpers'

const Query = z.object({
  id: z.string()
})

const handler: AuthenticatedRequestHandler = async (req): Promise<Result<SubmissionWithQuestionnaire, StandardError>> => {
  const { id } = Query.parse(req.query)

  const submission = await prisma.submission.findUnique({
    where: {
      id,
    },
    include: {
      questionnaire: {
        include: {
          questions: true
        }
      }
    }
  })

  if(!submission) {
    return notFound(`Submission ${id} not found`)
  }

  return ok(submission)
}

export default handler