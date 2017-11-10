const path = require('path')

class File {
  constructor (base) {
    const parsed = path.parse(base)
    this.parent = null
    this.base = parsed.base
    this.ext = parsed.ext
    this.name = parsed.name
  }

  get path () {
    return this.parent ? path.join(this.parent.path, this.base) : this.base
  }
  get root () {
    return this.parent ? this.parent.root : ''
  }
  get dir () {
    return this.parent ? this.parent.path : ''
  }
}

class Directory {
  constructor (base, isRoot) {
    this._map = new Map()
    this.isRoot = isRoot
    const parsed = path.parse(base)
    this.parent = null
    this.base = parsed.base
    this.ext = parsed.ext
    this.name = parsed.name
  }

  get path () {
    return this.parent
      ? path.join(this.parent.path, this.base)
      : this.isRoot ? path.sep : this.base
  }
  get root () {
    return this.parent
      ? this.parent.root
      : this.isRoot ? path.sep : ''
  }
  get dir () {
    return this.parent ? this.parent.path : ''
  }

  get files () {
    return this._map.values()
  }
  get fileNames () {
    return this._map.keys()
  }

  addFile (file) {
    if (!(file instanceof File) && !(file instanceof Directory)) {
      throw new TypeError('File added must be of type File or Directory')
    }
    if (this.has(file.base)) {
      throw new TypeError(`File \`${file.base}\` already exists`)
    }
    this._map.set(file.base, file)
    file.parent = this
    return this
  }

  removeFile (file) {
    if (!(file instanceof File) && !(file instanceof Directory)) {
      file = this.get(file)
    }
    let fileName = file && file.base

    if (!fileName || !this.has(fileName) || file !== this.get(fileName)) {
      throw new TypeError(`File \`${fileName}\` not found`)
    }

    file.parent = null
    return this._map.delete(fileName)
  }

  clear () {
    for (const file of this) {
      file.parent = null
    }

    return this._map.clear()
  }

  get (fileName) {
    return this._map.get(fileName)
  }

  has (file) {
    if (!(file instanceof File) && !(file instanceof Directory)) {
      file = this.get(file)
    }
    let fileName = file && file.base

    return file ? this.get(fileName) === file : false
  }

  forEach (callback) {
    for (const file of this) {
      callback(file)
    }
  }

  [Symbol.iterator] () {
    return this.files[Symbol.iterator]()
  }
}

module.exports = {
  File,
  Directory
}
