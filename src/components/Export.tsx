import { RadioGroup } from '@headlessui/react'
import { styled } from '@linaria/react'
import toast from 'react-hot-toast'

import { exportC, exportH } from '../lib/exportC'
import { useStore } from '../store/store'
import { Checkbox } from './Checkbox'

const DEFAULT_TITLE = 'awesome_sprite'

export function Export() {
  const isEvenHeight = useStore(state => state.height % 2 === 0)
  const scale = useStore(state => state.exportSettings.scale)
  const mode = useStore(state => state.exportSettings.mode)
  const title = useStore(state => state.exportSettings.title)
  const formatTab = useStore(state => state.exportSettings.formatTab)
  const withAsciiArtC = useStore(state => state.exportSettings.withAsciiArtC)
  const withAsciiArtH = useStore(state => state.exportSettings.withAsciiArtH)
  const withConstantsC = useStore(state => state.exportSettings.withConstantsC)
  const withConstantsH = useStore(state => state.exportSettings.withConstantsH)
  const showTileIndices = useStore(
    state => state.exportSettings.showTileIndices,
  )
  const setExportSettings = useStore(state => state.setExportSettings)

  // forbid 8x16 export for sprite with odd rows
  const adjustedMode = isEvenHeight ? mode : '8x8'

  const finalTitle = title || DEFAULT_TITLE

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error(err)
      toast.error(`Couldn't copy to the clipboard:\n\n${err}`)
    }
  }

  function downloadText(text: string, filename: string) {
    try {
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
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
      a.download = `${finalTitle}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    }
  }

  function getCSource() {
    return exportC(
      useStore.getState().pixels,
      finalTitle,
      useStore.getState().width,
      adjustedMode,
      useStore.getState().exportSettings.withAsciiArtC,
      useStore.getState().exportSettings.withConstantsC,
    )
  }

  function getHSource() {
    return exportH(
      useStore.getState().pixels,
      finalTitle,
      useStore.getState().width,
      adjustedMode,
      useStore.getState().exportSettings.withAsciiArtH,
      useStore.getState().exportSettings.withConstantsH,
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
      Title
      <br />
      <input
        type="text"
        placeholder={DEFAULT_TITLE}
        value={title}
        onChange={e => setExportSettings({ title: e.currentTarget.value })}
      />
      <br />
      <Radio
        value={formatTab}
        onChange={formatTab => setExportSettings({ formatTab })}
      >
        <RadioGroup.Option value="png" as="button">
          PNG image
        </RadioGroup.Option>
        <RadioGroup.Option value="c" as="button">
          GBDK C file
        </RadioGroup.Option>
      </Radio>
      {formatTab === 'png' && (
        <>
          <h2>PNG image</h2>
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
          <br />
          <div>
            <button onClick={copyPNG}>Copy to clipboard</button>
            <button onClick={downloadPNG}>Download</button>
          </div>
        </>
      )}
      {formatTab === 'c' && (
        <>
          <h2>GBDK C file</h2>
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
          <br />
          <Checkbox
            value={showTileIndices}
            setValue={v => setExportSettings({ showTileIndices: v })}
          >
            show tile indices
          </Checkbox>
          <h3>{finalTitle}.c</h3>
          <Checkbox
            value={withAsciiArtC}
            setValue={v => setExportSettings({ withAsciiArtC: v })}
          >
            include ascii art comment
          </Checkbox>
          <Checkbox
            value={withConstantsC}
            setValue={v => setExportSettings({ withConstantsC: v })}
          >
            include constants
          </Checkbox>
          <div>
            <button onClick={() => copyText(getCSource())}>
              Copy to clipboard
            </button>
            <button
              onClick={() => downloadText(getCSource(), `${finalTitle}.c`)}
            >
              Download
            </button>
          </div>
          <h3>{finalTitle}.h</h3>
          <Checkbox
            value={withAsciiArtH}
            setValue={v => setExportSettings({ withAsciiArtH: v })}
          >
            include ascii art comment
          </Checkbox>
          <Checkbox
            value={withConstantsH}
            setValue={v => setExportSettings({ withConstantsH: v })}
          >
            include constants
          </Checkbox>
          <div>
            <button onClick={() => copyText(getHSource())}>
              Copy to clipboard
            </button>
            <button
              onClick={() => downloadText(getHSource(), `${finalTitle}.h`)}
            >
              Download
            </button>
          </div>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-width: 240px;

  h3 {
    margin: 16px 0 8px;
  }
`

const Radio = styled(RadioGroup)`
  display: inline-flex;

  & > button {
    &[aria-checked='true'] {
      font-weight: bold;
    }
  }
`
