import type {
  Questionnaire as OriginalQuestionnaire
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

export type Questionnaire = FixCreationDates<OriginalQuestionnaire>