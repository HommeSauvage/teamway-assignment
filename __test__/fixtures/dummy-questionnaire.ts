import { Questionnaire, QuestionnaireWithQuestions } from 'frontend-types'

export const DUMMY_QUESTIONNAIRE: QuestionnaireWithQuestions = {
  id: '63094f2c9a324cccab8f37fb',
  name: 'IQ Test',
  description: 'This is an IQ test',
  version: 0,
  createdAt: '2022-08-26T22:54:36.774Z',
  updatedAt: '2022-08-26T22:54:36.776Z',
  questions: [
    {
        id: '63094f2c9a324cccab8f37fc',
        text: 'What\'s the result of 2+2?',
        possibleAnswers: [
          {
            id: '63094f2ce8b1d18708e5f4c7',
            text: '4',
            isCorrectAnswer: true,
            points: 10
          },
          {
            id: '63094f2ce8b1d18708e5f4c8',
            text: '5',
            isCorrectAnswer: false,
            points: 0
          },
          {
            id: '63094f2ce8b1d18708e5f4c9',
            text: 'Thursday',
            isCorrectAnswer: true,
            points: 2
          }
        ],
        questionnaireId: '63094f2c9a324cccab8f37fb',
        createdAt: '2022-08-26T22:54:36.774Z',
        updatedAt: '2022-08-26T22:54:36.776Z',
      },
      {
        id: '63094f2c9a324cccab8f37fd',
        text: 'What\'s the best thing to do with Apple?',
        possibleAnswers: [
          {
            id: '63094f2ce8b1d18708e5f4ca',
            text: 'Watch some Netflix',
            isCorrectAnswer: true,
            points: 1
          },
          {
            id: '63094f2ce8b1d18708e5f4cb',
            text: 'I\'m not into health food, I\'d rather grab a hotdog',
            isCorrectAnswer: true,
            points: 5
          },
          {
            id: '63094f2ce8b1d18708e5f4cc',
            text: 'Discover gravity',
            isCorrectAnswer: true,
            points: 10
          }
        ],
        questionnaireId: '63094f2c9a324cccab8f37fb',
        createdAt: '2022-08-26T22:54:36.774Z',
        updatedAt: '2022-08-26T22:54:36.776Z',
      },
  ],
  evaluations: [ 
      {
          minPoints: 0,
          maxPoints: 10,
          passes: false,
          notes: 'I\'m sure you did it on purpose'
      }, 
      {
          minPoints: 10,
          maxPoints: 30,
          passes: true,
          notes: 'Look over here, we\'ve got an Einstein in the make'
      }, 
      {
          minPoints: 30,
          maxPoints: 41,
          passes: true,
          notes: 'You\'re one of the top 1% of smart people on earth'
      }, 
      {
          minPoints: 41,
          maxPoints: 1000,
          passes: true,
          notes: 'Something you should know, we\'re building a statue to honor your extreme, once in a millennium, intelligence'
      }
  ]
}