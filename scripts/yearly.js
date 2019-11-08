const path = require('path')
const { fsPromises, getDirs } = require('./utils')

const cwd = process.cwd()


async function getYearlyDirs() {
  return (await getDirs(cwd)).filter(dirName => !isNaN(+dirName))
}

async function getWeeklyMdFiles(dir) {
  const filenames = (await fsPromises.readdir(dir)).filter(filename => (/\d{4}-\d+-\d+\.md/).test(filename))
  return filenames.map(filename => path.join(dir, filename)).reverse()
}

 
async function mergeWeeklyFiles(filepaths) {
  // console.log(filepaths)
  const strs = await Promise.all(filepaths.map(fp => fsPromises.readFile(fp, {
    encoding: 'utf-8'
  })))

  // console.log(strs)
  return strs.reduce((sum, item) => {
    return sum + '\n' + preDealWeeklyStr(item)
  }, '')
}

function preDealWeeklyStr(str) {
  str = str.replace(/\[toc\]/, '')
  return str
}

async function generateYearlyFile(year, str) {
  str = `# ${year}年刊\n` + str
  return fsPromises.writeFile(path.resolve(__dirname, `../yearly/${year}.md`), str)
}

async function run() {
  const years = await getYearlyDirs()
  const yearFiles = await Promise.all(
    years.map(year => getWeeklyMdFiles(year))
  )

  // console.log(yearFiles)

  for(let i = 0; i < yearFiles.length; i++) {
    await generateYearlyFile(
      years[i], 
      await (mergeWeeklyFiles(yearFiles[i]))
    )
  }

}

run().then(() => {
  console.log('generate yearlys successfully')
}, (e) => {
  console.error(e)
})