import { Box, Center, Text } from '@chakra-ui/react'
import Head from 'next/head'
import type { FC, PropsWithChildren } from 'react'

type Props = {
  title: string
  description?: string
}

const Page: FC<PropsWithChildren<Props>> = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta key={'description'} content={description} />
      </Head>

      <Box>
        <Center 
          pt={20} 
          pb={25}>
            <Text
              fontSize={{
                base: 28,
                md: 30,
                lg: 42,
              }}
              fontWeight={'bold'}>
              Teamway Assignment
            </Text>
        </Center>
        {children}
      </Box>
    </>
  )
}

export default Page