import { styled } from '@linaria/react'

import { Canvas } from './components/Canvas'
import { Debug } from './components/Debug'
import { Palette } from './components/Palette'
import { Tools } from './components/Tools'
import { useHotkeys } from './hooks/useHotkeys'
import { useStore } from './store'

export default function App() {
  useHotkeys()

  const clearPixels = useStore(state => state.clearPixels)

  return (
    <Main>
      <Header>GBSprite</Header>
      <Top>
        <Palette />
        <Tools />
      </Top>
      <Canvas />
      <ClearButton onClick={clearPixels}>Clear</ClearButton>
      <Debug />
    </Main>
  )
}

const Main = styled.main``

const Header = styled.h1`
  margin: 0 0 16px;
  padding: 0;
  color: #212529;
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 8px;
`

const ClearButton = styled.button``
