import { Question, Questionnaire, Submission } from '@prisma/client'

// Types in here are meant for backend use. For frontend, use frontend-types.ts

export type QuestionnaireWithQuestions = Questionnaire & {
  questions: Question[]
}

export type SubmissionWithQuestionnaire = Submission & {
  questionnaire: QuestionnaireWithQuestions
}
