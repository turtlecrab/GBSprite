import { styled } from '@linaria/react'
import { LuPaintBucket, LuPencil, LuUndo2 } from 'react-icons/lu'

import { Tool, useStore } from '../store'

const icons = {
  pencil: LuPencil,
  bucket: LuPaintBucket,
}

export function Tools() {
  const tool = useStore(state => state.tool)
  const setTool = useStore(state => state.setTool)
  const undo = useStore(state => state.undo)

  return (
    <Container>
      {['pencil', 'bucket'].map(t => (
        <ToolButton
          $selected={tool === t}
          onClick={() => setTool(t as Tool)}
          aria-label={t}
          key={t}
        >
          <Icon tool={t as Tool} />
        </ToolButton>
      ))}
      <ToolButton $selected={false} onClick={undo}>
        <LuUndo2 size="100%" />
      </ToolButton>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  gap: 4px;
`

function Icon({ tool }: { tool: Tool }) {
  if (!(tool in icons)) {
    console.error('bad icon name')
    return <>😦</>
  }
  const Comp = icons[tool]
  return <Comp size="100%" />
}

const ToolButton = styled.button<{ $selected: boolean }>`
  cursor: pointer;
  background-color: ${p => (p.$selected ? 'orange' : 'white')};
  width: 32px;
  height: 32px;
  border: 1px solid lavender;
  border-radius: 4px;
  box-shadow: 2px 2px 0px lavender;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
`
