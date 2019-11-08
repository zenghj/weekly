const util = require('util')
const fs = require('fs')

const fsPromises = {
  readdir: util.promisify(fs.readdir),
  readFile: util.promisify(fs.readFile),
  stat: util.promisify(fs.stat),
  writeFile: util.promisify(fs.writeFile),
  copyFile: util.promisify(fs.copyFile)
}

async function getDirs(dirPath) {
  const files = await fsPromises.readdir(dirPath)
  const result = []

  for(let file of files) {
    const stats = await fsPromises.stat(file)
    if (stats.isDirectory()) {
      result.push(file)
    }
  }
  return result;
}

module.exports = {
  fsPromises,
  getDirs
}