import type {
  Questionnaire as OriginalQuestionnaire,
  Submission as OriginalSubmission,
  Question as OriginalQuestion,
} from '@prisma/client'

/**
 * In a real project, I made advanced types to automate most of
 * what's in this file, however, since I'm not copying ANY code
 * from my previous projects, I will do it very simply.
 */
// ----------

type FixCreationDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export type Question = FixCreationDates<OriginalQuestion>
export type Questionnaire = FixCreationDates<OriginalQuestionnaire>
export type Submission = Omit<FixCreationDates<OriginalSubmission>, 'startedAt' | 'completedAt'> & {
  startedAt: string
  completedAt: string
}

export type QuestionnaireWithQuestions = Questionnaire & {
  questions: Question[]
}

export type SubmissionWithQuestionnaire = Submission & {
  questionnaire: QuestionnaireWithQuestions
}