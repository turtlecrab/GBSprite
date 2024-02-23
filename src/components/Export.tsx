import { RadioGroup } from '@headlessui/react'
import { styled } from '@linaria/react'
import toast from 'react-hot-toast'

import { exportC } from '../lib/exportC'
import { useStore } from '../store/store'

const DEFAULT_TITLE = 'awesome_sprite'

export function Export() {
  const isEvenHeight = useStore(state => state.height % 2 === 0)
  const scale = useStore(state => state.exportSettings.scale)
  const mode = useStore(state => state.exportSettings.mode)
  const title = useStore(state => state.exportSettings.title)
  const setExportSettings = useStore(state => state.setExportSettings)

  // forbid 8x16 export for sprite with odd rows
  const adjustedMode = isEvenHeight ? mode : '8x8'

  async function copyC() {
    try {
      await navigator.clipboard.writeText(getCSource())
    } catch (err) {
      console.error(err)
      toast.error(`Couldn't copy to the clipboard:\n\n${err}`)
    }
  }

  function downloadC() {
    try {
      const blob = new Blob([getCSource()], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || DEFAULT_TITLE}.c`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    }
  }

  async function copyPNG() {
    try {
      const blob = await getPNGBlob()

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
    } catch (err) {
      console.error(err)
      toast.error(`Couldn't copy to the clipboard:\n\n${err}`)
    }
  }

  async function downloadPNG() {
    try {
      const blob = await getPNGBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || DEFAULT_TITLE}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    }
  }

  function getCSource() {
    return exportC(
      useStore.getState().pixels,
      title || DEFAULT_TITLE,
      useStore.getState().width,
      adjustedMode,
    )
  }

  function getPNGBlob() {
    return new Promise<Blob>((resolve, reject) => {
      const pixels = useStore.getState().pixels
      const pixelWidth =
        useStore.getState().width * useStore.getState().tileSize
      const pixelHeight =
        useStore.getState().height * useStore.getState().tileSize
      const palette = useStore.getState().palette

      // TODO: use OffscreenCanvas?
      const canvas = document.createElement('canvas')
      canvas.width = pixelWidth * scale
      canvas.height = pixelHeight * scale

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject("couldn't create canvas context")
        return
      }

      ctx.imageSmoothingEnabled = false

      for (let y = 0; y < pixelHeight; y++) {
        for (let x = 0; x < pixelWidth; x++) {
          const color = pixels[y * pixelWidth + x]
          ctx.fillStyle = palette[color]
          ctx.fillRect(x * scale, y * scale, scale, scale)
        }
      }

      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject('blob is null')
      }, 'image/png')
    })
  }

  return (
    <Container>
      <br />
      Title:{' '}
      <input
        type="text"
        placeholder={DEFAULT_TITLE}
        value={title}
        onChange={e => setExportSettings({ title: e.currentTarget.value })}
      />
      <ExportOptions>
        <li>
          GBDK C file
          <div>
            Mode:{' '}
            <Radio
              value={adjustedMode}
              onChange={mode => setExportSettings({ mode })}
            >
              <RadioGroup.Option value="8x8" as="button">
                8x8
              </RadioGroup.Option>
              {isEvenHeight && (
                <RadioGroup.Option value="8x16" as="button">
                  8x16
                </RadioGroup.Option>
              )}
            </Radio>
          </div>
          <div>
            <button onClick={copyC}>Copy to clipboard</button>
            <button onClick={downloadC}>Download .c file</button>
          </div>
        </li>
        <li>
          PNG image
          <div>
            Scale:{' '}
            <Radio
              value={scale}
              onChange={scale => setExportSettings({ scale })}
            >
              <RadioGroup.Option value={1} as="button">
                1
              </RadioGroup.Option>
              <RadioGroup.Option value={2} as="button">
                2
              </RadioGroup.Option>
              <RadioGroup.Option value={4} as="button">
                4
              </RadioGroup.Option>
              <RadioGroup.Option value={8} as="button">
                8
              </RadioGroup.Option>
            </Radio>
          </div>
          <div>
            <button onClick={copyPNG}>Copy to clipboard</button>
            <button onClick={downloadPNG}>Download .png file</button>
          </div>
        </li>
      </ExportOptions>
    </Container>
  )
}

const Container = styled.div``

const ExportOptions = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Radio = styled(RadioGroup)`
  display: inline-flex;

  & > button {
    &[aria-checked='true'] {
      font-weight: bold;
    }
  }
`
