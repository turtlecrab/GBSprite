import { styled } from '@linaria/react'

import { Canvas } from './components/Canvas'
import { Debug } from './components/Debug'
import { Export } from './components/Export'
import { Palette } from './components/Palette'
import { Preview } from './components/Preview'
import { Settings } from './components/Settings'
import { ToolBar } from './components/ToolBar'
import { Tools } from './components/Tools'
import { useHotkeys } from './hooks/useHotkeys'
import { useStore } from './store'

export default function App() {
  useHotkeys()

  const clearPixels = useStore(state => state.clearPixels)

  return (
    <Main>
      <Top>
        <Header>GBSprite</Header>
        <ToolBar />
      </Top>
      <Group>
        <Palette />
        <CanvasWrapper>
          <Canvas />
        </CanvasWrapper>
        <Tools />
      </Group>
      <ClearButton onClick={clearPixels}>Clear</ClearButton>
      <Export />
      <Settings />
      <Preview />
      <Debug />
    </Main>
  )
}

const Main = styled.main``

const Header = styled.h1`
  margin: 12px 0;
  padding: 0;
  color: #212529;
`

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin: 0 0 8px;
`

const CanvasWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Group = styled.div`
  display: flex;
  gap: 8px;
`

const ClearButton = styled.button``
