const glob = require('glob')

const log = (files, entries) =>
  console.log(
    `${files.length} file(s) were found containing ${Object.keys(entries).length} entries.`
  )

module.exports = path => {
  const files = glob.sync(path, { cwd: __dirname })
  const modules = files.map(file => require(file))
  const entries = Object.assign({}, ...modules)
  log(files, entries)

  return entries
}
