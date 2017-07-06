/* global describe it */
/* eslint-disable no-unused-expressions */

const path = require('path')
const { expect } = require('chai')
const ls = require('../src/ls')
const deserialize = require('../src/deserialize')
const { File, Directory } = require('../src/structures')

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

function dirDeepEquals (dirA, dirB) {
  if (dirA instanceof File) {
    expect(dirB).to.be.instanceof(File, dirA.path)
    expect(dirA.path).to.equal(dirB.path)
  } else if (dirA instanceof Directory) {
    expect(dirB).to.be.instanceof(Directory, dirA.path)
    expect(dirA.name).to.equal(dirB.name)
    expect(dirA.path).to.equal(dirB.path)
    for (const fileName of dirA.fileNames) {
      dirDeepEquals(dirA.get(fileName), dirB.get(fileName))
    }
  }
}

describe('deserialize()', () => {
  it('parses a String', () => {
    const dir = ls(TEST_PATH)
    const parsed = deserialize(TEST_STRUCTURE_STRING, OPTIONS)
    dirDeepEquals(dir, parsed)
  })
})
