import Home from 'components/Home'
import Page from 'layout/Page'
import type { NextPage } from 'next'

const HomePage: NextPage = () => {
  return (
    <Page
      title={'Test Your General Knowledge'}
      description={'Test for teamway'}>
      <Home />
    </Page>
  )
}

export default HomePage
