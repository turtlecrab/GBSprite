import { styled } from '@linaria/react'

import { clamp } from '../lib/utils'

interface Props {
  min: number
  max: number
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
}

export function NumberInput({ min, max, value, setValue }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget.value
    if (input === '') {
      setValue(min)
    } else if (/^\d+$/.test(input)) {
      setValue(clamp(min, max, Number(input)))
    }
  }
  function inc() {
    if (value < max) setValue(value + 1)
  }
  function dec() {
    if (value > min) setValue(value - 1)
  }

  return (
    <Container>
      <button onClick={dec} disabled={value <= 1}>
        -
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onKeyDown={e => e.stopPropagation()}
      />
      <button onClick={inc} disabled={value >= max}>
        +
      </button>
    </Container>
  )
}

const Container = styled.div`
  button {
    font-size: 1rem;
    width: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  input {
    font-size: 1rem;
    width: 2rem;
  }
`
