import { styled } from '@linaria/react'
import { useState } from 'react'

import { useStore } from '../store/store'
import { Checkbox } from './Checkbox'
import { NumberInput } from './NumberInput'

export function Settings() {
  const width = useStore(state => state.width)
  const height = useStore(state => state.height)

  const [cols, setCols] = useState(width)
  const [rows, setRows] = useState(height)

  const setSize = useStore(state => state.setSize)

  function handleResize() {
    setSize(cols, rows)
  }

  function handleCancel() {
    setCols(width)
    setRows(height)
  }

  const gridVisible = useStore(state => state.gridVisible)
  const tooltipsVisible = useStore(state => state.tooltipsVisible)
  const setGridVisible = useStore(state => state.setGridVisible)
  const setTooltipsVisible = useStore(state => state.setTooltipsVisible)
  const fillCanvas = useStore(state => state.fillCanvas)

  return (
    <Container>
      <h2>Settings</h2>
      <Checkbox value={tooltipsVisible} setValue={setTooltipsVisible}>
        Show tooltips
      </Checkbox>
      <Checkbox value={gridVisible} setValue={setGridVisible}>
        Show tile grid
      </Checkbox>
      <Group>
        <NumberInput min={1} max={20} value={cols} setValue={setCols} /> Columns
      </Group>
      <Group>
        <NumberInput min={1} max={18} value={rows} setValue={setRows} /> Rows
      </Group>
      <Group>
        <button
          disabled={cols === width && rows === height}
          onClick={handleResize}
        >
          Resize
        </button>
        <button
          disabled={cols === width && rows === height}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </Group>
      <button onClick={() => fillCanvas(0)}>Clear canvas</button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Group = styled.div`
  display: flex;
  gap: 8px;
`
