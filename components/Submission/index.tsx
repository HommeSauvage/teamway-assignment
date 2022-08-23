import { Box } from '@chakra-ui/react'
import { FC } from 'react'
import { SubmissionContextProps, SubmissionProvider } from './context'

const Submission = () => {
  return (
    <Box>
      Submission
    </Box>
  )
}

const SubmissionWithContext: FC<SubmissionContextProps> = (props) => (
  <SubmissionProvider {...props}>
    <Submission />
  </SubmissionProvider>
)

export default SubmissionWithContext
