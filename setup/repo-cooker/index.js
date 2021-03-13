import { Cooker } from 'repo-cooker'

process.env.REPO_COOKER_GITHUB_TOKEN = process.env.GH_TOKEN

export const cooker = Cooker(process.argv, {
  path: '.',
  packagesGlobs: [
    'packages/pawi',
    'packages/pawi-link',
    'packages/snowpack-pawi',
    'packages/@pawi/*',
    'packages/vscode-pawi',
    'packages/other/*',
  ],
})
