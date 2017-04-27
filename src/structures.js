class File {
  constructor(path, name) {
    this.path = path;
    this.name = name;
  }
}

class Directory extends File {
  constructor(path, name) {
    super(path, name);
  }
}

module.exports = {
  File,
  Directory
};
