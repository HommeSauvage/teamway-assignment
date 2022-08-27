import { Box, Button, Grid, useRadioGroup } from '@chakra-ui/react'
import type { Question, UserAnswer } from 'frontend-types'
import { FC, Fragment } from 'react'
import RadioLine from './RadioLine'

type Props = {
  question: Question
  onSelectAnswer: (answerId: string) => void
  selectedAnswer?: string
}

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] as const

const QuestionBox: FC<Props> = ({ question, onSelectAnswer, selectedAnswer }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: `question:${question.text}`,
    value: selectedAnswer,
    onChange: (a) => onSelectAnswer(a),
  })
  const group = getRootProps()

  return (
    <Grid
      border={'1px solid'}
      borderColor={'gray.200'}
      p={8}
      borderRadius={2}
      gap={'1'}
      {...group}>
      
      <Box my={4} fontSize={'lg'} data-testid={'question'}>
        {question.text}
      </Box>

      {question.possibleAnswers.map((a, i) => {
        const radio = getRadioProps({ value: a.id })

        return (
          <Fragment key={a.id}>
            <RadioLine
              title={ALPHABET[i]}
              description={a.text}
              {...radio} />
          </Fragment>
        )
      })}
    </Grid>
  )
}

export default QuestionBox
