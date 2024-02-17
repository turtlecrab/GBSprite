import { styled } from '@linaria/react'
import {
  LuCircle,
  LuPaintBucket,
  LuPencil,
  LuRectangleHorizontal,
} from 'react-icons/lu'

import { Tool, useStore } from '../store/store'

const icons = {
  pencil: LuPencil,
  bucket: LuPaintBucket,
  rect: LuRectangleHorizontal,
  ellipse: LuCircle,
}

const tools: Tool[] = ['pencil', 'bucket', 'rect', 'ellipse']

export function Tools() {
  const tool = useStore(state => state.tool)
  const setTool = useStore(state => state.setTool)

  return (
    <Container>
      {tools.map(t => (
        <ToolButton
          $selected={tool === t}
          onClick={() => setTool(t as Tool)}
          aria-label={t}
          key={t}
        >
          <Icon tool={t as Tool} />
        </ToolButton>
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

  &:disabled {
    cursor: not-allowed;
    color: lavender;
  }
`
