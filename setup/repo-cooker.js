import { Cooker } from 'repo-cooker'

process.env.REPO_COOKER_GITHUB_TOKEN = process.env.GH_TOKEN

export const cooker = Cooker(process.argv, {
  devtools: {
    host: 'localhost:8787, reconnect: false',
  },
  path: '.',
  packagesGlobs: [
    'packages/@pawi/*',
    'packages/examples',
    'packages/pawi',
    'packages/vscode-view',
    'packages/vscode-pawi',
    'other/*',
  ],
})
