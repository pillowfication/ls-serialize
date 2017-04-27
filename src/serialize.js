const {File, Directory} = require('./structures');

function serialize(root, options) {
  const {levelInd, dirInd, fileInd} = options;

  if (!(root instanceof Directory)) {
    throw new TypeError('Expected first parameter to be of type Directory');
  }

  let output = `ROOT=${root.name}\n`;

  function _serialize(file, level) {
    if (file instanceof Directory) {
      output += levelInd.repeat(level) + dirInd + file.name + '\n';
      for (const [,subFile] of file) {
        _serialize(subFile, level + 1);
      }
    }

    else if (file instanceof File) {
      output += levelInd.repeat(level) + fileInd + file.name + '\n';
    }
  }

  for (const [,subFile] of root) {
    _serialize(subFile, 0);
  }
  return output;
}

module.exports = serialize;

let ls = require('./ls');
let p = require('path');
module.exports = serialize(ls(p.join(__dirname, '..', 'test')), {levelInd: ' ', dirInd: '+', fileInd: '-'})
