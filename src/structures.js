class File {
  constructor(name) {
    this.name = name;
    this.parent = null;
  }
}

class Directory extends Map {
  constructor(name) {
    super();
    this.name = name;
    this.parent = null;
  }

  addFile(file) {
    file.parent = this;
    this.set(file.name, file);
  }
}

module.exports = {
  File,
  Directory
};
