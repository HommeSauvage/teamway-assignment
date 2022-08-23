import { Button, Flex, Text, useToast } from '@chakra-ui/react'
import Container from 'components/basic/Container'
import { config } from 'config'
import Cookies from 'js-cookie'
import { enhancedFetch } from 'lib/fetch'
import { useRouter } from 'next/router'
import type { Response } from 'pages/api/submissions'
import { FormEventHandler, useState } from 'react'

const Home = () => {
  const [userName, setUserName] = useState('')
  const toast = useToast()
  const router = useRouter()

  // useCallback is not necessary in here as we have only one state we're changing
  // and not much to worry about. However, in a prod app with mission critical components
  // useMemo and useCallback will be very important
  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const response = await enhancedFetch<Response>(`${config.apiUrl}/submissions`, {
      method: 'POST',
      body: JSON.stringify({
        userName,
      })
    })

    if(response.err) {
      toast({
        status: 'error',
        title: 'Something went wrong',
        description: `${response.data.message || `Error code: ${response.data.code}`}`
      })
      return
    }

    if(response.data.isNew) {
      toast({
        status: 'success',
        title: 'All good!',
        description: `Your usrname is now saved and you will be able to continue the test just by providing your username.`
      })
    } else {
      toast({
        status: 'success',
        title: 'Welcom back!',
        description: `You've got some unfinished business here`
      })
    }

    Cookies.set('auth', response.data.authToken, {
      expires: 1
    })
    
    router.push(`/submission/${response.data.submissionId}?step=${response.data.step}`)

  }

  return (
    <Container>
      <Text>
        Hello there. This is some dummy test of your IQ. If you believe this test will determine your IQ, then it&apos;s probably low.
      </Text>

      <Text mt={2}>
        In fact, there are no real answers, just chose whichever you think is the most ridiculous statement.
      </Text>

      <Text mt={4}>
        Start by adding your username here (we will use that to record your progress) and hit start.
        <br />
        Good luck.
      </Text>

      <form onSubmit={submit}>

        <Flex
          mt={10}
          justifyContent={'center'}>
          <Button size={'lg'} colorScheme={'orange'} type={'submit'}>
            Start the test
          </Button>
        </Flex>
      </form>
    </Container>
  )
}

export default Home
