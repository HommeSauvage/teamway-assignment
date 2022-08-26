import { Button, Fade } from '@chakra-ui/react'
import Container from 'components/basic/Container'
import { FC, useCallback, useContext, useState } from 'react'
import { SubmissionContext, SubmissionContextProps, SubmissionProvider } from './context'
import QuestionBox from './QuestionBox'
import Summary from './Summary'
import { getTimeElapsedSince } from './utils'

const Submission = () => {
  const { questions, submitAnswer, submission, currentStep, isSubmitting } = useContext(SubmissionContext)
  const [localStep, setLocalStep] = useState(currentStep)
  const [startTime, setStartTime] = useState(new Date)
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>()
  const fadeRef = useCallback((node: HTMLDivElement) => {
    if(!node) {
      setLocalStep((s) => s+1)
      setStartTime(new Date)
      return
    }
  }, [])
  // Context fixes the currentStep and we're sure we won't have some out of bounds value in here
  const currentQuestion = questions[currentStep]

  return (
    <Container>
      <Fade 
        ref={fadeRef} 
        in={localStep === currentStep} 
        unmountOnExit={true}>
        {!submission?.completed && currentQuestion && <QuestionBox 
          question={currentQuestion} 
          onSelectAnswer={setSelectedAnswer} 
          selectedAnswer={selectedAnswer} />}

        {submission?.completed && <Summary />}
      </Fade>

      {!submission?.completed && (<Button 
        mt={4}
        isDisabled={!selectedAnswer}
        onClick={() => submitAnswer(currentQuestion.id, selectedAnswer!, getTimeElapsedSince(startTime))}
        isLoading={isSubmitting}>Next</Button>)}
    </Container>
  )
}

const SubmissionWithContext: FC<SubmissionContextProps> = (props) => (
  <SubmissionProvider {...props}>
    <Submission />
  </SubmissionProvider>
)

export default SubmissionWithContext
