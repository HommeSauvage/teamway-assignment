import { Box, Grid, RadioProps, useRadio } from '@chakra-ui/react'
import type { FC, PropsWithChildren, ReactNode } from 'react'

type Props = RadioProps & {
  description: ReactNode
}

const RadioLine: FC<PropsWithChildren<Props>> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Grid
      borderWidth={'1px'}
      borderRadius={'md'}
      borderColor={props.isChecked ? 'orange.600' : undefined}
      cursor={'pointer'}
      py={'2'}
      px={'3'}
      as='label'
      gridColumnGap={'2'}
      gridTemplateColumns={'min-content 1fr'}
      alignItems={'center'}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderEndRadius={'md'}
        px={'3'}
        py={'1'}
        transition={'all .2s ease-in-out'}
        _checked={{
          bg: 'orange.600',
          color: 'white',
          borderColor: 'orange.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        borderRadius={'md'}>
        {props.title || '•'}
      </Box>
      <Box>
        {props.description}
      </Box>
    </Grid>
  )
}

export default RadioLine