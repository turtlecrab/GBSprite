import { useEffect } from 'react'

import { useStore } from '../store'

export function useHotkeys() {
  const setColor = useStore(state => state.setColor)
  const setTool = useStore(state => state.setTool)
  const setTempEyeDropper = useStore(state => state.setTempEyeDropper)
  const undo = useStore(state => state.undo)
  const redo = useStore(state => state.redo)
  const zoomIn = useStore(state => state.zoomIn)
  const zoomOut = useStore(state => state.zoomOut)

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
        case 'Equal': zoomIn(); break
        case 'Minus': zoomOut(); break
      }
      if (e.code === 'KeyZ' && e.ctrlKey && !e.shiftKey) {
        undo()
      }
      if (
        (e.code === 'KeyY' && e.ctrlKey) ||
        (e.code === 'KeyZ' && e.ctrlKey && e.shiftKey)
      ) {
        redo()
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.repeat && (e.altKey || e.ctrlKey)) {
        setTempEyeDropper(true)
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (!e.altKey && !e.ctrlKey) {
        setTempEyeDropper(false)
      }
    }
    function resetTempEyeDropper() {
      setTempEyeDropper(false)
    }
    document.addEventListener('keypress', handleKey)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', resetTempEyeDropper)
    return () => {
      document.removeEventListener('keypress', handleKey)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', resetTempEyeDropper)
    }
  }, [setColor, setTool, setTempEyeDropper, undo, redo, zoomIn, zoomOut])
}
