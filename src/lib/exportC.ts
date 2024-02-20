import { asciiArt, convertToBinary, numToHex } from './convertToBinary'
import { chunk } from './utils'

export function exportC(
  pixels: number[],
  title: string,
  width = 1,
  mode: '8x8' | '8x16' = '8x8',
): string {
  const tilesCount = pixels.length / 64
  const height = tilesCount / width

  const header =
    '/**\n * made with GBSprite\n *\n' +
    ` * mode: ${mode}\n` +
    ` * tiles: ${tilesCount}\n` +
    ' *\n' +
    asciiArt(pixels, width * 8)
      .map(r => ` * ${r}\n`)
      .join('') +
    ' */\n\n'

  const constants =
    `#define ${title}_size ${tilesCount}\n` +
    `#define ${title}_width ${width}\n` +
    `#define ${title}_height ${height}\n\n`

  // 1 tile (16 bytes) per line
  const data = chunk(convertToBinary(pixels, width, mode), 16)
    .map(
      tile =>
        '  ' +
        tile
          .map(numToHex)
          .map(h => `0x${h},`)
          .join(' '),
    )
    .join('\n')

  return (
    header + constants + `const unsigned char ${title}[] =\n{\n${data}\n};\n`
  )
}
