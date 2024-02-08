import { styled } from '@linaria/react'
import { ReactNode } from 'react'

interface Props {
  value: boolean
  setValue: (v: boolean) => void
  children?: ReactNode
}

export function Checkbox({ value, setValue, children }: Props) {
  return (
    <Label>
      <input
        type="checkbox"
        checked={value}
        onChange={e => setValue(e.currentTarget.checked)}
      />
      {children}
    </Label>
  )
}

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 1rem;

  & > input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
  }
`
