const ls = require('./src/ls')
const serialize = require('./src/serialize')
const deserialize = require('./src/deserialize')
const { File, Directory } = require('./src/structures')

function lsSerialize (defaults) {
  defaults = Object.assign({
    levelInd: ' ',
    dirInd: '+',
    fileInd: '-'
  }, defaults)

  return {
    ls: dirPath => ls(dirPath),
    serialize: (root, options) => serialize(root, Object.assign({}, defaults, options)),
    deserialize: (dirString, options) => deserialize(dirString, Object.assign({}, defaults, options)),
    File,
    Directory
  }
}

module.exports = Object.assign(lsSerialize, lsSerialize())
