import Home from 'components/Home'
import type { Questionnaire } from 'frontend-types'
import Page from 'layout/Page'
import prisma from 'lib/prisma'
import type { GetStaticProps, NextPage } from 'next'

type Props = {
  questionnaire?: Questionnaire
}

const HomePage: NextPage<Props> = ({ questionnaire }) => {
  return (
    <Page
      title={'Test Your General Knowledge'}
      description={'Test for teamway'}>
      <Home questionnaire={questionnaire} />
    </Page>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const questionnaire = await prisma.questionnaire.findFirst()

  return {
    props: {
      // Next will serializet this
      questionnaire: questionnaire ? JSON.parse(JSON.stringify(questionnaire)) as Questionnaire : undefined,
    },
    revalidate: 1
  }
}

export default HomePage
