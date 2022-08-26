import { useToast } from '@chakra-ui/react'
import { config } from 'config'
import type { Question, Submission, SubmissionWithQuestionnaire } from 'frontend-types'
import type { StandardError } from 'lib/error'
import { enhancedFetch } from 'lib/fetch'
import { useSWRFetcher } from 'lib/swr-fetcher'
import { useAuth } from 'lib/use-auth'
import { useRouter } from 'next/router'
import { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export type SubmissionContextProps = {
  initialSubmissionId?: string
  initialSubmission?: SubmissionWithQuestionnaire 
}

type SubmissionContextState = {
  submissionId?: string
  submission?: SubmissionWithQuestionnaire
  currentStep: number
  isSubmitting: boolean
  questions: Question[]
  error?: StandardError
  isValidating: boolean
  submitAnswer: (questionId: string, answerId: string, timeElapsedToAnswer?: number) => void
}

const defaultContext: SubmissionContextState = {
  currentStep: 0,
  submitAnswer: () => {},
  questions: [],
  isSubmitting: false,
  isValidating: false
}

export const SubmissionContext = createContext<SubmissionContextState>(defaultContext)

export const SubmissionProvider: FC<PropsWithChildren<SubmissionContextProps>> = ({ children, initialSubmissionId, initialSubmission }) => {
  const submissionFetcher = useSWRFetcher<SubmissionWithQuestionnaire>()
  const router = useRouter()
  const toast = useToast()
  const { authToken } = useAuth()
  const submissionId: string | undefined = router.query.id ? `${router.query.id}` : initialSubmissionId
  const { data: submission, error, mutate, isValidating } = useSWR<SubmissionWithQuestionnaire, StandardError>(submissionId ? `${config.apiUrl}/submissions/${submissionId}` : null, submissionFetcher, {
    fallbackData: initialSubmission,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStep: number = submission?.currentStep || 0

  const submitAnswer = useCallback(async (questionId: string, answerId: string, timeElapsedToAnswer?: number) => {
    if(isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      if(!submissionId) {
        toast({
          status: 'error',
          title: 'No submission ID'
        })
        return 
      }

      const submissionResult = await enhancedFetch<Submission>(`${config.apiUrl}/submissions/${submissionId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          questionId,
          answerId,
          timeElapsedToAnswer
        })
      })
  
      if(submissionResult.err) {
        toast({
          status: 'error',
          title: 'Something wrong happened',
          description: submissionResult.data.body.message || `Error code: ${submissionResult.data.body.code}`
        })
        return
      }
  
      // Update using SWR technique
      // @ts-expect-error
      mutate({
        ...submission,
        ...submissionResult.data.body
      })
    } catch(e) {
      toast({
        status: 'error',
        title: 'Something went wrong'
      })
    } finally {
      setIsSubmitting(false)
    }

  }, [submissionId, toast, authToken, submission, mutate, isSubmitting])

  const context: SubmissionContextState = useMemo(() => ({
    submissionId,
    submission,
    currentStep,
    questions: submission?.questionnaire.questions || [],
    error,
    isSubmitting,
    submitAnswer,
    isValidating,
  }), [submission, submissionId, currentStep, error, submitAnswer, isSubmitting, isValidating])

  return (
    <SubmissionContext.Provider value={context}>
      {children}
    </SubmissionContext.Provider>
  )
}