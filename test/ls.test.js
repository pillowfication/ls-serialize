const path = require('path');
const {expect} = require('chai');

const ls = require('../src/ls');
const {File, Directory} = require('../src/structures');

const TEST_PATH = path.join(__dirname, 'root');
const TEST_STRUCTURE = new Directory('root', true)
  .addFile(new Directory('level1a')
    .addFile(new Directory('level2a')
      .addFile(new File('file_2a_a'))
      .addFile(new File('file_2a_b')))
    .addFile(new Directory('level2b')
      .addFile(new Directory('level3')
        .addFile(new File('file_3_a')))
      .addFile(new File('file_2b_a'))
      .addFile(new File('file_2b_b')))
    .addFile(new File('file_1a_a'))
    .addFile(new File('file_1a_b'))
    .addFile(new File('file_1a_c')))
  .addFile(new Directory('level1b')
    .addFile(new File('file_1b_a')))
  .addFile(new File('file_0_a'));

function dirDeepEquals(dirA, dirB) {
  if (dirA instanceof File) {
    expect(dirB).to.be.instanceof(File, dirA.path);
    expect(dirA.path).to.equal(dirB.path);
  }

  else if (dirA instanceof Directory) {
    expect(dirB).to.be.instanceof(Directory, dirA.path);
    expect(dirA.path).to.equal(dirB.path);
    for (const fileName of dirA.fileNames) {
      dirDeepEquals(dirA.get(fileName), dirB.get(fileName));
    }
  }
}

describe('ls()', () => {
  it('recursively lists the directory', () => {
    const dir = ls(TEST_PATH);
    dirDeepEquals(dir, TEST_STRUCTURE);
  });
});
