import { Cooker } from 'repo-cooker'

process.env.REPO_COOKER_GITHUB_TOKEN = process.env.GH_TOKEN

const releaseGlobs = ['packages/pawi', 'packages/@pawi/*', 'other/*']

export const cooker = Cooker(process.argv, {
  devtools: {
    host: 'localhost:8787, reconnect: false',
  },
  path: '.',
  packagesGlobs:
    process.argv[2] === '--release'
      ? releaseGlobs
      : [
          ...releaseGlobs,
          'packages/examples',
          'packages/vscode-view',
          'packages/vscode-pawi',
        ],
})
