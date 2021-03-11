import { Cooker } from 'repo-cooker'

process.env.REPO_COOKER_GITHUB_TOKEN = process.env.GH_TOKEN

export const cooker = Cooker(process.argv, {
  path: '.',
  packagesGlobs: [
    'other/*',
    'packages/pawi',
    'packages/@pawi/*',
    'packages/examples',
    'packages/vscode-pawi',
  ],
})
