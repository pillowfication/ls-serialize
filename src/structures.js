const path = require('path');

class File {
  constructor(base) {
    const parsed = path.parse(base);
    this.parent = null;
    this.base = parsed.base;
    this.ext = parsed.ext;
    this.name = parsed.name;
  }

  get path() {
    return this.parent ? path.join(this.parent.path, this.base) : this.base;
  }
  get root() {
    return this.parent ? this.parent.root : '';
  }
  get dir() {
    return this.parent ? this.parent.path : '';
  }
}

class Directory {
  constructor(base, _isRoot) {
    this._map = new Map();
    this._isRoot = _isRoot;
    const parsed = path.parse(base);
    this.base = parsed.base;
    this.ext = parsed.ext;
    this.name = parsed.name;
  }

  get path() {
    return this.parent
      ? path.join(this.parent.path, this.base)
      : this._isRoot ? path.sep : this.base;
  }
  get root() {
    return this._isRoot ? path.sep : '';
  }
  get dir() {
    return this.parent ? this.parent.path : '';
  }

  get files() {
    return this._map.values();
  }
  get fileNames() {
    return this._map.keys();
  }

  addFile(file) {
    if (!(file instanceof File) && !(file instanceof Directory)) {
      throw new TypeError('File added must be of type File or Directory');
    }
    if (this.has(file.base)) {
      throw new TypeError(`File \`${file.base}\` already exists`);
    }
    this._map.set(file.base, file);
    file.parent = this;
    return this;
  }

  clear() {
    this.forEach(file => {
      file.parent = null;
    });
    return this._map.clear();
  }
  delete(fileName) {
    let file = this.get(fileName);
    if (file) {
      file.parent = null;
    }
    return this._map.delete(fileName);
  }
  forEach(cb) {
    return this._map.forEach(([, file]) => cb(file));
  }
  get(fileName) {
    return this._map.get(fileName);
  }
  has(fileName) {
    return this._map.has(fileName);
  }

  [Symbol.iterator]() {
    return this.files[Symbol.iterator]();
  }
}

module.exports = {
  File,
  Directory
};
