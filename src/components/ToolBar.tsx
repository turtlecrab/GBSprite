import { styled } from '@linaria/react'
import { LuRedo2, LuUndo2, LuZoomIn, LuZoomOut } from 'react-icons/lu'

import { useStore } from '../store/store'
import { tooltips } from '../tooltips'
import { IconButton } from './IconButton'

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
      <IconButton onClick={undo} disabled={!canUndo} tooltip={tooltips.undo}>
        <LuUndo2 />
      </IconButton>
      <IconButton onClick={redo} disabled={!canRedo} tooltip={tooltips.redo}>
        <LuRedo2 />
      </IconButton>
      <IconButton
        onClick={zoomIn}
        disabled={zoom >= zoomLevels.at(-1)!}
        tooltip={tooltips.zoomIn}
      >
        <LuZoomIn />
      </IconButton>
      <IconButton
        onClick={zoomOut}
        disabled={zoom <= zoomLevels[0]}
        tooltip={tooltips.zoomOut}
      >
        <LuZoomOut />
      </IconButton>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
`
