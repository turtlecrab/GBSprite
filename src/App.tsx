import { styled } from '@linaria/react'

import { Canvas } from './components/Canvas'
import { Palette } from './components/Palette'
import { useStore } from './store'
import { Debug } from './components/Debug'

export default function App() {
  const clearPixels = useStore(state => state.clearPixels)

  return (
    <Main>
      <h1>GBDK pixel editor</h1>
      <Palette />
      <Canvas />
      <ClearButton onClick={clearPixels}>Clear</ClearButton>
      <Debug />
    </Main>
  )
}

const Main = styled.main`
  margin-inline: auto;
`

const ClearButton = styled.button``
