import { Flex, FlexProps } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

type Props = FlexProps

const Container: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  return (
    <Flex
      minW={400}
      minH={300}
      justify={'center'}>
      {children}
    </Flex>
  )
}

export default Container
