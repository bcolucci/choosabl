const { exec } = require('child_process')
const { writeFileSync } = require('fs')
const nextBuild = () =>
  new Promise(resolve =>
    exec('git rev-list --all --count', (_, stdout) =>
      resolve(String(Number(stdout.trim()) + 1).padStart(5, '0'))
    )
  )

const nextVersion = async (current, type) => {
  const [major, minor, patch] = current.split('.').map(Number)
  const now = new Date()
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('')
  const build = await nextBuild()
  return (
    [
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
    ].join('.') +
    '-' +
    date +
    build
  )
}

const updatePackageVersion = (dir = __dirname, type = 'patch') => {
  const pkgFile = `${dir}/package.json`
  const pkgData = require(pkgFile)
  nextVersion(pkgData.version, type).then(version =>
    writeFileSync(pkgFile, JSON.stringify({ ...pkgData, version }, null, 2))
  )
}

updatePackageVersion(...process.argv.slice(2))
