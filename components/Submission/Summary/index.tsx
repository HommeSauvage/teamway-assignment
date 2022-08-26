import { Box, Grid } from '@chakra-ui/react'
import { Fragment, useContext } from 'react'
import { SubmissionContext } from '../context'
import SummarySkeleton from './SummarySkeleton'
import useWindowSize from 'react-use/lib/useWindowSize'
import dynamic from 'next/dynamic'

/**
 * We need to exclude Confetti from SSR as there's no width and height during server rendering
 */
const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

const Summary = () => {
  const { submission, isValidating } = useContext(SubmissionContext)
  const { width, height } = useWindowSize()

  if(!submission && isValidating) {
    return (
      <SummarySkeleton />
    )
  }

  if(!submission) {
    return (
      <Box>
        No submission found
      </Box>
    )
  }

  const color = submission.pass ? 'green' : 'red'
  return (
    <>
      <Confetti
        width={width}
        tweenDuration={10000}
        recycle={false}
        height={height} />

      <Box>
        Congratulations, you have finished the questionnaire, here&apos;s your evalutation
        <Grid
          mt={4}
          borderRadius={'md'}
          borderWidth={'1px'}
          borderColor={color}
          p={2}
          alignItems={'center'}
          gridTemplateColumns={'min-content 1fr'}>
          <Box 
            px={4}
            color={color}
            fontSize={'3xl'}>{submission?.points}</Box>
          <Box>{submission?.evaluationNotes}</Box>
        </Grid>

        <Box mt={4} fontSize={'lg'}>Here&apos;s your submission:</Box>
        <Box as={'dl'} mt={2}>
          {submission.answers.map((a) => (
            <Fragment key={a.answerId}>
              <Box as={'dt'} mt={3} fontWeight={'bold'}>{a.question}</Box>
              <Box as={'dl'}>{a.answer}</Box>
            </Fragment>
          ))}
        </Box>
        
      </Box>
    </>
  )
}

export default Summary
