import { useEffect } from 'react'

import { useStore } from '../store/store'

export function useHotkeys() {
  const setColor = useStore(state => state.setColor)
  const setTool = useStore(state => state.setTool)
  const setAltPressed = useStore(state => state.setAltPressed)
  const setShiftPressed = useStore(state => state.setShiftPressed)
  const setCtrlPressed = useStore(state => state.setCtrlPressed)
  const undo = useStore(state => state.undo)
  const redo = useStore(state => state.redo)
  const zoomIn = useStore(state => state.zoomIn)
  const zoomOut = useStore(state => state.zoomOut)
  const toggleGridVisible = useStore(state => state.toggleGridVisible)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
        // prettier-ignore
        switch (e.code) {
          case 'Digit1': setColor(0); break
          case 'Digit2': setColor(1); break
          case 'Digit3': setColor(2); break
          case 'Digit4': setColor(3); break
          case 'KeyB': setTool('pencil'); break
          case 'KeyG': setTool('bucket'); break
          case 'KeyU': setTool('rect'); break
          case 'KeyH': setTool('hand'); break
          case 'Equal': zoomIn(); break
          case 'Minus': zoomOut(); break
        }
      }

      // Shift+U
      if (e.code === 'KeyU' && e.shiftKey) setTool('ellipse')

      // Ctrl+Z
      if (e.code === 'KeyZ' && e.ctrlKey && !e.shiftKey) undo()

      // Ctrl+Y || Ctrl+Shift+Z
      if (
        (e.code === 'KeyY' && e.ctrlKey) ||
        (e.code === 'KeyZ' && e.ctrlKey && e.shiftKey)
      )
        redo()

      // Ctrl+'
      if (e.code === 'Quote' && e.ctrlKey) toggleGridVisible()

      // Alt
      if (!e.repeat && (e.code === 'AltLeft' || e.code === 'AltRight')) {
        setAltPressed(true)
        e.preventDefault()
      }
      // Shift
      if (!e.repeat && (e.code === 'ShiftLeft' || e.code === 'ShiftRight')) {
        setShiftPressed(true)
      }
      // Ctrl
      if (
        !e.repeat &&
        (e.code === 'ControlLeft' || e.code === 'ControlRight')
      ) {
        setCtrlPressed(true)
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (!e.altKey) setAltPressed(false)
      if (!e.shiftKey) setShiftPressed(false)
      if (!e.ctrlKey) setCtrlPressed(false)
    }

    function handleWindowBlur() {
      setAltPressed(false)
      setShiftPressed(false)
      setCtrlPressed(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [
    setColor,
    setTool,
    undo,
    redo,
    zoomIn,
    zoomOut,
    toggleGridVisible,
    setAltPressed,
    setShiftPressed,
    setCtrlPressed,
  ])
}
