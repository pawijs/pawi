import { Cooker } from 'repo-cooker'

process.env.REPO_COOKER_GITHUB_TOKEN = process.env.GH_TOKEN

export const cooker = Cooker(process.argv, {
  path: '.',
  packagesGlobs: [
    'other/*',
    'packages/node_modules/pawi',
    'packages/node_modules/snowpack-pawi',
    'packages/node_modules/@pawi/*',
    'packages/vscode-pawi',
  ],
})
