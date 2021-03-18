import { existsSync, readFileSync } from 'fs'
import { glob } from 'glob'
import { join } from 'path'
import { rootPath } from './paths'

function findFiles(cwd: string, prefix: string, ts = false) {
  return new Promise<string[]>((resolve, reject) =>
    glob(
      `!(node_modules)/**/*.o.${ts ? 'ts' : 'js'}`,
      { cwd, ignore: join(cwd, 'node_modules') },
      (err, files) => {
        if (err) {
          reject(err)
        }
        resolve(
          files.map(f => `${prefix}/${ts ? f.replace(/\.ts$/, '.js') : f}`)
        )
      }
    )
  )
}

function packageJson(
  cwd: string
): { name?: string; type?: string; dependencies?: { [lib: string]: string } } {
  const packageFile = join(cwd, 'package.json')
  if (!existsSync(packageFile)) {
    return {}
  }
  return JSON.parse(readFileSync(packageFile, 'utf-8'))
}

async function moduleFilesFromDep(cwd: string) {
  const { name, type } = packageJson(cwd)
  if (!name || type !== 'module') {
    // skip
    return []
  } else {
    return findFiles(cwd, name)
  }
}

async function moduleFiles(cwd: string) {
  const { dependencies } = packageJson(cwd)
  if (!dependencies) {
    return []
  }
  const files: string[] = []
  for (const dep in dependencies) {
    files.push(...(await moduleFilesFromDep(join(cwd, 'node_modules', dep))))
  }
  return files
}

export async function makeLibrary(documentPath: string): Promise<string[]> {
  const root = rootPath(documentPath)
  if (!root) {
    return []
  }
  const paths = [
    ...(await findFiles(root, root, true)),
    ...(await moduleFiles(root)),
  ]
  return paths.sort()
}
