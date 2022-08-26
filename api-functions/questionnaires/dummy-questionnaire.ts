import { Prisma } from '@prisma/client'
import { ObjectId } from 'bson'

const id = () => `${new ObjectId()}`

export const DUMMY_QUESTIONNAIRE_CREATE: Prisma.QuestionnaireCreateInput = {
  name: 'IQ Test',
  description: 'This is an IQ test',
  evaluations: [
    {
      minPoints: 0,
      maxPoints: 10,
      passes: false,
      notes: `I'm sure you did it on purpose, right? ... rrright?`
    },
    {
      minPoints: 10,
      maxPoints: 30,
      passes: true,
      notes: `Look over here, we've got an Einstein in the make`
    },
    {
      minPoints: 30,
      maxPoints: 41,
      passes: true,
      notes: `You're one of the top 1% of smart people on earth`
    },
    {
      minPoints: 41,
      maxPoints: 1000,
      passes: true,
      notes: `Something you should know, we're building a statue to honor your extreme, once in a millennium, intelligence`
    }
  ],
  questions: {
    createMany: {
      data: [
        {
          text: 'What\'s the result of 2+2?',
          possibleAnswers: [
            {
              id: id(),
              text: '4',
              isCorrectAnswer: true,
              points: 10,
            },
            {
              id: id(),
              text: '5',
              isCorrectAnswer: false,
              points: 0,
            },
            {
              id: id(),
              text: 'Thursday',
              isCorrectAnswer: true,
              points: 2,
            }
          ]
        },
        {
          text: 'What\'s the best thing to do with Apple?',
          possibleAnswers: [
            {
              id: id(),
              text: 'Watch some Netflix',
              isCorrectAnswer: true,
              points: 1,
            },
            {
              id: id(),
              text: 'I\'m not into health food, I\'d rather grab a hotdog',
              isCorrectAnswer: true,
              points: 5,
            },
            {
              id: id(),
              text: 'Discover gravity',
              isCorrectAnswer: true,
              points: 10,
            }
          ]
        },
        {
          text: 'Do we have free will?',
          possibleAnswers: [
            {
              id: id(),
              text: 'Nope, I\'m not getting into this debate',
              isCorrectAnswer: true,
              points: 10,
            },
            {
              id: id(),
              text: 'Yep',
              isCorrectAnswer: true,
              points: 5,
            },
            {
              id: id(),
              text: 'Nope',
              isCorrectAnswer: true,
              points: 5,
            }
          ]
        },
        {
          text: 'How many questions are left in this questionnaire already?',
          possibleAnswers: [
            {
              id: id(),
              text: 'Do you think I have all day? Better it be the last question.',
              isCorrectAnswer: true,
              points: 5,
            },
            {
              id: id(),
              text: 'With this tone of questions, probably 120?',
              isCorrectAnswer: true,
              points: 5,
            },
            {
              id: id(),
              text: '2',
              isCorrectAnswer: false,
              points: 0,
            }
          ]
        },
        {
          text: 'Ok, promise, one last question. Did you like the work?',
          possibleAnswers: [
            {
              id: id(),
              text: 'Absolutely phenomenal!',
              isCorrectAnswer: true,
              points: 500,
            },
            {
              id: id(),
              text: 'Yeah, love it!',
              isCorrectAnswer: true,
              points: 10,
            },
            {
              id: id(),
              text: 'Amazing work!',
              isCorrectAnswer: false,
              points: 10,
            }
          ]
        },
        
      ]
    }
  },
}
