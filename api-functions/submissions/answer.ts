import type { AuthenticatedRequestHandler } from 'lib/server'
import { z } from 'zod'
import { err, ok, Result } from 'lib/r'
import { makeError, StandardError } from 'lib/error'
import prisma from 'lib/prisma'
import { notFound } from 'lib/helpers'
import type { Submission } from '@prisma/client'
import { ERROR_UNKNOWN, ERROR_CONFLICT } from 'lib/constants'
import { buildAnswers, evaluateSubmission } from './utils'

const Query = z.object({
  id: z.string()
})

const Body = z.object({
  questionId: z.string(),
  answerId: z.string(),
  timeElapsedToAnswer: z.number().optional(),
})


const handler: AuthenticatedRequestHandler = async (req): Promise<Result<Submission, StandardError>> => {
  const { id: submissionId } = Query.parse(req.query)
  const { questionId, answerId, timeElapsedToAnswer } = Body.parse(req.body)

  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId
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
    return notFound(`Submission ${submissionId} not found.`)
  }

  const alreadyAnswered = submission.answers.find((a) => a.questionId === questionId)
  if(alreadyAnswered) {
    return err(makeError({
      code: ERROR_CONFLICT,
      statusCode: 409,
      message: `Are we cheating? It seems like you already submitted that answer. Here's your answer: ${alreadyAnswered.answer}`,
    }))
  }

  try {
    const answersResult = buildAnswers(submission, questionId, answerId, timeElapsedToAnswer)
    if(answersResult.err) {
      return answersResult
    }
    
    const answers = answersResult.data
    const completed = answers.length === submission.questionnaire.questions.length
    const points = answers.reduce((c, a) => c + a.points, 0)
    const evaluation = completed ? evaluateSubmission({
      ...submission,
      points,
    }) : {}

    return ok(await prisma.submission.update({
      where: {
        id: submissionId
      },
      data: {
        answers,
        points,
        completed,
        completedAt: completed ? new Date() : null,
        ...evaluation,
      }
    }))
  } catch(e) {
    // log error with some reporter
    console.error(e)

    return err(makeError({
      code: ERROR_UNKNOWN,
      message: (e as Error).message || 'Something wrong happened during the submissions. Please try again.'
    }))
  }
  


}

export default handler
