const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')

glob(`${__dirname}/../../public/locales/**/*.json`, (err, files) => {
  if (err) {
    return console.error(err)
  }
  files.forEach(file => {
    const trads = JSON.parse(readFileSync(file))
    Object.keys(trads).forEach(k => {
      if (trads[k] === '') {
        trads[k] = k
      }
    })
    writeFileSync(file, JSON.stringify(trads, null, 2))
  })
})
