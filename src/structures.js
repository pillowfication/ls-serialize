class File {
  constructor(name) {
    this.name = name;
    this.parent = null;
  }

  get path() {
    let pathname = this.name;
    let currDir = this;

    while (currDir.parent) {
      currDir = currDir.parent;
      pathname = `${currDir.name}/${pathname}`;
    }

    return pathname;
  }

  get pathURIEncoded() {
    let pathname = encodeURIComponent(this.name);
    let currDir = this;

    while (currDir.parent) {
      currDir = currDir.parent;
      pathname = `${encodeURIComponent(currDir.name)}/${pathname}`;
    }

    return pathname;
  }
}

class Directory extends Map {
  constructor(name) {
    super();
    this.name = name;
    this.parent = null;
  }

  get path() {
    let pathname = this.name;
    let currDir = this;

    while (currDir.parent) {
      currDir = currDir.parent;
      pathname = `${currDir.name}/${pathname}`;
    }

    return pathname;
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
