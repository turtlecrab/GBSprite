import { useEffect } from 'react'
import { useStore } from '../store'

export function useHotkeys() {
  const setColor = useStore(state => state.setColor)
  const setTool = useStore(state => state.setTool)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // prettier-ignore
      switch (e.code) {
        case 'Digit1': setColor(0); break
        case 'Digit2': setColor(1); break
        case 'Digit3': setColor(2); break
        case 'Digit4': setColor(3); break
        case 'KeyB': setTool('pencil'); break
        case 'KeyG': setTool('bucket'); break
      }
    }
    document.addEventListener('keypress', handleKey)
    return () => {
      document.removeEventListener('keypress', handleKey)
    }
  }, [setColor, setTool])
}
