/* global describe it */
/* eslint-disable no-unused-expressions */

const path = require('path')
const { expect } = require('chai')
const ls = require('../src/ls')
const serialize = require('../src/serialize')

const TEST_PATH = path.join(__dirname, 'root')
const TEST_STRUCTURE_STRING =
`ROOT=root
-file_0_a
+level1a
 -file_1a_a
 -file_1a_b
 -file_1a_c
 +level2a
  -file_2a_a
  -file_2a_b
 +level2b
  -file_2b_a
  -file_2b_b
  +level3
   -file_3_a
+level1b
 -file_1b_a
`

const OPTIONS = {
  levelInd: ' ',
  dirInd: '+',
  fileInd: '-'
}

describe('serialize()', () => {
  it('stringifies a Directory', () => {
    const dir = ls(TEST_PATH)
    const dirString = serialize(dir, OPTIONS)
    expect(dirString).to.equal(TEST_STRUCTURE_STRING)
  })

  it('stringifies a directory path', () => {
    const dirString = serialize(TEST_PATH, OPTIONS)
    expect(dirString).to.equal(TEST_STRUCTURE_STRING)
  })
})
