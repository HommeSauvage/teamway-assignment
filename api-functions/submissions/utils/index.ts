import { Questionnaire, Submission } from '@prisma/client'
import type { QuestionnaireWithQuestions, SubmissionWithQuestionnaire } from 'backend-types'
import { ERROR_INVALID_DATA } from 'lib/constants'
import { makeError, StandardError } from 'lib/error'
import { err, ok, Result } from 'lib/r'


/**
 * We use this function to keep the order of questions intact in the answers
 */
 export const buildAnswers = (submission: SubmissionWithQuestionnaire, questionId: string, answerId: string, timeElapsedToAnswer?: number): Result<NonNullable<Submission['answers']>, StandardError> => {
  const answers: Submission['answers'] = []

  // Make sure all answers are correctly ordered
  for(let question of submission.questionnaire.questions) {
    const alreadyAnswered = submission.answers.find((a) => a.questionId === question.id)
    if(alreadyAnswered) {
      answers.push(alreadyAnswered)
    }
  }

  // Now that we ordered the answers, let's try to add this new answer
  // Find the question index
  const questionIndex = submission.questionnaire.questions.findIndex((q) => q.id === questionId)
  // We use bitwise to make it easy. This is the equivalent of questionIndex === -1
  if(!~questionIndex) {
    return err(makeError({
      code: ERROR_INVALID_DATA,
      statusCode: 422,
      message: `There's no question with id ${questionId} in the questionnaire`
    }))
  }

  // Make sure the question is in the correct order. Since questionIndex is 0 based
  // and answers.length is 1 based, answers.length should be same as questionIndex
  // example, if questionIndex is 5 (meaning we're answering the 6th question), answers.length
  // should be 5 (meaning we answered 5 questions and now adding the 6th)
  if(answers.length !== questionIndex) {
    return err(makeError({
      code: ERROR_INVALID_DATA,
      statusCode: 422,
      message: `Whoops! Looks like you're trying to answer questions without following the order.`
    }))
  }

  const question = submission.questionnaire.questions[questionIndex]

  // Make sure the answer is valid
  const answer = question.possibleAnswers.find((a) => a.id === answerId)
  if(!answer) {
    return err(makeError({
      code: ERROR_INVALID_DATA,
      statusCode: 422,
      message: `There's no answer with id ${answerId} for questionnaire ${questionId}.`
    }))
  }

  // Now we add the answer
  answers.push({
    questionId: question.id,
    question: question.text,
    answerId: answer.id,
    answer: answer.text,
    points: answer.points,
    timeElapsedToAnswer: timeElapsedToAnswer || null,
  })

  return ok(answers)
}

export const evaluateSubmission = (submission: SubmissionWithQuestionnaire): Pick<Submission, 'evaluationNotes' | 'pass'> => {
  const evaluation = submission.questionnaire.evaluations.find((e) => submission.points >= e.minPoints && submission.points <= e.maxPoints)

  return {
    pass: evaluation?.passes || null,
    evaluationNotes: evaluation?.notes || null,
  }
}