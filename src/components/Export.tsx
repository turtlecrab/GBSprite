import { styled } from '@linaria/react'

import { exportC } from '../lib/exportC'
import { useStore } from '../store'

export function Export() {
  async function copy() {
    const pixels = useStore.getState().pixels
    const out = exportC(pixels, 'awesome_sprite')
    try {
      await navigator.clipboard.writeText(out)
      console.log('copied to clipboard')
    } catch {
      console.error("couldn't copy to clipboard")
    }
  }
  function download() {
    console.log('not implemented')
  }

  return (
    <Container>
      GBDK C file
      <br />
      <Button onClick={copy}>Copy to clipboard</Button>
      <Button onClick={download}>Download c file</Button>
    </Container>
  )
}

const Container = styled.div`
  //
`

const Button = styled.button`
  //
`
