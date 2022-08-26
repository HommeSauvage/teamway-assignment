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
import { COOKIES_AUTH_TOKEN } from 'lib/constants'

type Props = {
  questionnaire: Questionnaire | null
}

const Home: FC<Props> = ({ questionnaire: providedQuestionnaire }) => {
  const [questionnaire, setQuestionnaire] = useState(providedQuestionnaire)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const [issues, setIssues] = useState<ZodIssue[] | undefined>()
  const userNameIssues = issues?.filter((i) => i.path.includes('userName'))

  // useCallback is not necessary in here as we have only one state we're changing
  // and not much to worry about. However, in a prod app with mission critical components
  // useMemo and useCallback will be very important
  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setIssues(undefined)
    setIsLoading(true)

    try {
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
  
        setIssues(response.data.body.validationError)
        return
      }
  
      if(response.data.body.isNew) {
        toast({
          status: 'success',
          title: 'All good!',
          description: `Your usrname is now saved and you will be able to continue the test just by providing your username.`
        })
      } else {
        toast({
          status: 'success',
          title: 'Welcome back!',
          description: response.data.body.completed ? `You've already completed the questionnaire` : `You've got some unfinished business here`
        })
      }
  
      Cookies.set(COOKIES_AUTH_TOKEN, response.data.body.authToken, {
        expires: 1
      })
      setIsCreated(true)
      router.push(`/submissions/${response.data.body.submissionId}`)
    } catch(e) {
      toast({
        status: 'error',
        title: 'Something went wrong',
        description: `${(e as Error).message || `Error code: ${response.data.body.code}`}`
      })
    } finally {
      setIsLoading(false)
    }
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

          <Button type={'submit'} isLoading={isLoading} disabled={isCreated}>
            Start the test
          </Button>
        </Grid>
      </form>
    </Container>
  )
}

export default Home
