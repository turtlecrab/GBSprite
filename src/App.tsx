import { styled } from '@linaria/react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

import { Canvas } from './components/Canvas'
import { Palette } from './components/Palette'
import { Tabs } from './components/Tabs'
import { ToolBar } from './components/ToolBar'
import { Tools } from './components/Tools'
import { useHotkeys } from './hooks/useHotkeys'
import { useStore } from './store/store'

export default function App() {
  useHotkeys()

  const tooltipsVisible = useStore(state => state.tooltipsVisible)

  useEffect(() => {
    if (!tooltipsVisible) {
      document.body.classList.add('no-tooltips')
    } else {
      document.body.classList.remove('no-tooltips')
    }
    return () => {
      document.body.classList.remove('no-tooltips')
    }
  }, [tooltipsVisible])

  return (
    <Main>
      <Top>
        <Header>GBSprite</Header>
        <ToolBar />
        <Tools />
      </Top>
      <Group>
        <Palette />
        <Canvas />
        <Tabs />
      </Group>
      <Toaster />
    </Main>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
  row-gap: 0;
  margin: 0 0 8px 12px;
`

const Header = styled.h1`
  margin: 8px 0;
  padding: 0;
`

const Group = styled.div`
  flex: 1;
  display: flex;
`
