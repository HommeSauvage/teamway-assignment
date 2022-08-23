import { useToast } from '@chakra-ui/react'
import { config } from 'config'
import type { SubmissionWithQuestionnaire } from 'frontend-types'
import type { StandardError } from 'lib/error'
import { enhancedFetch } from 'lib/fetch'
import { useSWRFetcher } from 'lib/swr-fetcher'
import { useRouter } from 'next/router'
import { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'

export type SubmissionContextProps = {
  initialSubmissionId?: string
  initialStep?: number
  initialSubmission?: SubmissionWithQuestionnaire 
}

type SubmissionContextState = {
  submissionId?: string
  submission?: SubmissionWithQuestionnaire
  currentStep: number
  error?: StandardError
  submitAnswer: (questionId: string, answerId: string) => void
}

const defaultContext: SubmissionContextState = {
  currentStep: 0,
  submitAnswer: () => {}
}

const SubmissionContext = createContext<SubmissionContextState>(defaultContext)

export const SubmissionProvider: FC<PropsWithChildren<SubmissionContextProps>> = ({ children, initialSubmissionId, initialSubmission, initialStep }) => {
  const submissionFetcher = useSWRFetcher<SubmissionWithQuestionnaire>()
  const router = useRouter()
  const toast = useToast()
  const submissionId: string | undefined = router.query.id ? `${router.query.id}` : initialSubmissionId

  const { data: submission, error } = useSWR<SubmissionWithQuestionnaire, StandardError>(submissionId ? `${config.apiUrl}/submissions/${submissionId}` : null, submissionFetcher, {
    fallbackData: initialSubmission
  })

  const maxLength = submission?.questionnaire.questions.length
  const isValidStep = useCallback((id?: string | string[]): id is string => {
    let isValid = typeof id === 'string' 

    if(typeof maxLength !== 'number') {
      return isValid
    }


    return isValid && +(id as string) < maxLength && +(id as string) >= 0
  }, [maxLength])

  const currentStep: number = isValidStep(router.query.id) ? +router.query.id : initialStep || 0

  const submitAnswer = useCallback(async () => {
    if(!submissionId) {
      toast({
        status: 'error',
        title: 'No submission ID'
      })
      return 
    }
    await enhancedFetch(`${config.apiUrl}/submissions/${submissionId}`)
  }, [submissionId, toast])

  const context: SubmissionContextState = useMemo(() => ({
    submissionId,
    submission,
    currentStep,
    error,
    submitAnswer,
  }), [submission, submissionId, currentStep, error, submitAnswer])

  return (
    <SubmissionContext.Provider value={context}>
      {children}
    </SubmissionContext.Provider>
  )
}