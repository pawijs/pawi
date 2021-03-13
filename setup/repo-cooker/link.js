import symlinkDir from 'symlink-dir'
import * as cook from 'repo-cooker/dist/actions'
import { resolve } from 'repo-cooker/dist/helpers/path'
import { runAll } from 'repo-cooker/dist/helpers/runAll'
import { cooker } from './'
import mkdirp from 'mkdirp'
import { dirname } from 'path'

// Alias to show 'linkToModule'
const linkOne = function linkToModule(sourcePackage, pkgAsModule) {
  return new Promise((resolve, reject) => {
    mkdirp(dirname(pkgAsModule))
      .then(() => {
        symlinkDir(sourcePackage, pkgAsModule).then(
          () => {
            resolve(true)
          },
          err => {
            console.warn(
              `Cannot create symlink '${pkgAsModule}' (there is a directory there probably).`
            )
            reject(err)
          }
        )
      })
      .catch(reject)
  })
}

function linkToModule({ config }) {
  const { runCommand } = config
  const packages = Object.keys(config.packagesPaths)
  const packagesPaths = Object.values(config.packagesPaths).map(p => resolve(p))
  let commonRoot = dirname(packagesPaths[0])
  while (packagesPaths.find(p => !p.startsWith(commonRoot))) {
    commonRoot = dirname(commonRoot)
  }
  const nodeModules = resolve(commonRoot, 'node_modules')

  return runAll(
    packages.map(name => {
      const packAsModule = resolve(nodeModules, name)
      return runCommand(linkOne, [config.packagesPaths[name], packAsModule])
    })
  ).then(results => ({
    [`linkToModule`]: Object.assign(
      {},
      ...results.map((result, idx) => ({
        [packages[idx]]: result,
      }))
    ),
  }))
}

cooker.cook('linkToModule', [
  cook.link,
  linkToModule,
  cook.fireworksWithTitle('link'),
])
