import { styled } from '@linaria/react'

import { Canvas } from './components/Canvas'
import { Palette } from './components/Palette'
import { useStore } from './store'

export default function App() {
  const clearPixels = useStore(state => state.clearPixels)

  return (
    <Main>
      <h1>GBDK pixel editor</h1>
      <Palette />
      <Canvas />
      <ClearButton onClick={clearPixels}>Clear</ClearButton>
    </Main>
  )
}

const Main = styled.main`
  margin-inline: auto;
`

const ClearButton = styled.button``
