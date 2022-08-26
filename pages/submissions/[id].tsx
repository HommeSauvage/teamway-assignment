import Page from 'layout/Page'
import Submission from 'components/Submission'
import type { GetStaticPaths, GetStaticProps } from 'next'
import prisma from 'lib/prisma'
import { SubmissionWithQuestionnaire } from 'frontend-types'
import type { FC } from 'react'

type Props = {
  submission?: SubmissionWithQuestionnaire
  submissionId?: string
}

const SubmissionPage: FC<Props> = ({ submission, submissionId }) => {
  return (
    <Page
      title={'IQ Test'}>
      <Submission 
        initialSubmission={submission}
        initialSubmissionId={submissionId} />
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths = async ({}) => {
  const submissions = await prisma.submission.findMany({
    take: 50,
    orderBy: {
      updatedAt: 'desc'
    }
  })

  const paths = submissions.map((submission) => ({
    params: {
      id: submission.id,
    },
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if(!params?.id || Array.isArray(params.id)) {
    return {
      props: {}
    }
  }

  const submission = await prisma.submission.findUnique({
    where: {
      id: params.id
    },
    include: {
      questionnaire: {
        include: {
          questions: true
        }
      }
    }
  })

  return {
    props: {
      // Next will serializet this
      submission: submission ? JSON.parse(JSON.stringify(submission)) as SubmissionWithQuestionnaire : undefined,
      submissionId: params?.id ? `${params.id}` : undefined
    }
  }
}

export default SubmissionPage