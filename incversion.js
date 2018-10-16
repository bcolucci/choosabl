const { writeFileSync } = require('fs')

const nextVersion = async (current, type) => {
  const [major, minor, patch] = current.split('.').map(Number)
  return [
    ...(() => {
      switch (type) {
        case 'patch':
          return [major, minor, patch + 1]
        case 'minor':
          return [major, minor + 1, 0]
        case 'major':
          return [major + 1, 0, 0]
      }
    })()
  ].join('.')
}

const updatePackageVersion = (dir = __dirname, type = 'patch') => {
  const pkgFile = `${dir}/package.json`
  const pkgData = require(pkgFile)
  nextVersion(pkgData.version, type).then(version =>
    writeFileSync(pkgFile, JSON.stringify({ ...pkgData, version }, null, 2))
  )
}

updatePackageVersion(...process.argv.slice(2))
