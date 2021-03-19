import { BlockDefinition, Branch } from '@forten/tree-type'
import { readFileSync } from 'fs'
import { glob } from 'glob'
import { dirname, join, resolve } from 'path'
import { workspace } from 'vscode'
import { relativePath } from './paths'
import { parseSource } from './serialize'

function findBranches(cwd: string) {
  return new Promise<string[]>((res, reject) =>
    glob(
      `!(node_modules)/**/index.o.ts`,
      { cwd, ignore: join(cwd, 'node_modules') },
      (err, files) => {
        if (err) {
          reject(err)
        }
        res(files.map(file => resolve(cwd, file)))
      }
    )
  )
}

// Return absolute paths to known branches in project
export async function getBranches(): Promise<string[]> {
  const paths: string[] = []
  const folders = workspace.workspaceFolders?.map(f => f.uri.path)
  if (!folders) {
    return []
  }
  // resolve in node_modules, hack for now
  for (const cwd of folders) {
    paths.push(...(await findBranches(cwd)))
  }
  return paths
}

export interface TouchedBranche {
  // Branch path
  path: string
  // Branch
  branch: Branch
  // Touched blocks
  blocks: BlockDefinition[]
}

// expects '.js' paths
export async function getTouchedBranches(paths: string[]) {
  const touchedBranches: TouchedBranche[] = []
  const branches = await getBranches()
  for (const branchPath of branches) {
    const files = paths.map(path => relativePath(dirname(branchPath), path))
    try {
      const branch = JSON.parse(
        parseSource(readFileSync(branchPath, 'utf-8'))
      ) as Branch
      let touched: TouchedBranche | undefined
      for (const block of Object.values(branch.blocks)) {
        if (files.includes(block.content.file)) {
          if (!touched) {
            touched = {
              path: branchPath,
              branch,
              blocks: [],
            }
            touchedBranches.push(touched)
          }
          touched.blocks.push(block)
        }
      }
    } catch (err) {
      console.error(err)
      // bad branches are ignored
    }
  }
  return touchedBranches
}
