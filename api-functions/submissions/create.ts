import prisma from 'lib/prisma'
import { UnauthenticatedRequestHandler } from 'lib/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { ok, Result } from 'lib/r'
import { ObjectId } from 'bson'
import { StandardError } from 'lib/error'

export type Response = {
  isNew: boolean
  submissionId: string
  authToken: string
  step: number
}

const Body = z.object({
  userName: z.string().min(3).transform((u) => u.toLowerCase()),
  questionnaireId: z.string()
})

const handler: UnauthenticatedRequestHandler = async (req): Promise<Result<Response, StandardError>> => {
  const { userName, questionnaireId } = Body.parse(req.body)

  // Check if the user exists or create one
  const authToken = nanoid()
  const newUserId = `${new ObjectId()}`

  const user = await prisma.user.upsert({
    where: {
      userName,
    },
    create: {
      id: newUserId,
      userName,
      authToken,
    },
    update: {
      authToken,
    },
    include: {
      submissions: {
        where: {
          completed: false,
          questionnaireId,
        }
      }
    }
  })

  // Find the submission by the user or create one
  const submission = user.submissions?.[0] || await prisma.submission.create({
    data: {
      user: {
        connect: {
          id: user.id
        },
      },
      questionnaire: {
        connect: {
          id: questionnaireId
        }
      }
    }
  })

  return ok({
    isNew: newUserId === user.id,
    authToken,
    submissionId: submission.id,
    step: submission.currentStep
  })
}

export default handler