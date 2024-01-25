import { styled } from '@linaria/react'

import { useStore } from '../store'

export function Debug() {
  const dragging = useStore(state => state.dragging)

  return (
    <List>
      <li>Dragging : {String(dragging)}</li>
    </List>
  )
}

const List = styled.div`
  list-style: none;
  margin-top: 32px;
`
