import { Box, BoxProps } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

const Container: FC<PropsWithChildren<BoxProps>> = ({ children, ...props }) => {
  return (
    <Box
      margin={'auto'}
      maxW={728}
      px={12}
      {...props}>
        {children}
    </Box>
  )
}
export default Container
