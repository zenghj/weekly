const path = require('path')
const fs = require('fs')
const date = new Date()
const readmeFilePath = path.resolve(__dirname, '../README.md')
const { fsPromises } = require('./utils')

function getFileMeta(date) {
  let year = date.getFullYear()
  let month = (date.getMonth() + 1 + '').padStart(2, '0')
  let day = (date.getDate() + '').padStart(2, '0')
  let dateStr = `${year}-${month}-${day}`
  let relativePath = `../${year}/${dateStr}.md`
  return {
    absolute: path.resolve(__dirname, relativePath),
    relative: `./${year}/${dateStr}.md`,
    dateStr: dateStr
  }
}
function geneWeekFile(fileMeta) {
  let filePath = fileMeta.absolute
  if (!fs.existsSync(filePath)) {
    fsPromises.writeFile(
      filePath,
      `
[toc]

# ${fileMeta.dateStr}

## 阅读 ✨✨✨

## 阅读延伸 ✨
`
    )
  }
}

async function updateReadMe(fileMeta) {
  let str = await fsPromises.readFile(readmeFilePath)
  if (!str.includes(fileMeta.dateStr)) {
    str += `\n* [${fileMeta.dateStr}](${fileMeta.relative})`
  }
  return fsPromises.writeFile(readmeFilePath, str)
}

;(function run() {
  if (date.getDay() === 1) {
    let meta = getFileMeta(date)
    geneWeekFile(meta)
    updateReadMe(meta)
  } else {
    console.log("Force to do this job at Monday. It should be a habit！🙂")
  }
})()
