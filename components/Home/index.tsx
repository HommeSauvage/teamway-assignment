import { Box, Button, FormControl, FormErrorMessage, FormHelperText, Grid, Input, Text, useToast } from '@chakra-ui/react'
import type { Questionnaire } from 'frontend-types'
import type { Response } from 'api-functions/submissions/create'
import Container from 'components/basic/Container'
import { config } from 'config'
import Cookies from 'js-cookie'
import { enhancedFetch } from 'lib/fetch'
import { useRouter } from 'next/router'
import { FC, FormEventHandler, useState } from 'react'
import { ZodIssue } from 'zod'

type Props = {
  questionnaire: Questionnaire | null
}

const Home: FC<Props> = ({ questionnaire: providedQuestionnaire }) => {
  const [questionnaire, setQuestionnaire] = useState(providedQuestionnaire)
  const [userName, setUserName] = useState('')
  const toast = useToast()
  const router = useRouter()
  const [issues, setIssues] = useState<ZodIssue[] | undefined>()
  const userNameIssues = issues?.filter((i) => i.path.includes('userName'))
  console.log('issues', issues)
  console.log('userNameIssues', userNameIssues)

  // useCallback is not necessary in here as we have only one state we're changing
  // and not much to worry about. However, in a prod app with mission critical components
  // useMemo and useCallback will be very important
  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setIssues(undefined)

    if(!questionnaire) {
      return
    }

    const response = await enhancedFetch<Response>(`${config.apiUrl}/submissions`, {
      method: 'POST',
      body: JSON.stringify({
        userName,
        questionnaireId: questionnaire.id
      })
    })

    if(response.err) {
      toast({
        status: 'error',
        title: 'Something went wrong',
        description: `${response.data.body.message || `Error code: ${response.data.body.code}`}`
      })
      console.log('response.data.body.validationError??', response.data.body)
      setIssues(response.data.body.validationError)
      return
    }

    if(response.data.body.isNew) {
      toast({
        status: 'success',
        title: 'All good!',
        description: `Your usrname is now saved and you will be able to continue the test just by providing your username.`
      })
    }

    toast({
      status: 'success',
      title: 'Welcom back!',
      description: `You've got some unfinished business here`
    })

    Cookies.set('auth', response.data.body.authToken, {
      expires: 1
    })
    
    router.push(`/submissions/${response.data.body.submissionId}?step=${response.data.body.step}`)
  }

  const seed = async () => {
    const response = await enhancedFetch<Questionnaire>(`${config.apiUrl}/questionnaires`, {
      method: 'POST',
      body: JSON.stringify({})
    })

    if(response.err) {
      toast({
        status: 'error',
        title: 'Something went wrong',
        description: `${response.data.body.message || `Error code: ${response.data.body.code}`}`
      })
      return
    } 

    toast({
      status: 'success',
      title: 'Questionnaire seeded!',
    })

    setQuestionnaire(response.data.body)
  }

  if(!questionnaire) {
    return (
      <Container>
        <Text>
          Hello there. It seems that there are no questionnaires. 
          Here&apos;s a question for you: Did you forget to seed the DB?.
        </Text>
        <Button mt={10} onClick={seed}>
          Seed the questionnaire
        </Button>
      </Container>
    )
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
        <Grid
          mt={10}
          justifyContent={'center'}
          gap={2}>

          <Box>
            <FormControl isInvalid={!!userNameIssues?.length}>
              <Input
                w={300}
                value={userName} 
                placeholder={'Enter your existing/new username'}
                onChange={(e) => setUserName(e.target.value)} />
                {userNameIssues?.map((i) => (
                <FormErrorMessage color={'red'} key={i.code}>
                  {i.message}
                </FormErrorMessage>
              ))}
            </FormControl>
            
          </Box>

          <Button type={'submit'}>
            Start the test
          </Button>
        </Grid>
      </form>
    </Container>
  )
}

export default Home
