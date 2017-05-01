const {File, Directory} = require('./structures');

// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
function escape(val) {
  return val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function deserialize(dirString, options) {
  const {levelInd, dirInd, fileInd} = options;

  const lines = dirString.split('\n');
  const rootTest = /^ROOT=(.+)$/;
  const test = new RegExp(
    `^(${escape(levelInd)}*)` +
    `(${escape(dirInd)}|${escape(fileInd)})` +
    '(.+)$'
  );

  const rootMatch = lines[0].match(rootTest);
  if (!rootMatch) {
    throw new SyntaxError('First line must be `ROOT=[name]`');
  }

  const root = new Directory(rootMatch[1], true);
  let currDir = root;
  let currLevel = 0;

  for (let lineNumber = 1, length = lines.length - 1; lineNumber < length; ++lineNumber) {
    const match = lines[lineNumber].match(test);
    if (!match) {
      throw new SyntaxError(`Line ${lineNumber} was not of form ${test}`);
    }

    const level = match[1].length;
    const isDir = match[2] === dirInd;
    const isFile = match[2] === fileInd;
    const fileName = match[3];
    if (level > currLevel) {
      throw new SyntaxError(`Line ${lineNumber} cannot have \`level > ${currLevel}\``);
    }

    for (let i = 0; i < currLevel - level; ++i) {
      currDir = currDir.parent;
    }
    currLevel = level;

    if (isDir) {
      const subDir = new Directory(fileName);
      currDir.addFile(subDir);
      currDir = subDir;
      ++currLevel;
    }

    else if (isFile) {
      const subFile = new File(fileName);
      currDir.addFile(subFile);
    }
  }

  return root;
}

module.exports = deserialize;
