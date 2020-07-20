const fs = require('fs')
const path = require('path')
const { File, Directory } = require('./structures')

function ls (dirPath) {
  const root = new Directory(path.basename(dirPath), true)

  function _ls (dir, dirPath) {
    for (const fileName of fs.readdirSync(dirPath)) {
      const filePath = path.join(dirPath, fileName)
      const fileStat = fs.statSync(filePath)

      if (fileStat.isDirectory()) {
        const subDir = new Directory(fileName)
        dir.addFile(subDir)
        _ls(subDir, filePath)
      } else if (fileStat.isFile()) {
        const file = new File(fileName)
        dir.addFile(file)
      }
    }
  }

  _ls(root, dirPath)
  return root
}

module.exports = ls
