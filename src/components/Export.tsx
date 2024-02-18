import { RadioGroup } from '@headlessui/react'
import { styled } from '@linaria/react'
import { useState } from 'react'

import { exportC } from '../lib/exportC'
import { useStore } from '../store/store'

export function Export() {
  const [scale, setScale] = useState(1)

  async function copyC() {
    const pixels = useStore.getState().pixels
    const out = exportC(pixels, 'awesome_sprite')
    try {
      await navigator.clipboard.writeText(out)
      console.log('copied to clipboard')
    } catch {
      console.error("couldn't copy to clipboard")
    }
  }

  function downloadC() {
    console.log('not implemented')
  }

  async function copyPNG() {
    try {
      const blob = await getPNGBlob()

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
    } catch (err) {
      console.log(err)
    }
  }

  async function downloadPNG() {
    try {
      const blob = await getPNGBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'awesome_sprite.png'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.log(err)
    }
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
      <li>
        GBDK C file
        <br />
        <Button onClick={copyC}>Copy to clipboard</Button>
        <Button onClick={downloadC}>Download c file</Button>
        <br />
        <br />
      </li>
      <li>
        PNG image
        <br />
        Scale:{' '}
        <Scale value={scale} onChange={setScale}>
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
        </Scale>
        <br />
        <Button onClick={copyPNG}>Copy to clipboard</Button>
        <Button onClick={downloadPNG}>Download .png file</Button>
      </li>
    </Container>
  )
}

const Container = styled.ul`
  //
`

const Button = styled.button`
  //
`

const Scale = styled(RadioGroup)`
  display: inline-flex;

  & > button {
    &[aria-checked='true'] {
      font-weight: bold;
    }
  }
`
