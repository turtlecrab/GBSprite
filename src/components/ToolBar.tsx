import { styled } from '@linaria/react'
import { LuRedo2, LuUndo2, LuZoomIn, LuZoomOut } from 'react-icons/lu'

import { useStore } from '../store/store'

export function ToolBar() {
  const undo = useStore(state => state.undo)
  const redo = useStore(state => state.redo)
  const canUndo = useStore(state => state.history.length > 0)
  const canRedo = useStore(state => state.redoHistory.length > 0)

  const zoom = useStore(state => state.zoom)
  const zoomLevels = useStore(state => state.zoomLevels)
  const zoomIn = useStore(state => state.zoomIn)
  const zoomOut = useStore(state => state.zoomOut)

  return (
    <Container>
      <Button onClick={undo} disabled={!canUndo}>
        <LuUndo2 size="100%" />
      </Button>
      <Button onClick={redo} disabled={!canRedo}>
        <LuRedo2 size="100%" />
      </Button>
      <Button onClick={zoomIn} disabled={zoom >= zoomLevels.at(-1)!}>
        <LuZoomIn size="100%" />
      </Button>
      <Button onClick={zoomOut} disabled={zoom <= zoomLevels[0]}>
        <LuZoomOut size="100%" />
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
`

const Button = styled.button`
  cursor: pointer;
  background-color: white;
  width: 40px;
  height: 40px;
  border: 1px solid lavender;
  border-radius: 4px;
  box-shadow: 2px 2px 0px lavender;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;

  &:disabled {
    cursor: not-allowed;
    color: lavender;
  }
`
