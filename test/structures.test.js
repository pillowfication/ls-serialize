/* global describe it */
/* eslint-disable no-unused-expressions */

const path = require('path')
const { expect } = require('chai')
const { File, Directory } = require('../src/structures')

describe('File', () => {
  it('has `path.parse()` properties', () => {
    const file = new File('name.ext')

    expect(file.root).to.equal('')
    expect(file.dir).to.equal('')
    expect(file.base).to.equal('name.ext')
    expect(file.ext).to.equal('.ext')
    expect(file.name).to.equal('name')
  })

  it('`path` and `dir` follow from parents', () => {
    const file = new File('name.ext')
    const parent = new Directory('p')
    const gParent = new Directory('gp')
    const ggParent = new Directory('ggp')
    ggParent.addFile(gParent.addFile(parent.addFile(file)))

    expect(file.path).to.equal(path.join('ggp', 'gp', 'p', file.base))
    expect(file.dir).to.equal(path.join('ggp', 'gp', 'p'))
  })

  it('`root` exists when a parent with `isRoot === true` exists', () => {
    const file = new File('name.ext')
    const parent = new Directory('p')
    const gParent = new Directory('gp')
    const rootParent = new Directory('rp', true)
    parent.addFile(file)

    gParent.addFile(parent)
    expect(file.root).to.equal('')

    rootParent.addFile(parent)
    expect(file.root).to.equal(path.sep)
  })

  it('has a `parent` when added with `<Directory>.addFile()`', () => {
    const file = new File('name.ext')
    const parent = new Directory('p')

    expect(file.parent).to.be.null

    parent.addFile(file)
    expect(file.parent).to.not.be.null
  })
})

describe('Directory', () => {
  it('has `path.parse()` properties', () => {
    const dir = new Directory('name.ext')

    expect(dir.root).to.equal('')
    expect(dir.dir).to.equal('')
    expect(dir.base).to.equal('name.ext')
    expect(dir.ext).to.equal('.ext')
    expect(dir.name).to.equal('name')
  })

  it('`path` and `dir` follow from parents', () => {
    const dir = new Directory('name.ext')
    const parent = new Directory('p')
    const gParent = new Directory('gp')
    const ggParent = new Directory('ggp')
    ggParent.addFile(gParent.addFile(parent.addFile(dir)))

    expect(dir.path).to.equal(path.join('ggp', 'gp', 'p', dir.base))
    expect(dir.dir).to.equal(path.join('ggp', 'gp', 'p'))
  })

  it('`root` exists when a parent with `isRoot === true` exists', () => {
    const dir = new Directory('name.ext')
    const parent = new Directory('p')
    const gParent = new Directory('gp')
    const rootParent = new Directory('rp', true)
    parent.addFile(dir)

    gParent.addFile(parent)
    expect(dir.root).to.equal('')

    rootParent.addFile(parent)
    expect(dir.root).to.equal(path.sep)
  })

  it('has a `parent` when added with `<Directory>.addFile()`', () => {
    const dir = new Directory('name.ext')
    const parent = new Directory('p')

    expect(dir.parent).to.be.null

    parent.addFile(dir)
    expect(dir.parent).to.equal(parent)
  })

  describe('.addFile()', () => {
    it('only accepts File and Directory types', () => {
      const dir = new Directory('dir')

      expect(() => dir.addFile(new File('file'))).to.not.throw()
      expect(() => dir.addFile(new Directory('directory'))).to.not.throw()

      expect(() => dir.addFile('foobar')).to.throw()
      expect(() => dir.addFile({ foo: 'bar' })).to.throw()
    })

    it('sets the `parent` of added file to itself', () => {
      const dir = new Directory('dir')
      const subFile = new File('subFile')
      const subDir = new Directory('subDir')
      dir.addFile(subFile)
      dir.addFile(subDir)

      expect(subFile.parent).to.equal(dir)
      expect(subDir.parent).to.equal(dir)
    })

    it('doesn\'t allow duplicate filenames', () => {
      const dir = new Directory('dir')
      const subFile = new File('foo')
      dir.addFile(subFile)

      expect(() => dir.addFile(subFile)).to.throw()
      expect(() => dir.addFile(new File('foo'))).to.throw()
      expect(() => dir.addFile(new Directory('foo'))).to.throw()
    })
  })

  describe('.removeFile()', () => {
    it('removes the file', () => {
      const dir = new Directory('dir')
      const file = new File('file')
      dir.addFile(file)
      expect(dir.has(file)).to.be.true

      dir.removeFile(file)
      expect(dir.has(file)).to.be.false
    })

    it('sets the `parent` of the removed file to `null`', () => {
      const dir = new Directory('dir')
      const file = new File('file')
      dir.addFile(file)
      expect(file.parent).to.not.be.null

      dir.removeFile(file)
      expect(file.parent).to.be.null
    })

    it('throws if the file is not found', () => {
      const dir = new Directory('dir')
      const file = new File('file')
      dir.addFile(file)

      expect(() => dir.removeFile('foobar')).to.throw()
      expect(() => dir.removeFile(new File('file'))).to.throw()
      expect(() => dir.removeFile('file')).to.not.throw()
    })
  })

  describe('.clear()', () => {
    it('removes all files', () => {
      const dir = new Directory('dir')
      const file1 = new File('file1')
      const file2 = new File('file2')
      dir.addFile(file1)
      dir.addFile(file2)
      expect(dir.has(file1)).to.be.true
      expect(dir.has(file2)).to.be.true

      dir.clear()
      expect(dir.has(file1)).to.be.false
      expect(dir.has(file2)).to.be.false
    })

    it('sets the `parent` of all removed files to `null`', () => {
      const dir = new Directory('dir')
      const file1 = new File('file1')
      const file2 = new File('file2')
      dir.addFile(file1)
      dir.addFile(file2)
      expect(file1.parent).to.not.be.null
      expect(file2.parent).to.not.be.null

      dir.clear()
      expect(file1.parent).to.be.null
      expect(file2.parent).to.be.null
    })
  })

  describe('.get()', () => {
    it('gets the file', () => {
      const dir = new Directory('dir')
      const file = new File('file')
      dir.addFile(file)

      expect(dir.get('file')).to.equal(file)
      expect(dir.get('foobar')).to.be.undefined
    })
  })

  describe('.has()', () => {
    it('returns `true` if the file exists', () => {
      const dir = new Directory('dir')
      const file = new File('file')
      dir.addFile(file)

      expect(dir.has(file)).to.be.true
      expect(dir.has('file')).to.be.true
      expect(dir.has(new File('file'))).to.be.false
    })
  })

  describe('.forEach()', () => {
    it('iterates over all files', () => {
      const dir = new Directory('dir')
      const subFiles = [
        new Directory('subDir1'),
        new Directory('subDir2'),
        new File('subFile1'),
        new File('subFile2')
      ]
      for (const subFile of subFiles) {
        dir.addFile(subFile)
      }

      const iterated = []
      dir.forEach(subFile => {
        iterated.push(subFile)
      })

      for (let index = 0; index < subFiles.length; ++index) {
        expect(subFiles[index]).to.equal(iterated[index])
      }
    })
  })

  describe('[Symbol.iterator]', () => {
    it('iterates over all files', () => {
      const dir = new Directory('dir')
      const subFiles = [
        new Directory('subDir1'),
        new Directory('subDir2'),
        new File('subFile1'),
        new File('subFile2')
      ]
      for (const subFile of subFiles) {
        dir.addFile(subFile)
      }

      const iterated = []
      for (const subFile of dir) {
        iterated.push(subFile)
      }

      for (let index = 0; index < subFiles.length; ++index) {
        expect(subFiles[index]).to.equal(iterated[index])
      }
    })
  })
})

describe('Directory.isRoot', () => {
  it('filename is ignored in children\'s `path.parse()` properties', () => {
    const root = new Directory('root', true)
    const subDir = new Directory('dir')
    const subFile = new File('file')
    root.addFile(subDir.addFile(subFile))

    expect(subFile.path).to.equal(path.join(path.sep, 'dir', 'file'))
    expect(subFile.dir).to.equal(path.join(path.sep, 'dir'))
  })

  it(`sets \`root\` to \`${path.sep}\``, () => {
    const root = new Directory('root', true)
    const subDir = new Directory('dir')
    const subFile = new File('file')
    root.addFile(subDir.addFile(subFile))

    expect(root.root).to.equal(path.sep)
    expect(subDir.root).to.equal(path.sep)
    expect(subFile.root).to.equal(path.sep)
  })
})
