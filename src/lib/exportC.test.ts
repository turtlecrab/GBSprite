import { describe, expect, it } from 'vitest'

import { exportC } from './exportC'

/**
 * ████████████████
 * ██▒▒░░░░▒▒░░░░██
 * ▒▒░░▓▓▓▓░░▓▓▓▓░░
 * ▒▒░░▓▓▓▓▓▓▓▓▓▓░░
 * ▒▒░░▓▓▓▓▓▓▓▓▓▓░░
 * ██▒▒░░▓▓▓▓▓▓░░██
 * ████▒▒░░▓▓░░████
 * ██████▒▒░░██████
 */
const heart = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 3, 3, 0, 2, 3, 1, 1, 3, 1, 1, 3, 2, 3,
  1, 1, 1, 1, 1, 3, 2, 3, 1, 1, 1, 1, 1, 3, 0, 2, 3, 1, 1, 1, 3, 0, 0, 0, 2, 3,
  1, 3, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0,
]

describe('exportC', () => {
  const result = exportC(heart, 'heart')

  it('contains char array', () => {
    expect(result).toMatch(/const unsigned char heart\[\] =\n\{\n[\s\S]*\n\};/)
  })
  it('contains constants', () => {
    expect(result).toMatch(/#define heart_size 1/)
    expect(result).toMatch(/#define heart_width 1/)
    expect(result).toMatch(/#define heart_height 1/)
  })
  it('contains proper data', () => {
    const data = result
      .match(/const unsigned char heart\[\] =\n\{\n([\s\S]*)\n\};/)?.[1]
      .replace(/\s/g, '')
      .split(',')
      .filter(el => el !== '')
    // prettier-ignore
    expect(data).toEqual([
      '0x00', '0x00', '0x36', '0x7e', '0x7f', '0xc9', '0x7f', '0xc1',
      '0x7f', '0xc1', '0x3e', '0x62', '0x1c', '0x34', '0x08', '0x18',
    ])
  })
})
