import { styled } from '@linaria/react'

export const IconButton = styled.button`
  cursor: pointer;
  color: inherit;
  background-color: white;
  width: 40px;
  height: 40px;
  border: 1px solid lavender;
  border-radius: 4px;
  box-shadow: 2px 2px 0px lavender;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;

  &:disabled {
    cursor: default;
    color: lavender;
  }

  & > svg {
    width: 100%;
    height: 100%;
  }
`
