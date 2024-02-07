import { styled } from '@linaria/react'

import { Canvas } from './components/Canvas'
import { Palette } from './components/Palette'
import { Tabs } from './components/Tabs'
import { ToolBar } from './components/ToolBar'
import { Tools } from './components/Tools'
import { useHotkeys } from './hooks/useHotkeys'

export default function App() {
  useHotkeys()

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
      <Tabs />
    </Main>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

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
