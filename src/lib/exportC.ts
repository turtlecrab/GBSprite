import { asciiArt, convertToBinary, numToHex } from './convertToBinary'

export function exportC(pixels: number[], title: string): string {
  const hex = convertToBinary(pixels)
    .map(numToHex)
    .map(h => `0x${h},`)
    .join(' ')

  const header =
    '/**\n * made with GBSprite\n *\n' +
    asciiArt(pixels)
      .map(r => ` * ${r}\n`)
      .join('') +
    ' */\n\n'

  return header + `const unsigned char ${title}[] =\n{\n  ${hex}\n};\n`
}
