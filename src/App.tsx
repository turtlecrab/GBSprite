import { styled } from '@linaria/react'

import { Canvas } from './components/Canvas'
import { Debug } from './components/Debug'
import { Palette } from './components/Palette'
import { useHotkeys } from './hooks/useHotkeys'
import { useStore } from './store'

export default function App() {
  useHotkeys()

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
